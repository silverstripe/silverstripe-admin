<?php

namespace SilverStripe\Admin\Tests;

use InvalidArgumentException;
use ReflectionMethod;
use SilverStripe\Admin\Tests\ModelAdminTest\Contact;
use SilverStripe\Admin\Tests\ModelAdminTest\ContactSubclass;
use SilverStripe\Admin\Tests\ModelAdminTest\MultiModelAdmin;
use SilverStripe\Admin\Tests\ModelAdminTest\Player;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\Session;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Dev\FunctionalTest;
use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Forms\GridField\GridFieldExportButton;
use SilverStripe\Forms\GridField\GridFieldImportButton;
use SilverStripe\Forms\GridField\GridFieldPrintButton;
use SilverStripe\Security\Permission;

class ModelAdminTest extends FunctionalTest
{
    protected static $fixture_file = 'ModelAdminTest.yml';

    protected static $extra_dataobjects = [
        ModelAdminTest\Contact::class,
        ModelAdminTest\ContactSubclass::class,
        ModelAdminTest\Player::class,
        ModelAdminTest\OverridenModelAdmin::class
    ];

    protected static $extra_controllers = [
        ModelAdminTest\ContactAdmin::class,
        ModelAdminTest\PlayerAdmin::class,
    ];

    public function testModelAdminOpens()
    {
        $this->autoFollowRedirection = false;
        $this->logInAs('admin');
        $this->assertTrue((bool)Permission::check("ADMIN"));
        $this->assertEquals(200, $this->get('ContactAdmin')->getStatusCode());
    }

    public function testMultiModelAdminOpensEachTab()
    {
        $admin = new MultiModelAdmin();
        $this->logInWithPermission();
        foreach ($admin->getManagedModelTabs()->toNestedArray() as $tab) {
            $request = new HTTPRequest('GET', $tab['Link']);
            $request->setRouteParams(['ModelClass' => substr($tab['Link'] ?? '', strlen('admin/multi/'))]);
            $request->setSession(new Session([]));
            Injector::inst()->registerService($request, HTTPRequest::class);
            $admin->setRequest($request);
            $admin->doInit();
            $this->assertEquals(
                $tab["Tab"],
                $admin->getModelTab(),
                sprintf('Accessing the %s link resolves to the %s tab', $tab['Link'], $tab["Tab"])
            );
            $this->assertEquals(
                $tab["ClassName"],
                $admin->getModelClass(),
                sprintf(
                    'Accessing the %s link sets the ModelAdmin class to %s',
                    $tab['Link'],
                    $tab["ClassName"]
                )
            );
        }
    }

    public function testExportFieldsDefaultIsSummaryFields()
    {
        $admin = new ModelAdminTest\ContactAdmin();
        $request = new HTTPRequest('GET', '/');
        $request->setSession(new Session([]));
        $admin->setRequest($request);
        $admin->doInit();
        $this->assertEquals(
            $admin->getExportFields(),
            ModelAdminTest\Contact::singleton()->summaryFields()
        );
    }

    public function testExportFieldsOverloadedMethod()
    {
        $admin = new ModelAdminTest\PlayerAdmin();
        $request = new HTTPRequest('GET', '/');
        $request->setSession(new Session([]));
        $admin->setRequest($request);
        $admin->doInit();
        $this->assertEquals($admin->getExportFields(), [
            'Name' => 'Name',
            'Position' => 'Position'
        ]);
    }

    public function testGetGridField()
    {
        $admin = new ModelAdminTest\OverridenModelAdmin();
        $request = new HTTPRequest('GET', '/');
        $request->setSession(new Session([]));
        $admin->setRequest($request);
        $admin->doInit();

        // Test the call counts
        $this->assertEquals(
            [
                'getGridField' => 0,
                'getGridFieldConfig' => 0,
                'updateGridField' => 0,
                'updateGridFieldConfig' => 0,
            ],
            $admin->calls,
            'Before calling Edit Form, all our call counts are zero'
        );

        $form = $admin->getEditForm();

        $this->assertEquals(
            [
                'getGridField' => 1,
                'getGridFieldConfig' => 1,
                'updateGridField' => 1,
                'updateGridFieldConfig' => 1,
            ],
            $admin->calls,
            'All protected method and extension points have been called once.'
        );

        // Test the GridField generation
        /** @var GridField $field */
        $field = $form->Fields()->fieldByName('SilverStripe-Admin-Tests-ModelAdminTest-Player');
        $this->assertNotNull($field, 'A GridField has been found on the form.');

        $this->assertStringContainsString(
            'OverridenModelAdmin',
            $field->extraClass(),
            'OverridenModelAdmin has added an extra class to the grid field'
        );
        $this->assertStringContainsString(
            'called',
            $field->getAttribute('ModelAdminExtension'),
            'ModelAdminExtension has added an attribute to the GridField'
        );

        // Test the GridField Config
        $config = $field->getConfig();
        $this->assertEmpty(
            $config->getComponentByType(GridFieldExportButton::class),
            'OverridenModelAdmin removes the Export Button'
        );

        $this->assertEmpty(
            $config->getComponentByType(GridFieldPrintButton::class),
            'ModelAdminExtension removes the Print Button'
        );

        $this->assertNotEmpty(
            $config->getComponentByType(GridFieldImportButton::class),
            'The import button is still there'
        );
    }

