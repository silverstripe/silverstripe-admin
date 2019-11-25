<?php

namespace SilverStripe\Admin\Tests;

use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\Session;
use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Forms\GridField\GridFieldExportButton;
use SilverStripe\Forms\GridField\GridFieldImportButton;
use SilverStripe\Forms\GridField\GridFieldPrintButton;
use SilverStripe\Security\Permission;
use SilverStripe\Dev\FunctionalTest;

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
}
