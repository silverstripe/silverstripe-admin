<?php

namespace SilverStripe\Admin\Forms;

use SilverStripe\Core\Extension;
use SilverStripe\Forms\GridField\GridFieldPrintButton;
use SilverStripe\View\Requirements;

/**
 * @extends Extension<GridFieldPrintButton>
 */
class GridFieldPrintButtonExtension extends Extension
{
    public function updatePrintData($data)
    {
        Requirements::css('silverstripe/admin:client/dist/styles/GridField_print.css');
    }
}
