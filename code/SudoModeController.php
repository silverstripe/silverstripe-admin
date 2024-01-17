<?php

namespace SilverStripe\Admin;

use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Control\HTTPResponse_Exception;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\ORM\ValidationResult;
use SilverStripe\Security\Authenticator;
use SilverStripe\Security\Security;
use SilverStripe\Security\SecurityToken;
use SilverStripe\Security\SudoMode\SudoModeServiceInterface;

/**
 * Responsible for checking and verifying whether sudo mode is enabled
 */
class SudoModeController extends LeftAndMain
{
    private static string $url_segment = 'sudomode';

    private static bool $ignore_menuitem = true;

    private static array $allowed_actions = [
        'check',
        'activate',
    ];

    private static array $dependencies = [
        'SudoModeService' => '%$' . SudoModeServiceInterface::class,
    ];

    /**
     * A user help documentation link to find out more about sudo mode
     */
    // phpcs:ignore Generic.Files.LineLength.TooLong
    private static string $help_link = 'https://userhelp.silverstripe.org/en/5/managing_your_website/logging_in/#sudo-mode';

    private ?SudoModeServiceInterface $sudoModeService = null;

    /**
     * Explicitly disable required permissions for sudo mode checks
     */
    private static bool $required_permission_codes = false;

    public function getClientConfig()
    {
        $request = Injector::inst()->get(HTTPRequest::class);

        return array_merge_recursive(parent::getClientConfig(), [
            'endpoints' => [
                'activate' => $this->Link('activate'),
            ],
            'sudoModeActive' => $this->getSudoModeService()->check($request->getSession()),
            'helpLink' => $this->config()->get('help_link'),
        ]);
    }

    /**
     * Checks whether sudo mode is active for the current user
     */
    public function check(HTTPRequest $request): HTTPResponse
    {
        $body = [
            'active' => $this->getSudoModeService()->check($request->getSession()),
        ];
        return $this->jsonResponse($body);
    }

    /**
     * After validating the request data including password against the current member, activate sudo mode
     * for the current member.
     *
     * @throws HTTPResponse_Exception If the request was not made with POST
     */
    public function activate(HTTPRequest $request): HTTPResponse
    {
        if (!$request->isPOST()) {
            return $this->httpError(405);
        }

        if (!SecurityToken::inst()->checkRequest($request)) {
            return $this->jsonResponse([
                'result' => false,
                'message' => _t(__CLASS__ . '.TIMEOUT', 'Session timed out, please refresh and try again.'),
            ], 403);
        }

        // Validate password
        if (!$this->checkPassword($request)) {
            return $this->jsonResponse([
                'result' => false,
                'message' => _t(__CLASS__ . '.INVALID', 'Incorrect password'),
            ]);
        }

        // Activate sudo mode and return successful result
        $this->getSudoModeService()->activate($request->getSession());
        return $this->jsonResponse(['result' => true]);
    }

    /**
     * Checks the provided password is valid for the current member. Will return false if insufficient data
     * is available to validate the request.
     */
    private function checkPassword(HTTPRequest $request): bool
    {
        $password = $request->postVar('Password');
        if (!$password) {
            return false;
        }

        $currentMember = Security::getCurrentUser();
        if (!$currentMember) {
            return false;
        }

        $result = ValidationResult::create();
        $authenticators = Security::singleton()->getApplicableAuthenticators(Authenticator::CHECK_PASSWORD);
        foreach ($authenticators as $authenticator) {
            $authenticator->checkPassword($currentMember, $password, $result);
            if (!$result->isValid()) {
                break;
            }
        }
        return $result->isValid();
    }

    /**
     * Returns a JSON response with an encoded body and provided HTTP status code
     */
    private function jsonResponse(array $body, int $code = 200): HTTPResponse
    {
        $response = new HTTPResponse();
        $response
            ->addHeader('Content-Type', 'application/json')
            ->setBody(json_encode($body))
            ->setStatusCode($code);
        return $response;
    }

    public function setSudoModeService(SudoModeServiceInterface $sudoModeService): static
    {
        $this->sudoModeService = $sudoModeService;
        return $this;
    }

    public function getSudoModeService(): ?SudoModeServiceInterface
    {
        return $this->sudoModeService;
    }
}