    public function testGetModelImporters()
    {
        $admin = new ModelAdminTest\MultiModelAdmin();
        $importers = $admin->getModelImporters();
        $this->assertCount(4, $importers);
        $this->assertArrayHasKey(Contact::class, $importers);
        $this->assertArrayHasKey(Player::class, $importers);
        $this->assertArrayHasKey('Player', $importers);
        $this->assertArrayHasKey('cricket-players', $importers);
    }

    public function testGetManagedModels()
    {
        $admin = new ModelAdminTest\MultiModelAdmin();

        $models = $admin->getManagedModels();

        $this->assertEquals(
            [
                'dataClass' => Contact::class,
                'title' => 'Contacts'
            ],
            $models[Contact::class],
            'Managed Model that are class name only get normalised'
        );

        $this->assertEquals(
            [
                'dataClass' => Player::class,
                'title' => 'Ice Hockey Players'
            ],
            $models['Player'],
            'Managed Model with an explicit dataClass can have a custom URL key'
        );

        $this->assertEquals(
            [
                'dataClass' => Player::class,
                'title' => 'Rugby Players'
             ],
            $models[Player::class],
            'Managed Model without a dataClass provided default to using the class name for dataClass'
        );

        $this->assertEquals(
            [
                'dataClass' => Player::class,
                'title' => 'Cricket Players',
            ],
            $models['cricket-players'],
            'Managed Model with an arbitrary name can have a hyphen in the URL key'
        );
    }

    public function testGetManagedModelTabs()
    {
        $mock = $this->getMockBuilder(ModelAdminTest\MultiModelAdmin::class)
            ->onlyMethods(['getManagedModels'])
            ->getMock();

        // `getManagedModelTabs` relies on `getManagedModels` whose output format has changed within the 4.x line.
        // We need to mock `getManagedModels` so it returns both the legacy and updated format.
        $mock->expects($this->atLeastOnce())
            ->method('getManagedModels')
            ->willReturn([
                'Player' => [
                    'dataClass' => Player::class,
                    'title' => 'Ice Hockey Players'
                ],
                Player::class => [
                    'title' => 'Rugby Players'
                ],
                'cricket-players' => [
                    'dataClass' => Player::class,
                    'title' => 'Cricket Players',
                ],
            ]);


        $tabs = $mock->getManagedModelTabs()->toNestedArray();

        $this->assertEquals(
            [
                'Title' => 'Ice Hockey Players',
                'Tab' => 'Player',
                'ClassName' => Player::class,
                'Link' => 'admin/multi/Player',
                'LinkOrCurrent' => 'link',
            ],
            $tabs[0],
            'Tab data for managed model array using the newer syntax with dataClass can be generated'
        );

        $this->assertEquals(
            [
                'Title' => 'Rugby Players',
                'Tab' => 'SilverStripe\Admin\Tests\ModelAdminTest\Player',
                'ClassName' => Player::class,
                'Link' => 'admin/multi/SilverStripe-Admin-Tests-ModelAdminTest-Player',
                'LinkOrCurrent' => 'link',
            ],
            $tabs[1],
            'Tab data for managed model array using the older syntax without dataClass can be generated'
        );

        $this->assertEquals(
            [
                'Title' => 'Cricket Players',
                'Tab' => 'cricket-players',
                'ClassName' => Player::class,
                'Link' => 'admin/multi/cricket-players',
                'LinkOrCurrent' => 'link',
            ],
            $tabs[2],
            'Tab data for managed model array using the newer syntax with dataClass and a hyphen can be generated'
        );
    }

    public function testGetLinkForModelClass()
    {
        $admin = new ModelAdminTest\MultiModelAdmin();
        $this->assertEquals(
            'admin/multi/' . $this->sanitiseClassName(Contact::class),
            $admin->getLinkForModelClass(Contact::class)
        );
        $this->assertEquals(
            'admin/multi/' . $this->sanitiseClassName(Contact::class),
            $admin->getLinkForModelClass(ContactSubclass::class)
        );
        $this->assertEquals(
            'admin/multi/Player',
            $admin->getLinkForModelClass(Player::class)
        );
    }

