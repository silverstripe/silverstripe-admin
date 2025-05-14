<?php

namespace SilverStripe\Admin;

use BadMethodCallException;
use InvalidArgumentException;
use SilverStripe\Control\ContentNegotiator;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Control\HTTPResponse_Exception;
use SilverStripe\Control\Middleware\HTTPCacheControlMiddleware;
use SilverStripe\Forms\HTMLEditor\HTMLEditorConfig;
use SilverStripe\i18n\i18n;
use SilverStripe\i18n\i18nEntityProvider;
use SilverStripe\Security\Permission;
use SilverStripe\Security\Security;
use SilverStripe\Versioned\Versioned;
use SilverStripe\View\SSViewer;

/**
 * The base class for all controllers routed using the /admin/* route.
 *
 * This class is automatically routed via the AdminRootController.
 * It's responsible for ensuring permissions are respected.
 */
abstract class AdminController extends Controller implements i18nEntityProvider
{
    /**
     * The current url segment attached to the controller
     */
    private static ?string $url_segment = null;

    /**
     * Used by {@link AdminRootController} to augment Director route rules for subclasses of AdminController
     */
    private static string $url_rule = '/$Action/$ID/$OtherID';

    /**
     * Priority order for routing rules. If two controllers match a given request, the one with a higher
     * priority will handle the request.
     */
    private static int $url_priority = 50;

    /**
     * Codes which are required from the current user to view this controller.
     *
     * If multiple codes are provided, all of them are required.
     * All CMS controllers require "CMS_ACCESS_LeftAndMain" as a baseline check,
     * and fall back to "CMS_ACCESS_<class>" if no permissions are defined here.
     * See {@link canView()} for more details on permission checks.
     */
    private static string|array $required_permission_codes = [];

    /**
     * The configuration passed to the supporting JS for each CMS section includes a 'name' key
     * that by default matches the FQCN of the current class. This setting allows you to change
     * the key if necessary (for example, if you are overloading CMSMain or another core class
     * and want to keep the core JS - which depends on the core class names - functioning, you
     * would need to set this to the FQCN of the class you are overloading).
     *
     * See getClientConfig()
     */
    private static ?string $section_name = null;

    /**
     * Get list of required permissions for accessing this controller.
     * If false, no permission is required.
     */
    public static function getRequiredPermissions(): array|string|false
    {
        if (static::class === AdminController::class) {
            throw new BadMethodCallException('getRequiredPermissions should be called on a subclass');
        }
        // If the user is accessing LeftAndMain directly, only generic permissions are required.
        if (static::class === LeftAndMain::class) {
            return 'CMS_ACCESS';
        }
        $codes = static::config()->get('required_permission_codes');
        // allow explicit FALSE to disable subclass check
        if ($codes === false) {
            return false;
        }
        if ($codes) {
            return $codes;
        }
        // Fallback if no explicit permission was declared
        return 'CMS_ACCESS_' . static::class;
    }

    public function canView($member = null)
    {
        if (!$member && $member !== false) {
            $member = Security::getCurrentUser();
        }

        // don't allow unauthenticated users
        if (!$member) {
            return false;
        }

        // alternative extended checks
        if ($this->hasMethod('alternateAccessCheck')) {
            $alternateAllowed = $this->alternateAccessCheck($member);
            if ($alternateAllowed === false) {
                return false;
            }
        }

        // Check for "Access to all CMS sections" permission
        if (Permission::checkMember($member, 'CMS_ACCESS_LeftAndMain')) {
            return true;
        }

        // Check for permission to access this specific controller
        $codes = static::getRequiredPermissions();
        // allow explicit FALSE to disable subclass check
        if ($codes === false) {
            return true;
        }
        foreach ((array) $codes as $code) {
            if (!Permission::checkMember($member, $code)) {
                return false;
            }
        }

        return true;
    }

