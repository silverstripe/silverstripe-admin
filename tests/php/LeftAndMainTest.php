<?php

namespace SilverStripe\Admin\Tests;

use SilverStripe\Admin\AdminRootController;
use SilverStripe\Admin\CMSMenu;
use SilverStripe\Admin\LeftAndMain;
use SilverStripe\Assets\File;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Manifest\ModuleLoader;
use SilverStripe\Dev\FunctionalTest;
use SilverStripe\View\Requirements;
use SilverStripe\Admin\Tests\LeftAndMainTest\MyTree;
use SilverStripe\Admin\Tests\LeftAndMainTest\MyTreeController;
use stdClass;
use PHPUnit\Framework\Attributes\DataProvider;
use SilverStripe\Core\Manifest\VersionProvider;

class LeftAndMainTest extends FunctionalTest
{
    protected static $extra_dataobjects = [
        MyTree::class
    ];

    protected static $extra_controllers = [
        MyTreeController::class
    ];

    protected $backupCombined;

    protected function setUp(): void
    {
        parent::setUp();

        $this->resetMenu();
        $this->backupCombined = Requirements::get_combined_files_enabled();
        $base = ModuleLoader::inst()->getManifest()->getModule('silverstripe/admin');
        $assetsDir = File::join_paths($base->getRelativePath(), 'tests/php/assets');

        LeftAndMain::config()
            ->merge('extra_requirements_css', [
                $assetsDir.'/LeftAndMainTest.css',
                $assetsDir. '/LeftAndMainTestWithOptions.css' => [
                    'media' => 'print',
                    'crossorigin' => 'anonymous'
                ],
            ])
            ->merge('extra_requirements_javascript', [
                $assetsDir. '/LeftAndMainTest.js',
                $assetsDir. '/LeftAndMainTestWithOptions.js' => [
                    'crossorigin' => 'anonymous'
                ],
            ]);

        Requirements::set_combined_files_enabled(false);
    }

    /**
     * Clear menu to default state as per LeftAndMain::init()
     */
    protected function resetMenu()
    {
        CMSMenu::clear_menu();
        CMSMenu::populate_menu();
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        Requirements::set_combined_files_enabled($this->backupCombined);
    }

    public function testExtraCssAndJavascript()
    {
        $this->logInWithPermission('ADMIN');
        $response = $this->get('admin/security');

        // Check css
        $this->assertMatchesRegularExpression(
            '/<link.*?href="[^"]*?tests\/php\/assets\/LeftAndMainTest\.css.*?>/i',
            $response->getBody(),
            'body should contain custom css'
        );
        $this->assertMatchesRegularExpression(
            '/<link.*?href="[^"]*?tests\/php\/assets\/LeftAndMainTestWithOptions\.css.*?(?=.*?crossorigin="anonymous")(?=.*media="print").*?>/i',
            $response->getBody(),
            'body should contain custom css with options'
        );

        // Check js
        $this->assertMatchesRegularExpression(
            '/<script.*?src="[^"]*?tests\/php\/assets\/LeftAndMainTest\.js.*?>/i',
            $response->getBody(),
            'body should contain custom js'
        );
        $this->assertMatchesRegularExpression(
            // positive look ahead used because the `crossorigin` might be before or after the `src` - but either is fine.
            '/<script(?=[^<>]*?crossorigin="anonymous").*?(src="[^"]*?tests\/php\/assets\/LeftAndMainTestWithOptions\.js).*?>/i',
            $response->getBody(),
            'body should contain custom js with options'
        );
    }

