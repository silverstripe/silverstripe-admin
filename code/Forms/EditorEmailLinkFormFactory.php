<?php

namespace SilverStripe\Admin\Forms;

use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\TextField;

class EditorEmailLinkFormFactory extends LinkFormFactory
{
    protected function getFormFields($controller, $name, $context)
    {
        $fields = FieldList::create([
            TextField::create(
                'Link',
                _t(__CLASS__.'.EMAIL', 'Email address')
            ),
            TextField::create(
                'Subject',
                _t(__CLASS__.'.SUBJECT', 'Subject')
            ),
            TextField::create(
                'Description',
                _t(__CLASS__.'.LINKDESCR', 'Link description')
            ),
        ]);

        return $fields;
    }
}
