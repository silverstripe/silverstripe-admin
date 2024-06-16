<?php

namespace SilverStripe\Admin;

use BadMethodCallException;
use InvalidArgumentException;
use LogicException;
use ReflectionClass;
use SilverStripe\CMS\Controllers\CMSMain;
use SilverStripe\Admin\Navigator\SilverStripeNavigator;
use SilverStripe\Control\ContentNegotiator;
use SilverStripe\Control\Controller;
use SilverStripe\Control\Director;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Control\HTTPResponse_Exception;
use SilverStripe\Control\Middleware\HTTPCacheControlMiddleware;
use SilverStripe\Control\PjaxResponseNegotiator;
use SilverStripe\Core\ClassInfo;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Convert;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Core\Manifest\ModuleResourceLoader;
use SilverStripe\Core\Manifest\VersionProvider;
use SilverStripe\Dev\TestOnly;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\HTMLEditor\HTMLEditorConfig;
use SilverStripe\Forms\HTMLEditor\TinyMCEConfig;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\PrintableTransformation;
use SilverStripe\Forms\Schema\FormSchema;
use SilverStripe\i18n\i18n;
use SilverStripe\ORM\ArrayList;
use SilverStripe\ORM\CMSPreviewable;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\FieldType\DBField;
use SilverStripe\ORM\FieldType\DBHTMLText;
use SilverStripe\ORM\Hierarchy\Hierarchy;
use SilverStripe\ORM\SS_List;
use SilverStripe\ORM\ValidationException;
use SilverStripe\ORM\ValidationResult;
use SilverStripe\Security\Member;
use SilverStripe\Security\Permission;
use SilverStripe\Security\PermissionProvider;
use SilverStripe\Security\Security;
use SilverStripe\Security\SecurityToken;
use SilverStripe\SiteConfig\SiteConfig;
use SilverStripe\Versioned\Versioned;
use SilverStripe\View\ArrayData;
use SilverStripe\View\Requirements;
use SilverStripe\View\SSViewer;

/**
 * LeftAndMain is the parent class of all the two-pane views in the CMS.
 * If you are wanting to add more areas to the CMS, you can do it by subclassing LeftAndMain.
 *
 * This is essentially an abstract class which should be subclassed.
 * See {@link CMSMain} for a good example.
 */
class LeftAndMain extends Controller implements PermissionProvider
{

    /**
     * Form schema header identifier
     */
    const SCHEMA_HEADER = 'X-Formschema-Request';

    /**
     * Enable front-end debugging (increases verbosity) in dev mode.
     * Will be ignored in live environments.
     *
     * @var bool
     */
    private static $client_debugging = true;

    /**
     * The current url segment attached to the LeftAndMain instance
     *
     * @config
     * @var string
     */
    private static $url_segment = null;

    /**
     * @config
     * @var string Used by {@link AdminRootController} to augment Director route rules for sub-classes of LeftAndMain
     */
    private static $url_rule = '/$Action/$ID/$OtherID';

    /**
     * @config
     * @var string
     */
    private static $menu_title;

    /**
     * @config
     * @var string
     */
    private static $menu_icon;

    /**
     * @config
     * @var int
     */
    private static $menu_priority = 0;

    /**
     * @config
     * @var int
     */
    private static $url_priority = 50;

    /**
     * A subclass of {@link DataObject}.
     *
     * Determines what is managed in this interface, through
     * {@link getEditForm()} and other logic.
     *
     * @config
     * @var string
     */
    private static $tree_class = null;

    /**
     * @var array
     */
    private static $allowed_actions = [
        'index',
        'save',
        'printable',
        'show',
        'Modals',
        'EditForm',
        'AddForm',
        'batchactions',
        'BatchActionsForm',
        'schema',
        'methodSchema',
    ];

    private static $url_handlers = [
        'GET schema/$FormName/$ItemID/$OtherItemID' => 'schema',
        'GET methodSchema/$Method/$FormName/$ItemID' => 'methodSchema',
    ];

    private static $dependencies = [
        'FormSchema' => '%$' . FormSchema::class,
        'VersionProvider' => '%$' . VersionProvider::class,
    ];

    /**
     * Current form schema helper
     *
     * @var FormSchema
     */
    protected $schema = null;

    /**
     * Current pageID for this request
     *
     * @var null
     */
    protected $pageID = null;

    /**
     * Set by {@link LeftAndMainErrorExtension} if an http error occurs
     */
    private string $httpErrorMessage;

    /**
     * Used to allow errors to be displayed using a front-end template
     */
    private bool $suppressAdminErrorContext = false;

    /**
     * Themes to use within the CMS
     *
     * Default themes are assigned in _config/themes.yml
     *
     * @config
     * @var array
     */
    private static $admin_themes = [];

    /**
     * Codes which are required from the current user to view this controller.
     * If multiple codes are provided, all of them are required.
     * All CMS controllers require "CMS_ACCESS_LeftAndMain" as a baseline check,
     * and fall back to "CMS_ACCESS_<class>" if no permissions are defined here.
     * See {@link canView()} for more details on permission checks.
     *
     * @config
     * @var array
     */
    private static $required_permission_codes;

    /**
     * Namespace for session info, e.g. current record.
     * Defaults to the current class name, but can be amended to share a namespace in case
     * controllers are logically bundled together, and mainly separated
     * to achieve more flexible templating.
     *
     * @config
     * @var string
     */
    private static $session_namespace;

    /**
     * Register additional requirements through the {@link Requirements} class.
     * Used mainly to work around the missing "lazy loading" functionality
     * for getting css/javascript required after an ajax-call (e.g. loading the editform).
     *
     * YAML configuration example:
     * <code>
     * LeftAndMain:
     *   extra_requirements_javascript:
     *     - mysite/javascript/myscript.js
     *     mysite/javascript/anotherscript.js:
     *       defer: true
     * </code>
     *
     * @config
     * @var array
     */
    private static $extra_requirements_javascript = [];

    /**
     * Register additional i18n requirements through the {@link Requirements} class.
     *
     * YAML configuration example:
     * <code>
     * LeftAndMain:
     *   extra_requirements_i18n:
     *     - mysite/client/lang
     *     'myorg/mymodule:client/lang': true
     * </code>
     * @var array See {@link extra_requirements_javascript}
     */
    private static array $extra_requirements_i18n = [];

    /**
     * YAML configuration example:
     * <code>
     * LeftAndMain:
     *   extra_requirements_css:
     *     mysite/css/mystyle.css:
     *       media: screen
     * </code>
     *
     * @config
     * @var array See {@link extra_requirements_javascript}
     */
    private static $extra_requirements_css = [];

    /**
     * @config
     * @var array See {@link extra_requirements_javascript}
     */
    private static $extra_requirements_themedCss = [];

    /**
     * If true, call a keepalive ping every 5 minutes from the CMS interface,
     * to ensure that the session never dies.
     *
     * @config
     * @var bool
     */
    private static $session_keepalive_ping = true;

    /**
     * Value of X-Frame-Options header
     *
     * @config
     * @var string
     */
    private static $frame_options = 'SAMEORIGIN';

