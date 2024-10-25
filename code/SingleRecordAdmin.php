<?php

namespace SilverStripe\Admin;

use SilverStripe\Forms\Form;
use SilverStripe\ORM\DataObject;

/**
 * The base class for admin sections that exist for editing a single record.
 */
abstract class SingleRecordAdmin extends LeftAndMain
{
    /**
     * Determines if there should be a single record in the database that this admin edits.
     *
     * If false, you need to provide a mechanism to tell the form which record it should be editing.
     * This could be an action (e.g. edit/$ID), or could be based on something about the current member, etc.
     */
    private static bool $restrict_to_single_record = true;

    /**
     * If no record exists, allow a new one to be created
     */
    private static bool $allow_new_record = true;

    public function getEditForm($id = null, $fields = null): ?Form
    {
        $form = parent::getEditForm($id, $fields);
        // Keep the tabs on the top row, rather than underneath
        if ($form?->Fields()->hasTabSet()) {
            $form->Fields()->findOrMakeTab('Root')->setTemplate('SilverStripe/Forms/CMSTabSet');
        }
        return $form;
    }

    public function getRecord($id): ?DataObject
    {
        if (!$id) {
            return $this->getSingleRecord();
        }
        return parent::getRecord($id);
    }

    protected function getSingleRecord(): ?DataObject
    {
        $record = null;
        $modelClass = static::config()->get('model_class');
        if (static::config()->get('restrict_to_single_record')) {
            $record = DataObject::get_one($modelClass);
        }
        if (!$record && static::config()->get('allow_new_record')) {
            $record = $modelClass::create();
        }
        return $record;
    }
}
