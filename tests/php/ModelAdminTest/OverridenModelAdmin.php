<?php

namespace SilverStripe\Admin\Tests\ModelAdminTest;

use SilverStripe\Admin\ModelAdmin;
use SilverStripe\Control\Controller;
use SilverStripe\Dev\TestOnly;
use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Forms\GridField\GridFieldConfig;
use SilverStripe\Forms\GridField\GridFieldPrintButton;

/**
 * This ModelAdmin is specifically designed to test that Model Admin behaves as expected when getGridField and
 * getGridFieldConfig are called.
 *
 * The `$calls` attribute count the number of time each protected methods has been called.
 *
 * `getGridField` adds an extra class to the grid field and the `updateGridField` hook adds an attribute.
 *
 * `getGridFieldConfig` removes the Print component and the `updateGridField` hook removes the Export component
 */
class OverridenModelAdmin extends ModelAdmin implements TestOnly
{
    private static $url_segment = 'overriden-admin';

    private static $managed_models = [
        Player::class
    ];

    private static $extensions = [
        ModelAdminExtension::class
    ];

    /**
     * @var array Number of times the protected gridfield and gridfield config method and related hooks have been
     * called.
     */
    public $calls = [
        'getGridField' => 0,
        'getGridFieldConfig' => 0,
        'updateGridField' => 0,
        'updateGridFieldConfig' => 0,
    ];

    public $showImportForm = true;


    protected function getGridField(): GridField
    {
        $this->calls[__FUNCTION__]++;

        $field = parent::getGridField();

        $field->addExtraClass('OverridenModelAdmin');

        return $field;
    }

    protected function getGridFieldConfig(): GridFieldConfig
    {
        $this->calls[__FUNCTION__]++;
        $config = parent::getGridFieldConfig();
        $config->removeComponentsByType(GridFieldPrintButton::class);
        return $config;
    }
}