    /**
     * The configuration passed to the supporting JS for each CMS section includes a 'name' key
     * that by default matches the FQCN of the current class. This setting allows you to change
     * the key if necessary (for example, if you are overloading CMSMain or another core class
     * and want to keep the core JS - which depends on the core class names - functioning, you
     * would need to set this to the FQCN of the class you are overloading).
     *
     * @config
     * @var string|null
     */
    private static $section_name = null;

    /**
     * @var PjaxResponseNegotiator
     */
    protected $responseNegotiator;

    /**
     * @var VersionProvider
     */
    protected $versionProvider;

    /**
     * Gets the combined configuration of all LeftAndMain subclasses required by the client app.
     *
     * @return string
     *
     * WARNING: Experimental API
     */
    public function getCombinedClientConfig()
    {
        $combinedClientConfig = ['sections' => []];
        $cmsClassNames = CMSMenu::get_cms_classes(LeftAndMain::class, true, CMSMenu::URL_PRIORITY);

        // append LeftAndMain to the list as well
        $cmsClassNames[] = LeftAndMain::class;
        foreach ($cmsClassNames as $className) {
            $combinedClientConfig['sections'][] = Injector::inst()->get($className)->getClientConfig();
        }

        // Pass in base url (absolute and relative)
        $combinedClientConfig['baseUrl'] = Director::baseURL();
        $combinedClientConfig['absoluteBaseUrl'] = Director::absoluteBaseURL();
        $combinedClientConfig['adminUrl'] = AdminRootController::admin_url();

        // Get "global" CSRF token for use in JavaScript
        $token = SecurityToken::inst();
        $combinedClientConfig[$token->getName()] = $token->getValue();

        // Set env
        $combinedClientConfig['environment'] = Director::get_environment_type();
        $combinedClientConfig['debugging'] = LeftAndMain::config()->uninherited('client_debugging');

        return json_encode($combinedClientConfig);
    }

    /**
     * Returns configuration required by the client app.
     *
     * @return array
     *
     * WARNING: Experimental API
     */
    public function getClientConfig()
    {
        // Allows the section name to be overridden in config
        $name = $this->config()->get('section_name');
        $url = trim($this->Link() ?? '', '/');

        if (!$name) {
            $name = static::class;
        }

        $clientConfig = [
            // Trim leading/trailing slash to make it easier to concatenate URL
            // and use in routing definitions.
            'name' => $name,
            'url' => $url,
            'reactRoutePath' => preg_replace('/^' . preg_quote(AdminRootController::admin_url(), '/') . '/', '', $url),
            'form' => [
                'EditorExternalLink' => [
                    'schemaUrl' => $this->Link('methodSchema/Modals/EditorExternalLink'),
                ],
                'EditorEmailLink' => [
                    'schemaUrl' => $this->Link('methodSchema/Modals/EditorEmailLink'),
                ],
            ],
        ];

        $this->extend('updateClientConfig', $clientConfig);

        return $clientConfig;
    }

    /**
     * Get form schema helper
     *
     * @return FormSchema
     */
    public function getFormSchema()
    {
        return $this->schema;
    }

    /**
     * Set form schema helper for this controller
     *
     * @param FormSchema $schema
     * @return $this
     */
    public function setFormSchema(FormSchema $schema)
    {
        $this->schema = $schema;
        return $this;
    }

    /**
     * Gets a JSON schema representing the current edit form.
     */
    public function schema(HTTPRequest $request): HTTPResponse
    {
        $formName = $request->param('FormName');
        $itemID = $request->param('ItemID');

        if (!$formName) {
            $this->jsonError(400, 'Missing request params');
        }

        $formMethod = "get{$formName}";
        if (!$this->hasMethod($formMethod)) {
            $this->jsonError(404, 'Form not found');
        }

        if (!$this->hasAction($formName)) {
            $this->jsonError(401, 'Form not accessible');
        }

        if ($itemID) {
            $form = $this->{$formMethod}($itemID);
        } else {
            $form = $this->{$formMethod}();
        }
        $schemaID = $request->getURL();
        return $this->getSchemaResponse($schemaID, $form);
    }

    /**
     * Creates a successful json response
     */
    protected function jsonSuccess(int $statusCode, array $data = []): HTTPResponse
    {
        if ($statusCode < 200 || $statusCode >= 300) {
            throw new InvalidArgumentException("Status code $statusCode must be between 200 and 299");
        }
        $body = empty($data) ? '' : json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        return $this->getResponse()
            ->addHeader('Content-Type', 'application/json')
            ->setStatusCode($statusCode)
            ->setBody($body);
    }