    public function Link($action = null)
    {
        // LeftAndMain methods have a top-level uri access
        if (static::class === LeftAndMain::class) {
            $segment = '';
        } else {
            // Get url_segment
            $segment = static::config()->get('url_segment');
            if (!$segment) {
                throw new BadMethodCallException(
                    sprintf('AdminController subclasses (%s) must have url_segment', static::class)
                );
            }
        }

        $link = Controller::join_links(
            AdminRootController::admin_url(),
            $segment,
            "$action"
        );
        $this->extend('updateLink', $link);
        return $link;
    }

    /**
     * Overloaded redirection logic to trigger a fake redirect on ajax requests.
     * While this violates HTTP principles, its the only way to work around the
     * fact that browsers handle HTTP redirects opaquely, no intervention via JS is possible.
     * In isolation, that's not a problem - but combined with history.pushState()
     * it means we would request the same redirection URL twice if we want to update the URL as well.
     * See LeftAndMain.js for the required jQuery ajaxComplete handlers.
     */
    public function redirect(string $url, int $code = 302): HTTPResponse
    {
        if ($this->getRequest()->isAjax()) {
            $response = $this->getResponse();
            $response->addHeader('X-ControllerURL', $url);
            if ($this->getRequest()->getHeader('X-Pjax') && !$response->getHeader('X-Pjax')) {
                $response->addHeader('X-Pjax', $this->getRequest()->getHeader('X-Pjax'));
            }
            $newResponse = new LeftAndMain_HTTPResponse(
                $response->getBody(),
                $response->getStatusCode(),
                $response->getStatusDescription()
            );
            foreach ($response->getHeaders() as $k => $v) {
                $newResponse->addHeader($k, $v);
            }
            $newResponse->setIsFinished(true);
            $this->setResponse($newResponse);
            // Actual response will be re-requested by client
            return $newResponse;
        } else {
            return parent::redirect($url, $code);
        }
    }

    /**
     * Returns configuration required by the client app
     */
    public function getClientConfig(): array
    {
        // Allows the section name to be overridden in config
        $name = static::config()->get('section_name') ?: static::class;
        // Trim leading/trailing slash to make it easier to concatenate URL
        // and use in routing definitions.
        $url = trim($this->Link(), '/');
        $clientConfig = [
            'name' => $name,
            'url' => $url,
            'reactRoutePath' => preg_replace('/^' . preg_quote(AdminRootController::admin_url(), '/') . '/', '', $url),
        ];
        $this->extend('updateClientConfig', $clientConfig);
        return $clientConfig;
    }

    protected function init()
    {
        parent::init();

        HTTPCacheControlMiddleware::singleton()->disableCache();

        SSViewer::setRewriteHashLinksDefault(false);
        ContentNegotiator::setEnabled(false);

        // set language
        $member = Security::getCurrentUser();
        if (!empty($member->Locale)) {
            i18n::set_locale($member->Locale);
        }

        // Don't allow access if the request hasn't finished being handled and the user can't access this controller
        if (!$this->canView() && !$this->getResponse()->isFinished()) {
            // Allow subclasses and extensions to redirect somewhere more appropriate
            $this->invokeWithExtensions('onInitPermissionFailure');

            // If we're redirecting away, just let that happen
            if ($this->getResponse()->isRedirect()) {
                return;
            }

            if (Security::getCurrentUser()) {
                $this->getRequest()->getSession()->clear("BackURL");
            }

            // if no alternate menu items have matched, return a permission error
            $messageSet = [
                'default' => _t(
                    __CLASS__ . '.PERMDEFAULT',
                    "You must be logged in to access the administration area."
                ),
                'alreadyLoggedIn' => _t(
                    __CLASS__ . '.PERMALREADY',
                    "I'm sorry, but you can't access that part of the CMS."
                ),
                'logInAgain' => _t(
                    __CLASS__ . '.PERMAGAIN',
                    "You have been logged out of the CMS."
                ),
            ];

            $this->suppressAdminErrorContext = true;
            Security::permissionFailure($this, $messageSet);
            return;
        }

        // Don't continue if there's already been a redirection request.
        if ($this->getResponse()->isRedirect()) {
            return;
        }

        $this->extend('onInit');

        // Load the editor with original user themes before overwriting
        // them with admin themes
        $themes = HTMLEditorConfig::getThemes();
        if (empty($themes)) {
            HTMLEditorConfig::setThemes(SSViewer::get_themes());
        }

        // Assign default cms theme and replace user-specified themes
        // This ensures any templates rendered use appropriate templates and resources
        // instead of the front-end ones
        SSViewer::set_themes(LeftAndMain::config()->uninherited('admin_themes'));

        // Set the current reading mode
        Versioned::set_stage(Versioned::DRAFT);

        // Set default reading mode to suppress ?stage=Stage querystring params in CMS
        Versioned::set_default_reading_mode(Versioned::get_reading_mode());
    }

