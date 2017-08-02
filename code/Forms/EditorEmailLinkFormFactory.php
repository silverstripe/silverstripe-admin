<?php

namespace SilverStripe\Admin\Forms;

use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\TextField;
use SilverStripe\Forms\RequiredFields;

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

        if ($this->requireLinkTextField($controller)) {
            $fields->insertAfter('Link', TextField::create('Text', _t(__CLASS__.'.LINKTEXT', 'Link text')));
        }

        return $fields;
    }

    protected function getValidator($controller, $name, $context)
    {
        if ($this->requireLinkTextField($controller)) {
            return RequiredFields::create('Text');
        }

        return null;
    }
}
