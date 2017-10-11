<?php

namespace SilverStripe\Admin\Forms;

use SilverStripe\Core\Extension;
use SilverStripe\View\Requirements;

class GridFieldPrintButtonExtension extends Extension
{
    public function updatePrintData($data)
    {
        Requirements::css('silverstripe/admin:client/dist/styles/GridField_print.css');
    }
}
