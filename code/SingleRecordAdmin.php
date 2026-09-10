<?php

namespace SilverStripe\Admin;

use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;
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
        if (!$fields) {
            if (!$id) {
                $id = $this->currentRecordID();
            }
            $record = $this->getRecord($id);
            if ($record) {
                $fields = $record->getCMSFields();
            }
        }
        if ($fields && !$fields->dataFieldByName('ID')) {
            $fields->add(HiddenField::create('ID'));
        }

        $form = parent::getEditForm($id, $fields);

        // LeftAndMain::getEditForm() only adds the default Save (and Delete)
        // action when the record's getCMSActions() returns an EMPTY list. A
        // single-record model (e.g. SiteConfig) usually defines no actions of
        // its own, so as soon as any extension adds one via updateCMSActions()
        // - for example a "translate" button - the list is no longer empty and
        // the Save button silently disappears, leaving no way to save the
        // record. Guarantee a Save action here for editable records.
        // See https://github.com/silverstripe/silverstripe-admin/issues/1841.
        $record = $this->getRecord($id ?: $this->currentRecordID());
        if ($form && $record && $record->hasMethod('canEdit') && $record->canEdit()
            && !$form->Actions()->fieldByName('action_save')
        ) {
            $form->Actions()->unshift(
                FormAction::create('save', _t(LeftAndMain::class . '.SAVE', 'Save'))
                    ->addExtraClass('btn btn-primary')
                    ->setIcon('add-circle')
            );
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
