<?php

namespace SilverStripe\Admin\Tests;

use PHPUnit_Framework_MockObject_MockObject;
use SilverStripe\Admin\SudoModeController;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\Session;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Dev\FunctionalTest;
use SilverStripe\ORM\FieldType\DBDatetime;
use SilverStripe\Security\Member;
use SilverStripe\Security\SecurityToken;
use SilverStripe\Security\SudoMode\SudoModeService;
use SilverStripe\Security\SudoMode\SudoModeServiceInterface;

class SudoModeControllerTest extends FunctionalTest
{
    protected $usesDatabase = true;

    /**
     * @var bool
     */
    private $securityTokenEnabled;

    protected function setUp(): void
    {
        parent::setUp();

        $this->securityTokenEnabled = SecurityToken::is_enabled();
        SecurityToken::disable();

        $memberID = $this->logInWithPermission();

        /** @var Member $member */
        $member = Member::get()->byID($memberID);
        $member->changePassword('0p3nS3samE!');
    }

    protected function tearDown(): void
    {
        if ($this->securityTokenEnabled) {
            SecurityToken::enable();
        }

        parent::tearDown();
    }

    public function testNotLoggedIn()
    {
        $this->logOut();

        $this->autoFollowRedirection = false;
        $response = $this->get(SudoModeController::singleton()->Link('check'));
        $this->autoFollowRedirection = true;

        // Should redirect to login page
        $this->assertSame(302, $response->getStatusCode());
        $this->assertStringEndsWith(
            Controller::normaliseTrailingSlash('/Security/login?BackURL=%2Fadmin%2Fsudomode%2Fcheck'),
            $response->getHeader('Location'),
            'Should not be able to check sudo mode when not logged in'
        );
    }

    public function testLoggedInNotExpired()
    {
        $response = $this->get(SudoModeController::singleton()->Link('check'));
        $this->assertSame(200, $response->getStatusCode());
        $result = json_decode((string) $response->getBody(), true);
        $this->assertTrue($result['active'], 'Sudo mode should be active immediately after login');
    }

    public function testSudoModeExpired()
    {
        $this->expireSudoMode();
        $response = $this->get(SudoModeController::singleton()->Link('check'));
        $this->assertSame(200, $response->getStatusCode());
        $result = json_decode((string) $response->getBody(), true);
        $this->assertFalse($result['active'], 'Sudo mode should not be active if sudo mode expired');
    }

    public function testActivateFailsWithIncorrectPassword()
    {
        $this->expireSudoMode();
        $response = $this->post(SudoModeController::singleton()->Link('activate'), [
            'Password' => 'wrongpassword!',
        ]);

        $this->assertSame(200, $response->getStatusCode());
        $result = json_decode((string) $response->getBody(), true);
        $this->assertFalse($result['result'], 'Should have failed with incorrect password');
        $this->assertEquals('Incorrect password', $result['message']);
    }

    public function testActivateSudoModeWithValidCredentials()
    {
        $this->expireSudoMode();
        $activateResponse = $this->post(SudoModeController::singleton()->Link('activate'), [
            'Password' => '0p3nS3samE!',
        ]);

        $this->assertSame(200, $activateResponse->getStatusCode());
        $result = json_decode((string) $activateResponse->getBody(), true);
        $this->assertTrue($result['result'], 'Should have activated sudo mode');

        $checkResponse = $this->get(SudoModeController::singleton()->Link('check'));
        $this->assertSame(200, $checkResponse->getStatusCode());
        $checkResult = json_decode((string) $checkResponse->getBody(), true);
        $this->assertTrue($checkResult['active'], 'Sudo mode should be active after activate() called');
    }

    public function testActivateFailsWithGetRequest()
    {
        $this->expireSudoMode();
        $response = $this->get(SudoModeController::singleton()->Link('activate'));
        $this->assertSame(405, $response->getStatusCode());
    }

    public function testActivateChecksCSRFToken()
    {
        $this->expireSudoMode();
        SecurityToken::enable();
        $activateResponse = $this->post(SudoModeController::singleton()->Link('activate'), [
            'Password' => 'wrongpassword!',
        ]);

        $this->assertSame(403, $activateResponse->getStatusCode());
        $result = json_decode((string) $activateResponse->getBody(), true);
        $this->assertFalse($result['result'], 'Should have failed on CSRF token validation');
        $this->assertSame($result['message'], 'Session timed out, please refresh and try again.');
    }

    public function testClientConfig()
    {
        $this->expireSudoMode();
        /** @var SudoModeServiceInterface&PHPUnit_Framework_MockObject_MockObject $serviceMock */
        $serviceMock = $this->createMock(SudoModeServiceInterface::class);
        $serviceMock->expects($this->once())->method('check')->willReturn(true);

        $controller = new SudoModeController();
        $controller->setSudoModeService($serviceMock);

        $request = new HTTPRequest('GET', '/');
        $request->setSession(new Session([]));
        Injector::inst()->registerService($request, HTTPRequest::class);

        $result = $controller->getClientConfig();
        $this->assertArrayHasKey('activate', $result['endpoints'], 'Client config should provide activation endpoint');
        $this->assertTrue($result['sudoModeActive'], 'Client config should expose sudo mode status');
    }

    /**
     * Set sudo mode to have expired so that we can test activation of sudo mode via the controller
     */
    private function expireSudoMode(): void
    {
        $expiresAfter = SudoModeService::config()->get('lifetime_minutes') * 60;
        DBDatetime::set_mock_now(DBDatetime::now()->getTimestamp() + $expiresAfter);
    }
}
