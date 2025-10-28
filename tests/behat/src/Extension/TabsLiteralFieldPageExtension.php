<?php

namespace SilverStripe\Admin\Tests\Behat\Context\Extension;

use SilverStripe\Forms\FieldList;
use SilverStripe\Core\Extension;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\TabSet;
use SilverStripe\Dev\TestOnly;

class TabsLiteralFieldPageExtension extends Extension implements TestOnly
{
    protected function updateCMSFields(FieldList &$fields): void
    {
        $fields = new FieldList([new TabSet('Root')]);
        $fields->addFieldToTab(
            'Root.Tab01',
            new LiteralField('lf01', '<p id="lf01">Nothing to focus on</p>')
        );
        $fields->addFieldToTab(
            'Root.Tab02',
            new LiteralField('lf02', '<p id="lf02" tabindex="0">Something to focus on</p>')
        );
    }
}
