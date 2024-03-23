<?php

namespace SilverStripe\Admin\Forms;

use SilverStripe\Forms\EmailField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\TextField;
use SilverStripe\Forms\RequiredFields;

class EditorEmailLinkFormFactory extends LinkFormFactory
{
    protected function getFormFields($controller, $name, $context)
    {
        $fields = FieldList::create([
            EmailField::create(
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

        if ($context['RequireLinkText']) {
            $fields->insertAfter('Link', TextField::create('Text', _t(__CLASS__.'.LINKTEXT', 'Link text')));
        }

        $this->extend('updateFormFields', $fields, $controller, $name, $context);

        return $fields;
    }

    protected function getValidator($controller, $name, $context)
    {
        if ($context['RequireLinkText']) {
            return RequiredFields::create('Text');
        }

        return null;
    }
}
