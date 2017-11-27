<?php

namespace SilverStripe\Admin\Forms;

use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\TextField;
use SilverStripe\Forms\RequiredFields;

class EditorExternalLinkFormFactory extends LinkFormFactory
{
    protected function getFormFields($controller, $name, $context)
    {
        $fields = FieldList::create([
            TextField::create('Link', _t(__CLASS__.'.URL', 'URL'), 'http://'),
            TextField::create(
                'Description',
                _t(__CLASS__.'.LINKDESCR', 'Link description')
            ),
            TextField::create('Anchor', _t(__CLASS__.'.ANCHORVALUE', 'Anchor')),
            CheckboxField::create(
                'TargetBlank',
                _t(__CLASS__.'.LINKOPENNEWWIN', 'Open in new window/tab')
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
