<?php

namespace SilverStripe\Admin\Forms;

use SilverStripe\Core\Extension;
use SilverStripe\Core\Manifest\ModuleLoader;
use SilverStripe\View\Requirements;

class GridFieldPrintButtonExtension extends Extension
{
    public function updatePrintData($data)
    {
        $module = ModuleLoader::getModule('silverstripe/admin');
        Requirements::css($module->getResourcePath('client/dist/styles/GridField_print.css'));
    }
}
