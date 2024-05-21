<?php

namespace SilverStripe\Admin\Tests\ModelAdminTest;

use SilverStripe\Core\Extension;
use SilverStripe\Dev\TestOnly;
use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Forms\GridField\GridFieldConfig;
use SilverStripe\Forms\GridField\GridFieldExportButton;

/**
 * This ModelAdmin is specifically designed to test that Model Admin behaves has expected when
 * getGridField and getGridFieldConfig are called.
 */
class ModelAdminExtension extends Extension implements TestOnly
{

    protected function updateGridField(GridField &$field)
    {
        $this->getOwner()->calls[__FUNCTION__]++;
        $field->setAttribute('ModelAdminExtension', 'called');
    }

    protected function updateGridFieldConfig(GridFieldConfig &$config)
    {
        $this->getOwner()->calls[__FUNCTION__]++;
        $config->removeComponentsByType(GridFieldExportButton::class);
    }
}
