<?php

namespace SilverStripe\Admin\Tests\Behat\Context\Extension;

use SilverStripe\Forms\FieldList;
use SilverStripe\Core\Extension;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\TabSet;
use SilverStripe\Dev\TestOnly;

class LiteralFieldPageExtension extends Extension implements TestOnly
{
    protected function updateCMSFields(FieldList &$fields): void
    {
        $fields = new FieldList([new TabSet('Root')]);
        $fields->addFieldToTab(
            'Root.Main',
            new LiteralField('lf01', '<p id="lf01">Nothing to focus on</p>')
        );
    }
}
