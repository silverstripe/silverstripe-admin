<?php

namespace SilverStripe\Admin;

use SilverStripe\Admin\ArchiveAdmin;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\RestoreAction;
use SilverStripe\ORM\DataExtension;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\ValidationResult;
use SilverStripe\Versioned\Versioned;

/**
 * Adds a restore action to the item edit form of ArchiveAdmin
 */
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
            $restoreToRoot = RestoreAction::shouldRestoreToRoot($record);

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

        $message = RestoreAction::restore($record);

        $controller = $this->owner->popupController;
        $controller->getRequest()->addHeader('X-Pjax', 'Content');
        $controller->getEditForm()->sessionMessage($message['text'], $message['type'], ValidationResult::CAST_HTML);

        return $controller->redirect($controller->Link(), 'index');
    }
}
