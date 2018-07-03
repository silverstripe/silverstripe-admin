<?php

namespace SilverStripe\Admin;

use SilverStripe\Admin\ArchiveAdmin;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;
use SilverStripe\ORM\DataExtension;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\ValidationResult;
use SilverStripe\Versioned\Versioned;

class ArchiveRestoreAction extends DataExtension
{
    /**
     * @param HTTPRequest $request
     * @return mixed
     */
    public function updateItemEditForm(Form $form)
    {
        $record = $this->owner->getRecord();
        $admin = $this->owner->popupController;

        if ($admin instanceof ArchiveAdmin &&
            DataObject::has_extension($record, Versioned::class) &&
            $record->canEdit()) {
            $restoreToRoot = $this->shouldRestoreToRoot($record);

            $title = $restoreToRoot
                ? _t('SilverStripe\\Admin\\ArchiveAdmin.RESTORE_TO_ROOT', 'Restore draft at top level')
                : _t('SilverStripe\\Admin\\ArchiveAdmin.RESTORE', 'Restore draft');
            $description = $restoreToRoot
                ? _t('SilverStripe\\Admin\\ArchiveAdmin.RESTORE_TO_ROOT_DESC', 'Restore the archived version to draft as a top level item')
                : _t('SilverStripe\\Admin\\ArchiveAdmin.RESTORE_DESC', 'Restore the archived version to draft');
            $form->actions = FieldList::create(
                FormAction::create('doRestore', $title)
                    ->setDescription($description)
                    ->setAttribute('data-to-root', $restoreToRoot)
                    ->addExtraClass('btn-warning font-icon-back-in-time ArchiveAdmin__action--restore')
                    ->setUseButtonTag(true)
            );

            $form->unsetValidator();
        }
    }

    /**
     * Restore the record to it's original place or top level if that's not possible
     *
     * @param array $data
     * @param Form $form
     * @return HTTPResponse
     */
    public function doRestore($data, $form)
    {
        $record = $this->owner->getRecord();
        $restoreType = 'standard';

        if ($this->shouldRestoreToRoot($record)) {
            $restoreType = 'missingParent';
        }

        $restoredItem = Versioned::get_latest_version($record->classname, $record->ID);
        if (!$restoredItem) {
            return new ValidationException($record->classname . " #$record->ID not found", 400);
        }

        if (method_exists($restoredItem, 'doRestoreToStage')) {
            $restoredItem = $restoredItem->doRestoreToStage();
        } else {
            $restoredItem->writeToStage(Versioned::DRAFT);
            $restoredItem = Versioned::get_by_stage($restoredItem->classname, Versioned::DRAFT)
                ->byID($restoredItem->ID);
        }

        $restoredID = $restoredItem->Title ?: $restoredItem->ID;
        $restoredType = strtolower($restoredItem->i18n_singular_name());

        if (method_exists($restoredItem, 'CMSEditLink') &&
        $restoredItem->CMSEditLink()) {
            $restoredID = sprintf('<a href="%s">%s</a>', $restoredItem->CMSEditLink(), $restoredID);
        }

        $message = [
            'text' => _t('SilverStripe\\Admin\\ArchiveAdmin.RESTORE_TO_ROOT', 'Successfully restored the {model} "{id}"', ['model' => $restoredType, 'id' => $restoredID]),
            'type' => 'good',
        ];

        $controller = $this->owner->popupController;
        $controller->getRequest()->addHeader('X-Pjax', 'Content');
        $controller->getEditForm()->sessionMessage($message['text'], $message['type'], ValidationResult::CAST_HTML);

        return $controller->redirect($controller->Link(), 'index');
    }

    /**
     * Determines whether this record can be restored to it's original location
     *
     * @param $record
     * @return bool
     */
    public function shouldRestoreToRoot($record)
    {
        if ($parentID = $record->ParentID) {
            $parentItem = Versioned::get_latest_version($record->classname, $parentID);
            if (!$parentItem || !$parentItem->isOnDraft()) {
                return true;
            }
        }

        return false;
    }
}