    public function testLinkForInvalidModelClass()
    {
        $admin = new ModelAdminTest\MultiModelAdmin();
        $this->expectException(InvalidArgumentException::class);
        $admin->getLinkForModelClass('cricket-players');
    }

    public function testGetLinkForModelTab()
    {
        $admin = new ModelAdminTest\MultiModelAdmin();
        $this->assertEquals(
            'admin/multi/' . $this->sanitiseClassName(Contact::class),
            $admin->getLinkForModelTab(Contact::class)
        );
        $this->assertEquals(
            'admin/multi/Player',
            $admin->getLinkForModelTab('Player')
        );
        $this->assertEquals(
            'admin/multi/' . $this->sanitiseClassName(Player::class),
            $admin->getLinkForModelTab(Player::class)
        );
        $this->assertEquals(
            'admin/multi/cricket-players',
            $admin->getLinkForModelTab('cricket-players')
        );
    }

    public function testLinkForInvalidModelTab()
    {
        $admin = new ModelAdminTest\MultiModelAdmin();
        $this->expectException(InvalidArgumentException::class);
        $admin->getLinkForModelTab(ContactSubclass::class);
    }

    public function testGetCMSEditLinkForManagedDataObject()
    {
        $admin = new ModelAdminTest\MultiModelAdmin();
        $contact = $this->objFromFixture(Contact::class, 'sam');
        $sanitisedContact = $this->sanitiseClassName(Contact::class);
        $this->assertEquals(
            "admin/multi/$sanitisedContact/EditForm/field/$sanitisedContact/item/$contact->ID",
            $admin->getCMSEditLinkForManagedDataObject($contact)
        );

        $contact2 = $this->objFromFixture(ContactSubclass::class, 'danie');
        $this->assertEquals(
            "admin/multi/$sanitisedContact/EditForm/field/$sanitisedContact/item/$contact2->ID",
            $admin->getCMSEditLinkForManagedDataObject($contact2)
        );

        // Note: It uses the first tab that has this class - we're using
        // this to test that it correctly uses the tab name "Player"
        $player = $this->objFromFixture(Player::class, 'amy');
        $this->assertEquals(
            "admin/multi/Player/EditForm/field/Player/item/$player->ID",
            $admin->getCMSEditLinkForManagedDataObject($player)
        );
    }

    public function testGetModelTabForModelClass()
    {
        $admin = new ModelAdminTest\MultiModelAdmin();
        $reflectionMethod = new ReflectionMethod($admin, 'getModelTabForModelClass');
        $reflectionMethod->setAccessible(true);
        $this->assertSame(Contact::class, $reflectionMethod->invoke($admin, Contact::class));
        $this->assertSame(Contact::class, $reflectionMethod->invoke($admin, ContactSubclass::class));
        $this->assertSame('Player', $reflectionMethod->invoke($admin, Player::class));
    }

    public function testGetModelTabForInvalidModelClass()
    {
        $admin = new ModelAdminTest\MultiModelAdmin();
        $reflectionMethod = new ReflectionMethod($admin, 'getModelTabForModelClass');
        $reflectionMethod->setAccessible(true);
        $this->expectException(InvalidArgumentException::class);
        $reflectionMethod->invoke($admin, 'cricket-players');
    }

    public function testGetModelTabForModelClassNoSpec()
    {
        /** @var ModelAdmin $mock */
        $mock = $this->getMockBuilder(ModelAdminTest\MultiModelAdmin::class)->getMock();

        // `ModelTabForModelClass` relies on `getManagedModels` whose output format has changed within the 4.x line.
        // We need to mock `getManagedModels` to test the legacy format.
        $mock->expects($this->atLeastOnce())
            ->method('getManagedModels')
            ->willReturn([
                Player::class => [
                    'title' => 'Rugby Players'
                ],
            ]);

        $reflectionMethod = new ReflectionMethod($mock, 'getModelTabForModelClass');
        $reflectionMethod->setAccessible(true);
        $this->assertSame(Player::class, $reflectionMethod->invoke($mock, Player::class));
    }

    public function testIsManagedModel()
    {
        $admin = new ModelAdminTest\MultiModelAdmin();
        $this->assertTrue($admin->isManagedModel(Contact::class));
        $this->assertTrue($admin->isManagedModel(ContactSubclass::class));
        $this->assertTrue($admin->isManagedModel(Player::class));
        $this->assertTrue($admin->isManagedModel('cricket-players'));
        $this->assertFalse($admin->isManagedModel('not-managed'));
    }

    private function sanitiseClassName(string $className): string
    {
        return str_replace('\\', '-', $className);
    }
}
