<?php

namespace SilverStripe\Admin\Tests;

use SilverStripe\View\ArrayData;
use SilverStripe\Control\Session;
use SilverStripe\Dev\CsvBulkLoader;
use SilverStripe\Dev\FunctionalTest;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Security\Permission;
use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Admin\Tests\ModelAdminTest\Player;
use SilverStripe\Admin\Tests\ModelAdminTest\Contact;
use SilverStripe\Forms\GridField\GridFieldPrintButton;
use SilverStripe\Forms\GridField\GridFieldExportButton;
use SilverStripe\Forms\GridField\GridFieldImportButton;
use SilverStripe\Admin\Tests\ModelAdminTest\ModelAdminTestBulkLoader;

class ModelAdminTest extends FunctionalTest
{
    protected static $fixture_file = 'ModelAdminTest.yml';

    protected static $extra_dataobjects = [
        ModelAdminTest\Contact::class,
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
        $this->assertEquals($admin->getExportFields(), array(
            'Name' => 'Name',
            'Position' => 'Position'
        ));
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

        $this->assertContains(
            'OverridenModelAdmin',
            $field->extraClass(),
            'OverridenModelAdmin has added an extra class to the grid field'
        );
        $this->assertContains(
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
            'Managed Model that are class name only get nomalised'
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
    }

    public function testGetModelImporters()
    {
        $admin = new ModelAdminTest\MultiModelAdmin();
        $importers = $admin->getModelImporters();

        $this->assertArrayHasKey(
            Contact::class,
            $importers,
            'Implicit models'
        );
        $this->assertInstanceOf(
            CsvBulkLoader::class,
            $importers[Contact::class],
            'Implicit models create default bulk loaders'
        );

        $this->assertArrayHasKey(
            'Player',
            $importers,
            'Explicit models by alias'
        );
        $this->assertInstanceOf(
            ModelAdminTestBulkLoader::class,
            $importers['Player'],
            'Explicit models by alias allow custom bulk loaders'
        );

        $this->assertArrayHasKey(
            Player::class,
            $importers,
            'Explicit models by class'
        );
        $this->assertInstanceOf(
            ModelAdminTestBulkLoader::class,
            $importers[Player::class],
            'Explicit models by alias allow custom bulk loaders'
        );
    }

    public function testGetManagedModelTabs()
    {
        $mock = $this->getMockBuilder(ModelAdminTest\MultiModelAdmin::class)
            ->setMethods(['getManagedModels'])
            ->getMock();

        // `getManagedModelTabs` relies on `getManagedModels` whose output format has changed within the 4.x line.
        // We need to mock `getManagedModels` so it returns both the legacy and updated format.
        $mock->expects($this->once())
            ->method('getManagedModels')
            ->will($this->returnValue([
                'Player' => [
                    'dataClass' => Player::class,
                    'title' => 'Ice Hockey Players'
                ],
                Player::class => [
                    'title' => 'Rugby Players'
                ]
            ]));


        $tabs = $mock->getManagedModelTabs()->toNestedArray();

        $this->assertEquals(
            [
                'Title' => 'Ice Hockey Players',
                'Tab' => 'Player',
                'ClassName' => Player::class,
                'Link' => 'ContactAdmin/Player/',
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
                'Link' => 'ContactAdmin/SilverStripe-Admin-Tests-ModelAdminTest-Player/',
                'LinkOrCurrent' => 'link',
            ],
            $tabs[1],
            'Tab data for managed model array using the older syntax without dataClass can be generated'
        );
    }
}
