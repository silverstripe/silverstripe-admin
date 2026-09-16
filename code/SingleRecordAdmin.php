<?php

namespace SilverStripe\Admin;

use SilverStripe\Forms\Form;
use SilverStripe\Forms\HiddenField;
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
        if (!$id) {
            $id = $this->currentRecordID();
        }
        $record = $this->getRecord($id);

        if (!$fields && $record) {
            $fields = $record->getCMSFields();
        }
        if ($fields && !$fields->dataFieldByName('ID')) {
            $fields->add(HiddenField::create('ID'));
        }

        $form = parent::getEditForm($id, $fields);

        // A single-record model that defines no CMS actions loses LeftAndMain's default Save button as soon
        // as an extension adds one of its own (e.g. a "translate" action), so re-add it. See issue #1841.
        if ($form && $record && $record->hasMethod('canEdit') && $record->canEdit()
            && !$form->Actions()->fieldByName('action_save')
        ) {
            $form->Actions()->unshift(static::getDefaultSaveAction());
        }
        // Keep the tabs on the top row, rather than underneath
        if ($form?->Fields()->hasTabSet()) {
            $form->addExtraClass('cms-tabset'); // Required for tabsets to work, see CMSTabSet.ss for info
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
        $modelClass = $this->getModelClass();
        if (static::config()->get('restrict_to_single_record')) {
            $record = DataObject::get($modelClass)->setUseCache(true)->first();
        }
        if (!$record && static::config()->get('allow_new_record')) {
            $record = $modelClass::create();
        }
        return $record;
    }
}