    /**
     * Check that subclasses of LeftAndMain can be accessed
     */
    public function testLeftAndMainSubclasses()
    {
        $this->logInWithPermission('ADMIN');
        $this->resetMenu();

        $menuItems = LeftAndMain::singleton()->MainMenu(false);
        $this->assertGreaterThan(0, count($menuItems ?? []));

        $adminUrl = AdminRootController::admin_url();
        $menuItem = $menuItems->find('Link', Controller::join_links($adminUrl, 'security/'));
        $this->assertNotEmpty($menuItem, 'Security not found in the menu items list');

        $link = $menuItem->Link;
        $response = $this->get($link);

        $this->assertInstanceOf(HTTPResponse::class, $response, "$link should return a response object");
        $this->assertEquals(200, $response->getStatusCode(), "$link should return 200 status code");
        // Check that a HTML page has been returned
        $this->assertMatchesRegularExpression('/<html[^>]*>/i', $response->getBody(), "$link should contain <html> tag");
        $this->assertMatchesRegularExpression('/<head[^>]*>/i', $response->getBody(), "$link should contain <head> tag");
        $this->assertMatchesRegularExpression('/<body[^>]*>/i', $response->getBody(), "$link should contain <body> tag");
    }


    /**
     * Test that getHelpLinks transforms $help_links into the correct format
     */
    public function testGetHelpLinks()
    {
        Config::modify()->set(LeftAndMain::class, 'help_links', [
            'SilverStripe' => 'www.silverstripe.org',
        ]);

        $helpLinks = LeftAndMain::singleton()->getHelpLinks();
        $this->assertCount(1, $helpLinks, 'Unexpected number of help links found');

        $silverstripeLink = $helpLinks->first();

        $this->assertEquals('SilverStripe', $silverstripeLink['Title']);
        $this->assertEquals('www.silverstripe.org', $silverstripeLink['URL']);
    }

    public function testDisableHelpLinks()
    {
        Config::modify()->set(LeftAndMain::class, 'help_links', false);
        $helpLinks = LeftAndMain::singleton()->getHelpLinks();
        $this->assertCount(0, $helpLinks);
    }

    #[DataProvider('provideTestCMSVersionNumber')]
    public function testCMSVersionNumber($frameworkVersion, $expected)
    {
        $versionProvider = $this
            ->getMockBuilder(VersionProvider::class)
            ->onlyMethods(['getModules', 'getModuleVersionFromComposer'])
            ->getMock();
        $data = ['silverstripe/framework' => $frameworkVersion];
        $versionProvider->method('getModules')->willReturn($data);
        $versionProvider->method('getModuleVersionFromComposer')->willReturn($data);
        $leftAndMain = $this
            ->getMockBuilder(LeftAndMain::class)
            ->onlyMethods(['getVersionProvider'])
            ->getMock();
        $leftAndMain->method('getVersionProvider')->willReturn($versionProvider);
        $this->assertSame($expected, $leftAndMain->CMSVersionNumber());
    }

    /**
     * @return array
     */
    public static function provideTestCMSVersionNumber()
    {
        return [
            ['4.9.1', '4.9'],
            ['4.10.5', '4.10'],
            ['4.236.7', '4.236'],
            ['4.9.x-dev', '4.9'],
            ['4.10.x-dev', '4.10'],
            ['myfork', 'myfork'],
        ];
    }

    public function testValidationResult()
    {
        $this->logInWithPermission('ADMIN');
        $obj = MyTree::create();
        $obj->write();

        $getValidationResult = function ($content) use ($obj): stdClass {
            $response = $this->post(
                "admin/mytree/edit/EditForm/{$obj->ID}/",
                [
                    'ID' => $obj->ID,
                    'Content' => $content,
                    'ajax' => 1,
                    'action_save' => 1
                ],
                [
                    'X-Pjax' => 'ValidationResult',
                ]
            );
            $validationResultPjax = json_decode($response->getBody())->ValidationResult;
            return json_decode(preg_replace('#</?script[^>]*?>#', '', $validationResultPjax));
        };

        // Test valid content
        $result = $getValidationResult('Valid content');
        $this->assertTrue($result->isValid);
        $this->assertSame(0, count($result->messages));

        // Test invalid content
        $result = $getValidationResult(MyTree::INVALID_CONTENT);
        $this->assertFalse($result->isValid);
        $this->assertSame(1, count($result->messages));
        $this->assertSame($result->messages[0]->fieldName, 'Content');
        $this->assertSame($result->messages[0]->message, MyTree::INVALID_CONTENT_MESSAGE);
    }
}