    /**
     * Return an error HTTPResponse encoded as json
     *
     * @param int $errorCode
     * @param string $errorMessage
     * @return HTTPResponse
     * @throws HTTPResponse_Exception
     */
    public function jsonError($errorCode, $errorMessage = null)
    {
        // Build error from message
        $error = [
            'type' => 'error',
            'code' => $errorCode,
        ];
        if ($errorMessage) {
            $error['value'] = $errorMessage;
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

    public function methodSchema(HTTPRequest $request): HTTPResponse
    {
        $method = $request->param('Method');
        $formName = $request->param('FormName');
        $itemID = $request->param('ItemID');

        if (!$formName || !$method) {
            $this->jsonError(400, 'Missing request params');
        }

        if (!$this->hasMethod($method)) {
            $this->jsonError(404, 'Method not found');
        }
        if (!$this->hasAction($method)) {
            $this->jsonError(401, 'Method not accessible');
        }

        $methodItem = $this->{$method}();
        if (!$methodItem->hasMethod($formName)) {
            $this->jsonError(404, 'Form not found');
        }
        if (!$methodItem->hasAction($formName)) {
            $this->jsonError(401, 'Form not accessible');
        }

        $form = $methodItem->{$formName}($itemID);
        $schemaID = $request->getURL();

        return $this->getSchemaResponse($schemaID, $form);
    }

    /**
     * Check if the current request has a X-Formschema-Request header set.
     * Used by conditional logic that responds to validation results
     *
     * @return bool
     */
    protected function getSchemaRequested()
    {
        $parts = $this->getRequest()->getHeader(static::SCHEMA_HEADER);
        return !empty($parts);
    }

    /**
     * Generate schema for the given form based on the X-Formschema-Request header value
     *
     * @param string $schemaID ID for this schema. Required.
     * @param Form $form Required for 'state' or 'schema' response
     * @param ValidationResult $errors Required for 'error' response
     * @param array $extraData Any extra data to be merged with the schema response
     */
    protected function getSchemaResponse($schemaID, $form = null, ValidationResult $errors = null, $extraData = []): HTTPResponse
    {
        $parts = $this->getRequest()->getHeader(static::SCHEMA_HEADER);
        $data = $this
            ->getFormSchema()
            ->getMultipartSchema($parts, $schemaID, $form, $errors);

        if ($extraData) {
            $data = array_merge($data, $extraData);
        }

        $response = new HTTPResponse(json_encode($data));
        $response->addHeader('Content-Type', 'application/json');
        return $response;
    }

    /**
     * @param Member $member
     * @return bool
     */
    public function canView($member = null)
    {
        if (!$member && $member !== false) {
            $member = Security::getCurrentUser();
        }

        // cms menus only for logged-in members
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

        // Check for "CMS admin" permission
        if (Permission::checkMember($member, "CMS_ACCESS_LeftAndMain")) {
            return true;
        }

        // Check for LeftAndMain sub-class permissions
        $codes = $this->getRequiredPermissions();
        if ($codes === false) { // allow explicit FALSE to disable subclass check
            return true;
        }
        foreach ((array)$codes as $code) {
            if (!Permission::checkMember($member, $code)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get list of required permissions
     *
     * @return array|string|bool Code, array of codes, or false if no permission required
     */
    public static function getRequiredPermissions()
    {
        $class = get_called_class();
        // If the user is accessing LeftAndMain directly, only generic permissions are required.
        if ($class === LeftAndMain::class) {
            return 'CMS_ACCESS';
        }
        $code = Config::inst()->get($class, 'required_permission_codes');
        if ($code === false) {
            return false;
        }
        if ($code) {
            return $code;
        }
        return 'CMS_ACCESS_' . $class;
    }

    /**
     * @uses LeftAndMainExtension->init()
     * @uses LeftAndMainExtension->accessedCMS()
     * @uses CMSMenu
     */
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

        // Allow customisation of the access check by a extension
        // Also all the canView() check to execute Controller::redirect()
        if (!$this->canView() && !$this->getResponse()->isFinished()) {
            // When access /admin/, we should try a redirect to another part of the admin rather than be locked out
            $menu = $this->MainMenu();
            foreach ($menu as $candidate) {
                if ($candidate->Link &&
                    $candidate->Link != $this->Link()
                    && $candidate->MenuItem->controller
                    && singleton($candidate->MenuItem->controller)->canView()
                ) {
                    $this->redirect($candidate->Link);
                    return;
                }
            }

            if (Security::getCurrentUser()) {
                $this->getRequest()->getSession()->clear("BackURL");
            }

            // if no alternate menu items have matched, return a permission error
            $messageSet = [
                'default' => _t(
                    __CLASS__ . '.PERMDEFAULT',
                    "You must be logged in to access the administration area; please enter your credentials below."
                ),
                'alreadyLoggedIn' => _t(
                    __CLASS__ . '.PERMALREADY',
                    "I'm sorry, but you can't access that part of the CMS.  If you want to log in as someone else, do"
                    . " so below."
                ),
                'logInAgain' => _t(
                    __CLASS__ . '.PERMAGAIN',
                    "You have been logged out of the CMS.  If you would like to log in again, enter a username and"
                    . " password below."
                ),
            ];

            $this->suppressAdminErrorContext = true;
            Security::permissionFailure($this, $messageSet);
            return;
        }

        // Don't continue if there's already been a redirection request.
        if ($this->redirectedTo()) {
            return;
        }

        // Audit logging hook
        if (empty($_REQUEST['executeForm']) && !$this->getRequest()->isAjax()) {
            $this->extend('accessedCMS');
        }

        // Set the members html editor config
        if (Security::getCurrentUser()) {
            HTMLEditorConfig::set_active_identifier(Security::getCurrentUser()->getHtmlEditorConfigForCMS());
        }

        // Set default values in the config if missing.  These things can't be defined in the config
        // file because insufficient information exists when that is being processed
        $htmlEditorConfig = HTMLEditorConfig::get_active();
        $htmlEditorConfig->setOption('language', TinyMCEConfig::get_tinymce_lang());
        $langUrl = TinyMCEConfig::get_tinymce_lang_url();
        if ($langUrl) {
            $htmlEditorConfig->setOption('language_url', $langUrl);
        }

        Requirements::customScript("
            window.ss = window.ss || {};
            window.ss.config = " . $this->getCombinedClientConfig() . ";
        ");

        Requirements::javascript('silverstripe/admin: client/dist/js/vendor.js');
        Requirements::javascript('silverstripe/admin: client/dist/js/bundle.js');

        // Bootstrap components
        Requirements::javascript('silverstripe/admin: thirdparty/popper/popper.min.js');
        Requirements::javascript('silverstripe/admin: thirdparty/bootstrap/js/dist/util.js');
        Requirements::javascript('silverstripe/admin: thirdparty/bootstrap/js/dist/collapse.js');
        Requirements::javascript('silverstripe/admin: thirdparty/bootstrap/js/dist/tooltip.js');
        Requirements::customScript(
            "window.jQuery('body').tooltip({ selector: '[data-toggle=tooltip]' });",
            'bootstrap.tooltip-boot'
        );

        Requirements::css('silverstripe/admin: client/dist/styles/bundle.css');
        Requirements::add_i18n_javascript('silverstripe/admin:client/lang');
        Requirements::add_i18n_javascript('silverstripe/admin:client/dist/moment-locales', false);

        if (LeftAndMain::config()->uninherited('session_keepalive_ping')) {
            Requirements::javascript('silverstripe/admin: client/dist/js/LeftAndMain.Ping.js');
        }

        // Custom requirements
        $extraJs = $this->config()->get('extra_requirements_javascript');

        if ($extraJs) {
            foreach ($extraJs as $file => $config) {
                if (is_numeric($file)) {
                    $file = $config;
                    $config = [];
                }

                Requirements::javascript($file, $config);
            }
        }

        $extraI18n = $this->config()->get('extra_requirements_i18n');
        if ($extraI18n) {
            foreach ($extraI18n as $dir => $return) {
                if (is_numeric($dir)) {
                    $dir = $return;
                    $return = false;
                }
                Requirements::add_i18n_javascript($dir, $return);
            }
        }

        $extraCss = $this->config()->get('extra_requirements_css');

        if ($extraCss) {
            foreach ($extraCss as $file => $config) {
                if (is_numeric($file)) {
                    $file = $config;
                    $config = [];
                }
                $media = null;
                if (isset($config['media'])) {
                     $media = $config['media'];
                     unset($config['media']);
                }

                Requirements::css($file, $media, $config);
            }
        }

        $extraThemedCss = $this->config()->get('extra_requirements_themedCss');

        if ($extraThemedCss) {
            foreach ($extraThemedCss as $file => $config) {
                if (is_numeric($file)) {
                    $file = $config;
                    $config = [];
                }
                $media = null;
                if (isset($config['media'])) {
                     $media = $config['media'];
                     unset($config['media']);
                }

                Requirements::themedCSS($file, $media, $config);
            }
        }

        $this->extend('init');

        // Load the editor with original user themes before overwriting
        // them with admin themes
        $themes = HTMLEditorConfig::getThemes();
        if (empty($themes)) {
            HTMLEditorConfig::setThemes(SSViewer::get_themes());
        }

        // Assign default cms theme and replace user-specified themes
        SSViewer::set_themes(LeftAndMain::config()->uninherited('admin_themes'));

        // Set the current reading mode
        Versioned::set_stage(Versioned::DRAFT);

        // Set default reading mode to suppress ?stage=Stage querystring params in CMS
        Versioned::set_default_reading_mode(Versioned::get_reading_mode());
    }

    public function afterHandleRequest()
    {
        if (!$this->suppressAdminErrorContext
            && $this->response->isError()
            && !$this->request->isAjax()
            && $this->response->getHeader('Content-Type') !== 'application/json'
        ) {
            $this->init();
            $errorCode = $this->response->getStatusCode();
            $errorType = $this->response->getStatusDescription();
            $defaultMessage = _t(
                LeftAndMain::class . '.ErrorMessage',
                'Sorry, it seems there was a {errorcode} error.',
                ['errorcode' => $errorCode]
            );
            $this->response = HTTPResponse::create($this->render([
                'Title' => $this->getApplicationName() . ' - ' . $errorType,
                'Content' => $this->renderWith($this->getTemplatesWithSuffix('_Error'), [
                    'ErrorCode' => $errorCode,
                    'ErrorType' => $errorType,
                    'Message' => DBField::create_field(
                        'HTMLFragment',
                        _t(LeftAndMain::class . '.ErrorMessage' . $errorCode, $defaultMessage)
                    ),
                ]),
            ]), $errorCode, $errorType);
        }
        parent::afterHandleRequest();
    }

    public function handleRequest(HTTPRequest $request): HTTPResponse
    {
        try {
            $response = parent::handleRequest($request);
        } catch (ValidationException $e) {
            // Nicer presentation of model-level validation errors
            $msgs = _t(__CLASS__ . '.ValidationError', 'Validation error') . ': '
                . $e->getMessage();
            $e = new HTTPResponse_Exception($msgs, 403);
            $errorResponse = $e->getResponse();
            $errorResponse->addHeader('Content-Type', 'text/plain');
            $errorResponse->addHeader('X-Status', rawurlencode($msgs));
            $e->setResponse($errorResponse);
            throw $e;
        }

        $title = $this->Title();
        if (!$response->getHeader('X-Controller')) {
            $response->addHeader('X-Controller', static::class);
        }
        if (!$response->getHeader('X-Title')) {
            $response->addHeader('X-Title', urlencode($title ?? ''));
        }

        // Prevent clickjacking, see https://developer.mozilla.org/en-US/docs/HTTP/X-Frame-Options
        $originalResponse = $this->getResponse();
        $originalResponse->addHeader('X-Frame-Options', LeftAndMain::config()->uninherited('frame_options'));
        $originalResponse->addHeader('Vary', 'X-Requested-With');

        return $response;
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

    public function index(HTTPRequest $request): HTTPResponse
    {
        return $this->getResponseNegotiator()->respond($request);
    }

    /**
     * If this is set to true, the "switchView" context in the
     * template is shown, with links to the staging and publish site.
     *
     * @return bool
     */
    public function ShowSwitchView()
    {
        return false;
    }


    //------------------------------------------------------------------------------------------//
    // Main controllers

    /**
     * You should implement a Link() function in your subclass of LeftAndMain,
     * to point to the URL of that particular controller.
     *
     * @param string $action
     * @return string
     */
    public function Link($action = null)
    {
        // LeftAndMain methods have a top-level uri access
        if (static::class === LeftAndMain::class) {
            $segment = '';
        } else {
            // Get url_segment
            $segment = $this->config()->get('url_segment');
            if (!$segment) {
                throw new BadMethodCallException(
                    sprintf('LeftAndMain subclasses (%s) must have url_segment', static::class)
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
     * Get menu title for this section (translated)
     *
     * @param string $class Optional class name if called on LeftAndMain directly
     * @param bool $localise Determine if menu title should be localised via i18n.
     * @return string Menu title for the given class
     */
    public static function menu_title($class = null, $localise = true)
    {
        if ($class && is_subclass_of($class, __CLASS__)) {
            // Respect oveloading of menu_title() in subclasses
            return $class::menu_title(null, $localise);
        }
        if (!$class) {
            $class = get_called_class();
        }

        // Get default class title
        $title = static::config()->get('menu_title');
        if (!$title) {
            $title = preg_replace('/Admin$/', '', $class ?? '');
        }

        // Check localisation
        if (!$localise) {
            return $title;
        }
        return i18n::_t("{$class}.MENUTITLE", $title);
    }

    /**
     * Return styling for the menu icon, if a custom icon is set for this class
     *
     * Example: static $menu-icon = '/path/to/image/';
     * @param string $class
     * @return string
     */
    public static function menu_icon_for_class($class)
    {
        $icon = Config::inst()->get($class, 'menu_icon');
        if (!empty($icon)) {
            $iconURL = ModuleResourceLoader::resourceURL($icon);
            $class = strtolower(Convert::raw2htmlname(str_replace('\\', '-', $class ?? '')) ?? '');
            return ".icon.icon-16.icon-{$class} { background-image: url('{$iconURL}'); } ";
        }
        return '';
    }

    /**
     * Return the web font icon class name for this interface icon. Uses the
     * built in SilveStripe webfont. {@see menu_icon_for_class()} for providing
     * a background image.
     *
     * @param string $class .
     * @return string
     */
    public static function menu_icon_class_for_class($class)
    {
        return Config::inst()->get($class, 'menu_icon_class');
    }

    /**
     * @throws HTTPResponse_Exception
     */
    public function show(HTTPRequest $request): HTTPResponse
    {
        if ($request->param('ID')) {
            $this->setCurrentPageID($request->param('ID'));
        }
        return $this->getResponseNegotiator()->respond($request);
    }

    public function getResponseNegotiator(): PjaxResponseNegotiator
    {
        if (!$this->responseNegotiator) {
            $this->responseNegotiator = new PjaxResponseNegotiator(
                [
                    'CurrentForm' => function () {
                        return $this->getEditForm()->forTemplate();
                    },
                    'Content' => function () {
                        return $this->renderWith($this->getTemplatesWithSuffix('_Content'));
                    },
                    'Breadcrumbs' => function () {
                        return $this->renderWith([
                            'type' => 'Includes',
                            'SilverStripe\\Admin\\CMSBreadcrumbs'
                        ]);
                    },
                    'ValidationResult' => function () {
                        return $this->prepareDataForPjax([
                            'isValid' => true,
                            'messages' => []
                        ]);
                    },
                    'default' => function () {
                        return $this->renderWith($this->getViewer('show'));
                    }
                ],
                $this->getResponse()
            );
        }
        return $this->responseNegotiator;
    }

    //------------------------------------------------------------------------------------------//
    // Main UI components

    /**
     * Returns the main menu of the CMS.  This is also used by init()
     * to work out which sections the user has access to.
     *
     * @param bool $cached
     * @return SS_List
     */
    public function MainMenu($cached = true)
    {
        if (!isset($this->_cache_MainMenu) || !$cached) {
            // Don't accidentally return a menu if you're not logged in - it's used to determine access.
            if (!Security::getCurrentUser()) {
                return new ArrayList();
            }

            // Encode into DO set
            $menu = new ArrayList();
            $menuItems = CMSMenu::get_viewable_menu_items();

            // extra styling for custom menu-icons
            $menuIconStyling = '';

            if ($menuItems) {
                foreach ($menuItems as $code => $menuItem) {
                    // alternate permission checks (in addition to LeftAndMain->canView())
                    if (isset($menuItem->controller)
                        && $this->hasMethod('alternateMenuDisplayCheck')
                        && !$this->alternateMenuDisplayCheck($menuItem->controller)
                    ) {
                        continue;
                    }

                    $linkingmode = "link";

                    if ($menuItem->controller && get_class($this) == $menuItem->controller) {
                        $linkingmode = "current";
                    } elseif (strpos($this->Link() ?? '', $menuItem->url ?? '') !== false) {
                        if ($this->Link() == $menuItem->url) {
                            $linkingmode = "current";

                            // default menu is the one with a blank {@link url_segment}
                        } elseif (singleton($menuItem->controller)->config()->get('url_segment') == '') {
                            if ($this->Link() == AdminRootController::admin_url()) {
                                $linkingmode = "current";
                            }
                        } else {
                            $linkingmode = "current";
                        }
                    }

                    // already set in CMSMenu::populate_menu(), but from a static pre-controller
                    // context, so doesn't respect the current user locale in _t() calls - as a workaround,
                    // we simply call LeftAndMain::menu_title() again
                    // if we're dealing with a controller
                    if ($menuItem->controller) {
                        $title = LeftAndMain::menu_title($menuItem->controller);
                    } else {
                        $title = $menuItem->title;
                    }

                    // Provide styling for custom $menu-icon. Done here instead of in
                    // CMSMenu::populate_menu(), because the icon is part of
                    // the CMS right pane for the specified class as well...
                    $iconClass = '';
                    $hasCSSIcon = false;
                    if ($menuItem->controller) {
                        $menuIcon = LeftAndMain::menu_icon_for_class($menuItem->controller);

                        if (!empty($menuIcon)) {
                            $menuIconStyling .= $menuIcon;
                            $hasCSSIcon = true;
                        } else {
                            $iconClass = LeftAndMain::menu_icon_class_for_class($menuItem->controller);
                        }
                    } else {
                        $iconClass = $menuItem->iconClass;
                    }

                    $menu->push(new ArrayData([
                        "MenuItem" => $menuItem,
                        "AttributesHTML" => $menuItem->getAttributesHTML(),
                        "Title" => $title,
                        "Code" => $code,
                        "Icon" => strtolower($code ?? ''),
                        "IconClass" => $iconClass,
                        "HasCSSIcon" => $hasCSSIcon,
                        "Link" => $menuItem->url,
                        "LinkingMode" => $linkingmode
                    ]));
                }
            }
            if ($menuIconStyling) {
                Requirements::customCSS($menuIconStyling);
            }

            $this->_cache_MainMenu = $menu;
        }

        return $this->_cache_MainMenu;
    }

    public function Menu()
    {
        return $this->renderWith($this->getTemplatesWithSuffix('_Menu'));
    }

    /**
     * @return ArrayData A single menu entry (see {@link MainMenu})
     */
    public function MenuCurrentItem()
    {
        $items = $this->MainMenu();
        return $items->find('LinkingMode', 'current');
    }

    /**
     * Return appropriate template(s) for this class, with the given suffix using
     * {@link SSViewer::get_templates_by_class()}
     *
     * @param string $suffix
     * @return string|array
     */
    public function getTemplatesWithSuffix($suffix)
    {
        $templates = SSViewer::get_templates_by_class(get_class($this), $suffix, __CLASS__);
        return SSViewer::chooseTemplate($templates);
    }

    public function Content()
    {
        return $this->renderWith($this->getTemplatesWithSuffix('_Content'));
    }

    /**
     * Render $PreviewPanel content
     *
     * @return DBHTMLText
     */
    public function PreviewPanel()
    {
        $template = $this->getTemplatesWithSuffix('_PreviewPanel');
        // Only render sections with preview panel
        if ($template) {
            return $this->renderWith($template);
        }
        return null;
    }

    /**
     * Get dataobject from the current ID
     *
     * @param int|DataObject $id ID or object
     * @return DataObject
     */
    public function getRecord($id)
    {
        $className = $this->config()->get('tree_class');
        if (!$className) {
            return null;
        }
        if ($id instanceof $className) {
            return $id;
        }
        if ($id === 'root') {
            return DataObject::singleton($className);
        }
        if (is_numeric($id)) {
            return DataObject::get_by_id($className, $id);
        }
        return null;
    }

    /**
     * @param bool $unlinked
     * @return ArrayList<ArrayData>
     */
    public function Breadcrumbs($unlinked = false)
    {
        $items = new ArrayList([
            new ArrayData([
                'Title' => $this->menu_title(),
                'Link' => ($unlinked) ? false : $this->Link()
            ])
        ]);

        return $items;
    }

    /**
     * Cached search filter instance for current search
     *
     * @var LeftAndMain_SearchFilter
     */
    protected $searchFilterCache = null;

    /**
     * Gets the current search filter for this request, if available
     *
     * @throws InvalidArgumentException
     * @return LeftAndMain_SearchFilter
     */
    protected function getSearchFilter()
    {
        if ($this->searchFilterCache) {
            return $this->searchFilterCache;
        }

        // Check for given FilterClass
        $params = $this->getRequest()->getVar('q');
        if (empty($params['FilterClass'])) {
            return null;
        }

        // Validate classname
        $filterClass = $params['FilterClass'];
        $filterInfo = new ReflectionClass($filterClass);
        if (!$filterInfo->implementsInterface(LeftAndMain_SearchFilter::class)) {
            throw new InvalidArgumentException(sprintf('Invalid filter class passed: %s', $filterClass));
        }

        return $this->searchFilterCache = Injector::inst()->createWithArgs($filterClass, [$params]);
    }

    /**
     * Save handler
     */
    public function save(array $data, Form $form): HTTPResponse
    {
        $request = $this->getRequest();
        $className = $this->config()->get('tree_class');

        // Existing or new record?
        $id = $data['ID'];
        if (is_numeric($id) && $id > 0) {
            $record = DataObject::get_by_id($className, $id);
            if ($record && !$record->canEdit()) {
                return Security::permissionFailure($this);
            }
            if (!$record || !$record->ID) {
                $this->httpError(404, "Bad record ID #" . (int)$id);
            }
        } else {
            if (!singleton($this->config()->get('tree_class'))->canCreate()) {
                return Security::permissionFailure($this);
            }
            $record = $this->getNewItem($id, false);
        }

        // save form data into record
        $form->saveInto($record, true);
        $record->write();
        $this->extend('onAfterSave', $record);
        $this->setCurrentPageID($record->ID);

        $message = _t(__CLASS__ . '.SAVEDUP', 'Saved.');
        if ($this->getSchemaRequested()) {
            $schemaId = Controller::join_links($this->Link('schema/DetailEditForm'), $id);
            // Ensure that newly created records have all their data loaded back into the form.
            $form->loadDataFrom($record);
            $form->setMessage($message, 'good');
            $response = $this->getSchemaResponse($schemaId, $form);
        } else {
            $response = $this->getResponseNegotiator()->respond($request);
        }

        $response->addHeader('X-Status', rawurlencode($message ?? ''));
        return $response;
    }

    /**
     * Create new item.
     *
     * @param string|int $id
     * @param bool $setID
     * @return DataObject
     */
    public function getNewItem($id, $setID = true)
    {
        $class = $this->config()->get('tree_class');
        $object = Injector::inst()->create($class);
        if ($setID) {
            $object->ID = $id;
        }
        return $object;
    }

    public function delete(array $data, Form $form): HTTPResponse
    {
        $className = $this->config()->get('tree_class');

        $id = $data['ID'];
        $record = DataObject::get_by_id($className, $id);
        if ($record && !$record->canDelete()) {
            return Security::permissionFailure();
        }
        if (!$record || !$record->ID) {
            $this->httpError(404, "Bad record ID #" . (int)$id);
        }

        $record->delete();

        $this->getResponse()->addHeader(
            'X-Status',
            rawurlencode(_t(__CLASS__ . '.DELETED', 'Deleted.') ?? '')
        );
        return $this->getResponseNegotiator()->respond(
            $this->getRequest(),
            ['currentform' => [$this, 'EmptyForm']]
        );
    }


    /**
     * Retrieves an edit form, either for display, or to process submitted data.
     * Also used in the template rendered through {@link Right()} in the $EditForm placeholder.
     *
     * This is a "pseudo-abstract" method, usually connected to a {@link getEditForm()}
     * method in an entwine subclass. This method can accept a record identifier,
     * selected either in custom logic, or through {@link currentPageID()}.
     * The form usually construct itself from {@link DataObject->getCMSFields()}
     * for the specific managed subclass defined in {@link LeftAndMain::$tree_class}.
     *
     * @param HTTPRequest $request Passed if executing a HTTPRequest directly on the form.
     * If empty, this is invoked as $EditForm in the template
     * @return Form Should return a form regardless wether a record has been found.
     *  Form might be readonly if the current user doesn't have the permission to edit
     *  the record.
     */
    public function EditForm($request = null)
    {
        return $this->getEditForm();
    }

    /**
     * Calls {@link SiteTree->getCMSFields()} by default to determine the form fields to display.
     *
     * @param int $id
     * @param FieldList $fields
     * @return Form
     */
    public function getEditForm($id = null, $fields = null)
    {
        if (!$id) {
            $id = $this->currentPageID();
        }

        // Check record exists
        $record = $this->getRecord($id);
        if (!$record) {
            return $this->EmptyForm();
        }

        // Check if this record is viewable
        if ($record && !$record->canView()) {
            $response = Security::permissionFailure($this);
            $this->setResponse($response);
            return null;
        }

        $fields = $fields ?: $record->getCMSFields();
        if (!$fields) {
            throw new LogicException(
                "getCMSFields() returned null  - it should return a FieldList object.
                Perhaps you forgot to put a return statement at the end of your method?"
            );
        }

        // Add hidden fields which are required for saving the record
        // and loading the UI state
        if (!$fields->dataFieldByName('ClassName')) {
            $fields->push(new HiddenField('ClassName'));
        }

        $tree_class = $this->config()->get('tree_class');
        if ($tree_class::has_extension(Hierarchy::class)
            && !$fields->dataFieldByName('ParentID')
        ) {
            $fields->push(new HiddenField('ParentID'));
        }

        // Added in-line to the form, but plucked into different view by frontend scripts.
        if ($record instanceof CMSPreviewable || $record->has_extension(CMSPreviewable::class)) {
            $navField = new LiteralField('SilverStripeNavigator', $this->getSilverStripeNavigator($record));
            $navField->setAllowHTML(true);
            $fields->push($navField);
        }

        if ($record->hasMethod('getAllCMSActions')) {
            $actions = $record->getAllCMSActions();
        } else {
            $actions = $record->getCMSActions();
            // add default actions if none are defined
            if (!$actions || !$actions->count()) {
                if ($record->hasMethod('canEdit') && $record->canEdit()) {
                    $actions->push(
                        FormAction::create('save', _t(CMSMain::class . '.SAVE', 'Save'))
                            ->addExtraClass('btn btn-primary')
                            ->addExtraClass('font-icon-add-circle')
                    );
                }
                if ($record->hasMethod('canDelete') && $record->canDelete()) {
                    $actions->push(
                        FormAction::create('delete', _t(ModelAdmin::class . '.DELETE', 'Delete'))
                            ->addExtraClass('btn btn-secondary')
                    );
                }
            }
        }

        $negotiator = $this->getResponseNegotiator();
        $form = Form::create(
            $this,
            "EditForm",
            $fields,
            $actions
        )->setHTMLID('Form_EditForm');
        $form->addExtraClass('cms-edit-form');
        $form->loadDataFrom($record);
        $form->setTemplate($this->getTemplatesWithSuffix('_EditForm'));
        $form->setAttribute('data-pjax-fragment', 'CurrentForm');
        $form->setValidationResponseCallback(function (ValidationResult $errors) use ($negotiator, $form) {
            $request = $this->getRequest();
            if ($request->isAjax() && $negotiator) {
                $result = $form->forTemplate();

                return $negotiator->respond($request, [
                    'CurrentForm' => function () use ($result) {
                        return $result;
                    },
                    'ValidationResult' => function () use ($errors) {
                        return $this->prepareDataForPjax([
                            'isValid' => $errors->isValid(),
                            'messages' => $errors->getMessages()
                        ]);
                    }
                ]);
            }
            return null;
        });

        // Announce the capability so the frontend can decide whether to allow preview or not.
        if ($record instanceof CMSPreviewable || $record->has_extension(CMSPreviewable::class)) {
            $form->addExtraClass('cms-previewable');
        }
        $form->addExtraClass('fill-height');

        if ($record->hasMethod('getCMSCompositeValidator')) {
            // As of framework v4.7, a CompositeValidator is always available form a DataObject, but it may be
            // empty (which is fine)
            $form->setValidator($record->getCMSCompositeValidator());
        } elseif ($record->hasMethod('getCMSValidator')) {
            // BC support for framework < v4.7
            $validator = $record->getCMSValidator();

            // The clientside (mainly LeftAndMain*.js) rely on ajax responses
            // which can be evaluated as javascript, hence we need
            // to override any global changes to the validation handler.
            if ($validator) {
                $form->setValidator($validator);
            }
        } else {
            $form->unsetValidator();
        }

        // Check if this form is readonly
        if (!$record->canEdit()) {
            $readonlyFields = $form->Fields()->makeReadonly();
            $form->setFields($readonlyFields);
        }
        return $form;
    }

    /**
     * Convert an array of data to JSON and wrap it in an HTML tag as pjax is used and jQuery will parse this
     * as an element on the client side in LeftAndMain.js handleAjaxResponse()
     * The attribute type="application/json" denotes this is a data block and won't be processed by a browser
     * https://html.spec.whatwg.org/#the-script-element
     *
     * @param array $data
     * @return string
     */
    private function prepareDataForPjax(array $data): string
    {
        return '<script type="application/json">' . json_encode($data) . '</script>';
    }

    /**
     * Returns a placeholder form, used by {@link getEditForm()} if no record is selected.
     * Our javascript logic always requires a form to be present in the CMS interface.
     *
     * @return Form
     */
    public function EmptyForm()
    {
        $form = Form::create(
            $this,
            "EditForm",
            new FieldList(),
            new FieldList()
        )->setHTMLID('Form_EditForm');
        $form->unsetValidator();
        $form->addExtraClass('cms-edit-form');
        $form->addExtraClass('root-form');
        $form->setTemplate($this->getTemplatesWithSuffix('_EditForm'));
        $form->setAttribute('data-pjax-fragment', 'CurrentForm');

        return $form;
    }

    /**
     * Handler for all global modals
     *
     * @return ModalController
     */
    public function Modals()
    {
        return ModalController::create($this, "Modals");
    }

    /**
     * Renders a panel containing tools which apply to all displayed
     * "content" (mostly through {@link EditForm()}), for example a tree navigation or a filter panel.
     * Auto-detects applicable templates by naming convention: "<controller classname>_Tools.ss",
     * and takes the most specific template (see {@link getTemplatesWithSuffix()}).
     * To explicitly disable the panel in the subclass, simply create a more specific, empty template.
     *
     * @return string HTML
     */
    public function Tools()
    {
        $templates = $this->getTemplatesWithSuffix('_Tools');
        if ($templates) {
            $viewer = SSViewer::create($templates);
            return $viewer->process($this);
        } else {
            return false;
        }
    }

    /**
     * Renders a panel containing tools which apply to the currently displayed edit form.
     * The main difference to {@link Tools()} is that the panel is displayed within
     * the element structure of the form panel (rendered through {@link EditForm}).
     * This means the panel will be loaded alongside new forms, and refreshed upon save,
     * which can mean a performance hit, depending on how complex your panel logic gets.
     * Any form fields contained in the returned markup will also be submitted with the main form,
     * which might be desired depending on the implementation details.
     *
     * @return string HTML
     */
    public function EditFormTools()
    {
        $templates = $this->getTemplatesWithSuffix('_EditFormTools');
        if ($templates) {
            $viewer = SSViewer::create($templates);
            return $viewer->process($this);
        } else {
            return false;
        }
    }

    /**
     * Batch Actions Handler
     */
    public function batchactions()
    {
        return new CMSBatchActionHandler($this, 'batchactions', $this->config()->get('tree_class'));
    }

    /**
     * @return Form
     */
    public function BatchActionsForm()
    {
        $actions = $this->batchactions()->batchActionList();
        // Placeholder action
        $actionsMap = ['-1' => _t(__CLASS__ . '.DropdownBatchActionsDefault', 'Choose an action...')];
        foreach ($actions as $action) {
            $actionsMap[$action->Link] = $action->Title;
        }

        $form = new Form(
            $this,
            'BatchActionsForm',
            new FieldList(
                new HiddenField('csvIDs'),
                DropdownField::create(
                    'Action',
                    false,
                    $actionsMap
                )
                    ->setAttribute('autocomplete', 'off')
                    ->setAttribute(
                        'data-placeholder',
                        _t(__CLASS__ . '.DropdownBatchActionsDefault', 'Choose an action...')
                    )
            ),
            new FieldList(
                FormAction::create('submit', _t(__CLASS__ . '.SUBMIT_BUTTON_LABEL', "Go"))
                    ->addExtraClass('btn-outline-secondary')
            )
        );
        $form->addExtraClass('cms-batch-actions form--no-dividers');
        $form->unsetValidator();

        $this->extend('updateBatchActionsForm', $form);
        return $form;
    }

    public function printable()
    {
        $form = $this->getEditForm($this->currentPageID());
        if (!$form) {
            return false;
        }

        $form->transform(new PrintableTransformation());
        $form->setActions(null);

        Requirements::clear();
        Requirements::css('silverstripe/admin: dist/css/LeftAndMain_printable.css');
        return [
            "PrintForm" => $form
        ];
    }

    /**
     * Used for preview controls, mainly links which switch between different states of the page.
     *
     * @return DBHTMLText
     */
    public function getSilverStripeNavigator(?DataObject $record = null)
    {
        if (!$record) {
            $record = $this->currentPage();
        }
        if ($record && (($record instanceof CMSPreviewable) || $record->has_extension(CMSPreviewable::class))) {
            $navigator = new SilverStripeNavigator($record);
            return $navigator->renderWith($this->getTemplatesWithSuffix('_SilverStripeNavigator'));
        }
        return null;
    }

    /**
     * Identifier for the currently shown record,
     * in most cases a database ID. Inspects the following
     * sources (in this order):
     * - GET/POST parameter named 'ID'
     * - URL parameter named 'ID'
     * - Session value namespaced by classname, e.g. "CMSMain.currentPage"
     *
     * @return int
     */
    public function currentPageID()
    {
        if ($this->pageID) {
            return $this->pageID;
        }
        if ($this->getRequest()->requestVar('ID') && is_numeric($this->getRequest()->requestVar('ID'))) {
            return $this->getRequest()->requestVar('ID');
        }

        if ($this->getRequest()->requestVar('CMSMainCurrentPageID') && is_numeric($this->getRequest()->requestVar('CMSMainCurrentPageID'))) {
            // see GridFieldDetailForm::ItemEditForm
            return $this->getRequest()->requestVar('CMSMainCurrentPageID');
        }

        if (isset($this->urlParams['ID']) && is_numeric($this->urlParams['ID'])) {
            return $this->urlParams['ID'];
        }

        if (is_numeric($this->getRequest()->param('ID'))) {
            return $this->getRequest()->param('ID');
        }

        /** @deprecated */
        $session = $this->getRequest()->getSession();
        return $session->get($this->sessionNamespace() . ".currentPage") ?: null;
    }

    /**
     * Forces the current page to be set in session,
     * which can be retrieved later through {@link currentPageID()}.
     * Keep in mind that setting an ID through GET/POST or
     * as a URL parameter will overrule this value.
     *
     * @param int $id
     */
    public function setCurrentPageID($id)
    {
        $this->pageID = $id;
        $id = (int)$id;
        /** @deprecated */
        $this->getRequest()->getSession()->set($this->sessionNamespace() . ".currentPage", $id);
    }

    /**
     * Uses {@link getRecord()} and {@link currentPageID()}
     * to get the currently selected record.
     *
     * @return DataObject
     */
    public function currentPage()
    {
        return $this->getRecord($this->currentPageID());
    }

    /**
     * Compares a given record to the currently selected one (if any).
     * Used for marking the current tree node.
     *
     * @param DataObject $record
     * @return bool
     */
    public function isCurrentPage(DataObject $record)
    {
        return ($record->ID == $this->currentPageID());
    }

    /**
     * @return string
     */
    protected function sessionNamespace()
    {
        $override = $this->config()->get('session_namespace');
        return $override ? $override : static::class;
    }

    /**
     * URL to a previewable record which is shown through this controller.
     * The controller might not have any previewable content, in which case
     * this method returns FALSE.
     *
     * @return string|bool
     */
    public function LinkPreview()
    {
        return false;
    }

    /**
     * Return the version number of this application, ie. 'CMS: 4.2.1'
     *
     * @return string
     */
    public function CMSVersion()
    {
        return $this->getVersionProvider()->getVersion();
    }

    /**
     * Return the version number of the CMS in the 'major.minor' format, e.g. '4.2'
     * Will handle 4.10.x-dev by removing .x-dev
     *
     * @return string
     */
    public function CMSVersionNumber()
    {
        $moduleName = array_keys($this->getVersionProvider()->getModules())[0];
        $lockModules = $this->getVersionProvider()->getModuleVersionFromComposer([$moduleName]);
        if (!isset($lockModules[$moduleName])) {
            return '';
        }
        $version = $lockModules[$moduleName];
        if (preg_match('#^([0-9]+)\.([0-9]+)#', $version ?? '', $m)) {
            return $m[1] . '.' . $m[2];
        }
        return $version;
    }

    /**
     * @return array
     */
    public function SwitchView()
    {
        $page = $this->currentPage();
        if (!$page) {
            return null;
        }
        $nav = SilverStripeNavigator::get_for_record($page);
        return $nav['items'];
    }

    /**
     * @return SiteConfig
     */
    public function SiteConfig()
    {
        return class_exists(SiteConfig::class) ? SiteConfig::current_site_config() : null;
    }

    /**
     * The urls used for the links in the Help dropdown in the backend
     *
     * Set this to `false` via yml config if you do not want to show any help links
     *
     * @config
     * @var array
     */
    private static $help_links = [
        'CMS User help' => 'https://userhelp.silverstripe.org/en/5',
        'Developer docs' => 'https://docs.silverstripe.org/en/5/',
        'Community' => 'https://www.silverstripe.org/',
        'Feedback' => 'https://www.silverstripe.org/give-feedback/',
    ];

    /**
     * Returns help_links in a format readable by a template
     * @return ArrayList
     */
    public function getHelpLinks()
    {
        $helpLinks = $this->config()->get('help_links');
        $formattedLinks = [];

        // Setting the `help_links` config to `false` means no help links will show
        if (is_array($helpLinks)) {
            foreach ($helpLinks as $key => $value) {
                $translationKey = str_replace(' ', '', $key ?? '');

                $formattedLinks[] = [
                    'Title' => _t(__CLASS__ . '.' . $translationKey, $key),
                    'URL' => $value
                ];
            }
        }

        return ArrayList::create($formattedLinks);
    }

    /**
     * The href for the anchor on the Silverstripe logo
     *
     * @config
     * @var string
     */
    private static $application_link = '//www.silverstripe.org/';

    /**
     * @return string
     */
    public function ApplicationLink()
    {
        return $this->config()->get('application_link');
    }

    /**
     * The application name
     *
     * @config
     * @var string
     */
    private static $application_name = 'Silverstripe';

    /**
     * Get the application name.
     *
     * @return string
     */
    public function getApplicationName()
    {
        return $this->config()->get('application_name');
    }

    /**
     * @return string
     */
    public function Title()
    {
        $app = $this->getApplicationName();

        return ($section = $this->SectionTitle()) ? sprintf('%s - %s', $app, $section) : $app;
    }

    /**
     * Return the title of the current section. Either this is pulled from
     * the current panel's menu_title or from the first active menu
     *
     * @return string
     */
    public function SectionTitle()
    {
        $title = $this->menu_title();
        if ($title) {
            return $title;
        }

        foreach ($this->MainMenu() as $menuItem) {
            if ($menuItem->LinkingMode != 'link') {
                return $menuItem->Title;
            }
        }
        return null;
    }

    /**
     * Generate a logout url with BackURL to the CMS
     *
     * @return string
     */
    public function LogoutURL()
    {
        return Controller::join_links(Security::logout_url(), '?' . http_build_query([
            'BackURL' => AdminRootController::admin_url(),
        ]));
    }

    /**
     * Same as {@link ViewableData->CSSClasses()}, but with a changed name
     * to avoid problems when using {@link ViewableData->customise()}
     * (which always returns "ArrayData" from the $original object).
     *
     * @return string
     */
    public function BaseCSSClasses()
    {
        return $this->CSSClasses(Controller::class);
    }

    /**
     * @return string
     */
    public function Locale()
    {
        return DBField::create_field('Locale', i18n::get_locale());
    }

    public function providePermissions()
    {
        $perms = [
            "CMS_ACCESS_LeftAndMain" => [
                'name' => _t(__CLASS__ . '.ACCESSALLINTERFACES', 'Access to all CMS sections'),
                'category' => _t(Permission::class . '.CMS_ACCESS_CATEGORY', 'CMS Access'),
                'help' => _t(__CLASS__ . '.ACCESSALLINTERFACESHELP', 'Overrules more specific access settings.'),
                'sort' => -100
            ]
        ];

        // Add any custom ModelAdmin subclasses. Can't put this on ModelAdmin itself
        // since its marked abstract, and needs to be singleton instanciated.
        foreach (ClassInfo::subclassesFor(ModelAdmin::class) as $i => $class) {
            if ($class === ModelAdmin::class) {
                continue;
            }
            if (ClassInfo::classImplements($class, TestOnly::class)) {
                continue;
            }

            // Check if modeladmin has explicit required_permission_codes option.
            // If a modeladmin is namespaced you can apply this config to override
            // the default permission generation based on fully qualified class name.
            $code = $class::getRequiredPermissions();

            if (!$code) {
                continue;
            }
            // Get first permission if multiple specified
            if (is_array($code)) {
                $code = reset($code);
            }
            $title = LeftAndMain::menu_title($class);
            $perms[$code] = [
                // Item in permission selection identifying the admin section. Example: Access to 'Files & Images'
                'name' => _t(
                    CMSMain::class . '.ACCESS',
                    "Access to '{title}' section",
                    ['title' => $title]
                ),
                'category' => _t(Permission::class . '.CMS_ACCESS_CATEGORY', 'CMS Access')
            ];
        }

        return $perms;
    }

    /**
     * Set the SilverStripe version provider to use
     *
     * @param VersionProvider $provider
     * @return $this
     */
    public function setVersionProvider(VersionProvider $provider)
    {
        $this->versionProvider = $provider;
        return $this;
    }

    /**
     * Get the SilverStripe version provider
     *
     * @return VersionProvider
     */
    public function getVersionProvider()
    {
        return $this->versionProvider;
    }

    /**
     * Get the HTTP error message if one has occurred during HandleRequest.
     */
    public function getHttpErrorMessage(): string
    {
        return $this->httpErrorMessage ?? '';
    }

    /**
     * Set the HTTP error message when one occurs during HandleRequest.
     * Called by {@link LeftAndMainErrorExtension}
     * @internal
     */
    public function setHttpErrorMessage(string $message): LeftAndMain
    {
        $this->httpErrorMessage = $message;
        return $this;
    }
}
