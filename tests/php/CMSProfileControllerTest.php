<?php

namespace SilverStripe\Admin\Tests;

use PHPUnit\Framework\Attributes\DataProvider;
use SilverStripe\Admin\CMSProfileController;
use SilverStripe\Core\Config\Config;
use SilverStripe\Dev\FunctionalTest;
use SilverStripe\Security\Member;
use SilverStripe\Security\Security;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Security\SudoMode\SudoModeServiceInterface;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\Session;

class CMSProfileControllerTest extends FunctionalTest
{
    protected static $fixture_file = 'CMSProfileControllerTest.yml';

    public $autoFollowRedirection = false;

    protected function setUp(): void
    {
        parent::setUp();
        $session = Controller::curr()->getRequest()->getSession();
        Injector::inst()->get(SudoModeServiceInterface::class)->activate($session);
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        $session = Controller::curr()->getRequest()->getSession();
        $service = Injector::inst()->get(SudoModeServiceInterface::class);
        // deactive() isn't part of the interface
        if (method_exists($service, 'deactivate')) {
            call_user_func([$service, 'deactivate'], $session);
        }
    }

    public function testMemberCantEditAnother()
    {
        $member = $this->objFromFixture(Member::class, 'user1');
        $anotherMember = $this->objFromFixture(Member::class, 'user2');
        $this->logInAs($member);

        $response = $this->post('admin/myprofile/EditForm', [
            'action_save' => 1,
            'ID' => $anotherMember->ID,
            'FirstName' => 'JoeEdited',
            'Surname' => 'BloggsEdited',
            'Email' => $member->Email,
            'Locale' => $member->Locale,
            'Password[_Password]' => 'password',
            'Password[_ConfirmPassword]' => 'password',
        ]);

        $anotherMember = $this->objFromFixture(Member::class, 'user2');

        $this->assertNotEquals($anotherMember->FirstName, 'JoeEdited', 'FirstName field stays the same');
    }

    public function testMemberEditsOwnProfile()
    {
        $member = $this->objFromFixture(Member::class, 'user3');
        $this->logInAs($member);

        $response = $this->post('admin/myprofile/EditForm', [
            'action_save' => 1,
            'ID' => $member->ID,
            'FirstName' => 'JoeEdited',
            'Surname' => 'BloggsEdited',
            'Email' => $member->Email,
            'Locale' => $member->Locale,
            'Password[_Password]' => 'password',
            'Password[_ConfirmPassword]' => 'password',
        ]);

        $member = $this->objFromFixture(Member::class, 'user3');

        $this->assertEquals('JoeEdited', $member->FirstName, 'FirstName field was changed');
    }

    public function testExtendedPermissionsStopEditingOwnProfile()
    {
        $existingExtensions = Member::config()->get('extensions', Config::EXCLUDE_EXTRA_SOURCES);
        Member::config()->merge('extensions', [
            CMSProfileControllerTest\TestExtension::class
        ]);

        $member = $this->objFromFixture(Member::class, 'user1');
        $this->logInAs($member);

        $response = $this->post('admin/myprofile/EditForm', [
            'action_save' => 1,
            'ID' => $member->ID,
            'FirstName' => 'JoeEdited',
            'Surname' => 'BloggsEdited',
            'Email' => $member->Email,
            'Locale' => $member->Locale,
            'Password[_Password]' => 'password',
            'Password[_ConfirmPassword]' => 'password',
        ]);

        $member = $this->objFromFixture(Member::class, 'user1');

        $this->assertNotEquals(
            $member->FirstName,
            'JoeEdited',
            'FirstName field was NOT changed because we modified canEdit'
        );

        Member::config()
            ->remove('extensions')
            ->merge('extensions', $existingExtensions);
    }

    public static function provideSudoMode(): array
    {
        return [
            [true],
            [false],
        ];
    }

    #[DataProvider('provideSudoMode')]
    public function testSudoMode(bool $enabled): void
    {
        Member::config()->set('require_sudo_mode', $enabled);
        $member = $this->objFromFixture(Member::class, 'user1');
        $this->logInAs($member);
        $controller = new CMSProfileController();
        $request = new HTTPRequest('get', '');
        Injector::inst()->registerService($request);
        $request->setSession(new Session([]));
        $controller->setRequest($request);

        $controller->doInit();
        $form = $controller->getEditForm();
        $this->assertSame($enabled, $form->getFormRequiresSudoMode());
    }
}