    /**
     * Get a data value from JSON in body of the POST request, ensuring it exists
     * Will only read from the root node of the JSON body
     */
    protected function getPostedJsonValue(HTTPRequest $request, string $key): mixed
    {
        $data = json_decode($request->getBody(), true);
        if (!array_key_exists($key, $data)) {
            $this->jsonError(400);
        }
        return $data[$key];
    }

    /**
     * Creates a successful json response
     */
    protected function jsonSuccess(int $statusCode, ?array $data = null): HTTPResponse
    {
        if ($statusCode < 200 || $statusCode >= 300) {
            throw new InvalidArgumentException("Status code $statusCode must be between 200 and 299");
        }
        if (is_null($data)) {
            $body = '';
        } else {
            $body = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        }
        return $this->getResponse()
            ->addHeader('Content-Type', 'application/json')
            ->setStatusCode($statusCode)
            ->setBody($body);
    }

    /**
     * Throw an error HTTPResponse encoded as json
     *
     * @throws HTTPResponse_Exception which interrupts request handling with the appropriate response
     */
    protected function jsonError(int $errorCode, string $errorMessage = ''): void
    {
        // Build error from message
        $error = [
            'type' => 'error',
            'code' => $errorCode,
        ];
        if ($errorMessage) {
            $error['value'] = $errorMessage;
        } else {
            $messageDefault = $this->getErrorCodeDefaultMessages()[$errorCode] ?? null;
            if ($messageDefault) {
                /** @phpstan-ignore translation.key (we need the key to be dynamic here) */
                $error['value'] = _t(__CLASS__ . ".ErrorMessage{$errorCode}", $messageDefault);
            } else {
                $error['value'] = _t(
                    __CLASS__ . ".ErrorMessage",
                    'Sorry, it seems there was a {errorcode} error.',
                    ['errorcode' => $errorCode]
                );
            }
        }

        // Support explicit error handling with status = error, or generic message handling
        // with a message of type = error
        $result = [
            'status' => 'error',
            'errors' => [$error]
        ];
        $response = HTTPResponse::create(json_encode($result), $errorCode)
            ->addHeader('Content-Type', 'application/json');

        // Call a handler method such as onBeforeHTTPError404
        $this->extend("onBeforeJSONError{$errorCode}", $request, $response);

        // Call a handler method such as onBeforeHTTPError, passing 404 as the first arg
        $this->extend('onBeforeJSONError', $errorCode, $request, $response);

        // Throw a new exception
        throw new HTTPResponse_Exception($response);
    }

    public function provideI18nEntities()
    {
        $entities = [];
        foreach ($this->getErrorCodeDefaultMessages() as $errorCode => $message) {
            $entities[__CLASS__ . ".ErrorMessage{$errorCode}"] = $message;
        }
        return $entities;
    }

    private function getErrorCodeDefaultMessages(): array
    {
        return [
            400 => 'Sorry, it seems there was something wrong with the request.',
            401 => 'Sorry, it seems you are not authorised to access this section or object.',
            403 => 'Sorry, it seems the action you were trying to perform is forbidden.',
            404 => 'Sorry, it seems you were trying to access a section or object that doesn\'t exist.',
            500 => 'Sorry, it seems there was an internal server error.',
            503 => 'Sorry, it seems the service is temporarily unavailable.',
        ];
    }
}
