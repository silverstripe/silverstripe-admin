<?php

namespace SilverStripe\Admin\Tests;

use SilverStripe\Assets\File;
use SilverStripe\Core\Manifest\ModuleLoader;
use SilverStripe\Admin\CMSMenu;
use SilverStripe\Admin\LeftAndMain;
use SilverStripe\Dev\FunctionalTest;
use SilverStripe\Security\Member;
use SilverStripe\View\Requirements;

class LeftAndMainTest extends FunctionalTest
{
    protected static $fixture_file = 'LeftAndMainTest.yml';

    protected $backupCombined;

    public function setUp()
    {
        parent::setUp();

        // @todo fix controller stack problems and re-activate
        //$this->autoFollowRedirection = false;
        $this->resetMenu();
        $this->backupCombined = Requirements::get_combined_files_enabled();
        $base = ModuleLoader::inst()->getManifest()->getModule('silverstripe/admin');
        $assetsDir = File::join_paths($base->getRelativePath(), 'tests/php/assets');

        LeftAndMain::config()
            ->update('extra_requirements_css', array(
                $assetsDir.'/LeftAndMainTest.css'
            ))
            ->update('extra_requirements_javascript', array(
                $assetsDir. '/LeftAndMainTest.js'
            ));

        Requirements::set_combined_files_enabled(false);
    }

    /**
     * Clear menu to default state as per LeftAndMain::init()
     */
    protected function resetMenu()
    {
        CMSMenu::clear_menu();
        CMSMenu::populate_menu();
        CMSMenu::add_link(
            'Help',
            _t('SilverStripe\\Admin\\LeftAndMain.HELP', 'Help', 'Menu title'),
            LeftAndMain::config()->help_link,
            -2,
            array(
                'target' => '_blank'
            )
        );
    }

    public function tearDown()
    {
        parent::tearDown();
        Requirements::set_combined_files_enabled($this->backupCombined);
    }

    public function testExtraCssAndJavascript()
    {
        $admin = $this->objFromFixture(Member::class, 'admin');
        $this->session()->set('loggedInAs', $admin->ID);
        $response = $this->get('admin/security');

        $this->assertRegExp(
            '/tests\/php\/assets\/LeftAndMainTest.css/i',
            $response->getBody(),
            "body should contain custom css"
        );
        $this->assertRegExp(
            '/tests\/php\/assets\/LeftAndMainTest.js/i',
            $response->getBody(),
            "body should contain custom js"
        );
    }

    /**
     * Check that all subclasses of leftandmain can be accessed
     */
    public function testLeftAndMainSubclasses()
    {
        $this->logInWithPermission('ADMIN');
        $this->resetMenu();

        $menuItems = LeftAndMain::singleton()->MainMenu(false);
        $this->assertGreaterThan(0, count($menuItems));

        foreach ($menuItems as $menuItem) {
            $link = $menuItem->Link;

            // don't test external links
            if (preg_match('/^(https?:)?\/\//', $link)) {
                continue;
            }

            $response = $this->get($link);

            $this->assertInstanceOf('SilverStripe\\Control\\HTTPResponse', $response, "$link should return a response object");
            $this->assertEquals(200, $response->getStatusCode(), "$link should return 200 status code");
            // Check that a HTML page has been returned
            $this->assertRegExp('/<html[^>]*>/i', $response->getBody(), "$link should contain <html> tag");
            $this->assertRegExp('/<head[^>]*>/i', $response->getBody(), "$link should contain <head> tag");
            $this->assertRegExp('/<body[^>]*>/i', $response->getBody(), "$link should contain <body> tag");
        }
    }

    public function testCanView()
    {
        $adminuser = $this->objFromFixture(Member::class, 'admin');
        $securityonlyuser = $this->objFromFixture(Member::class, 'securityonlyuser');
        $allcmssectionsuser = $this->objFromFixture(Member::class, 'allcmssectionsuser');

        // anonymous user
        $this->session()->set('loggedInAs', null);
        $this->resetMenu();
        $menuItems = LeftAndMain::singleton()->MainMenu(false);
        $this->assertEquals(
            $menuItems->column('Code'),
            array(),
            'Without valid login, members cant access any menu entries'
        );

        // restricted cms user
        $this->logInAs($securityonlyuser);
        $this->resetMenu();
        $menuItems = LeftAndMain::singleton()->MainMenu(false);
        $menuItems = $menuItems->column('Code');
        sort($menuItems);

        $this->assertEquals(
            array(
                'Help',
                'SilverStripe-Admin-CMSProfileController',
                'SilverStripe-Admin-SecurityAdmin'
            ),
            $menuItems,
            'Groups with limited access can only access the interfaces they have permissions for'
        );

        // all cms sections user
        $this->logInAs($allcmssectionsuser);
        $this->resetMenu();
        $menuItems = LeftAndMain::singleton()->MainMenu(false);
        $this->assertContains(
            'SilverStripe-Admin-CMSProfileController',
            $menuItems->column('Code'),
            'Group with CMS_ACCESS_SilverStripe\\Admin\\LeftAndMain permission can edit own profile'
        );
        $this->assertContains(
            'SilverStripe-Admin-SecurityAdmin',
            $menuItems->column('Code'),
            'Group with CMS_ACCESS_SilverStripe\\Admin\\LeftAndMain permission can access all sections'
        );
        $this->assertContains(
            'Help',
            $menuItems->column('Code'),
            'Group with CMS_ACCESS_SilverStripe\\Admin\\LeftAndMain permission can access all sections'
        );

        // admin
        $this->logInAs($adminuser);
        $this->resetMenu();
        $menuItems = LeftAndMain::singleton()->MainMenu(false);
        $this->assertContains(
            'SilverStripe-Admin-SecurityAdmin',
            $menuItems->column('Code'),
            'Administrators can access Security Admin'
        );

        $this->session()->set('loggedInAs', null);
    }
}
