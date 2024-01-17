<?php

namespace SilverStripe\Admin;

use LogicException;
use SilverStripe\CMS\Controllers\CMSMain;
use SilverStripe\Control\Controller;
use SilverStripe\Control\Director;
use SilverStripe\Core\Extension;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Forms\GridField\GridFieldDetailForm;
use SilverStripe\ORM\DataObject;

/**
 * An extension that automatically generates a CMS edit link for DataObjects even if
 * they are canonically edited in some nested {@link GridField}.
 * Designed to be used in conjunction with the {@link CMSPreviewable} interface.
 *
 * For nested relations (e.g. a DataObject managed in a GridField of another DataObject)
 * you can apply this extension to both the parent and the child object and the links
 * will chain down the nested `GridField`s to the root cms_edit_owner.
 *
 * You must set a cms_edit_owner config variable which defines the cms edit
 * owner for this class.
 * e.g. set this to a {@link LeftAndMain} class:
 * private static string cms_edit_owner = MyModelAdmin::class;
 * or to a has_one relation:
 * private static string cms_edit_owner = 'Parent';
 *
 * Note that the cms_edit_owner must implement a getCMSEditLinkForManagedDataObject() method.
 *
 * If the cms_edit_owner is a has_one relation, the class on the other end
 * of the relation must have a CMSEditLink() method.
 *
 * @template T of LeftAndMain|DataObject
 * @extends Extension<T&static>
 */
class CMSEditLinkExtension extends Extension
{
    private static string $cms_edit_owner = '';

    /**
     * Get the ModelAdmin, LeftAndMain, or DataObject which owns this object for CMS editing purposes.
     *
     * @return DataObject|LeftAndMain|null
     */
    public function getCMSEditOwner()
    {
        $ownerType = $this->owner->config()->get('cms_edit_owner');
        if (is_subclass_of($ownerType, LeftAndMain::class)) {
            return $ownerType::singleton();
        }
        return $this->owner->getComponent($ownerType);
    }

    /**
     * Get the link for editing an object from the CMS edit form of this object.
     * @throws LogicException if a link cannot be established
     * e.g. if the object is not in a has_many relation or not edited inside a GridField.
     */
    public function getCMSEditLinkForManagedDataObject(DataObject $obj, string $reciprocalRelation): string
    {
        $fields = $this->owner->getCMSFields();
        $link = $this->getCMSEditLinkForRelation($this->owner->hasMany(false), $obj, $reciprocalRelation, $fields);
        if (!$link) {
            throw new LogicException('Could not produce an edit link for the passed object.');
        }
        return $link;
    }

    /**
     * Get a link to edit this DataObject in the CMS.
     */
    public function CMSEditLink(): string
    {
        /** @var DataObject|LeftAndMain|null $owner */
        $owner = $this->owner->getCMSEditOwner();
        if (!$owner || !$owner->exists()) {
            return '';
        }

        if (!$owner->hasMethod('getCMSEditLinkForManagedDataObject')) {
            throw new LogicException('The cms_edit_owner must implement getCMSEditLinkForManagedDataObject()');
        }

        if ($owner instanceof DataObject) {
            $relativeLink = $owner->getCMSEditLinkForManagedDataObject($this->owner, $this->owner->config()->get('cms_edit_owner'));
        } else {
            $relativeLink = $owner->getCMSEditLinkForManagedDataObject($this->owner);
        }
        return Director::absoluteURL((string) $relativeLink);
    }

    private function getCMSEditLinkForRelation(array $componentConfig, DataObject $obj, string $reciprocalRelation, FieldList $fields): string
    {
        $candidate = null;
        foreach ($componentConfig as $relation => $class) {
            // Check for dot notation being used to explicitly mark the reciprocal relation.
            $remoteField = null;
            if (strpos($class ?? '', '.') !== false) {
                list($class, $remoteField) = explode('.', $class ?? '');
            }

            // We're only interested in relations to the $obj class.
            if (!is_a($obj, $class)) {
                continue;
            }

            if ($remoteField) {
                if ($remoteField === $reciprocalRelation) {
                    // We've found a direct reciprocal relation, so this is definitely correct.
                    if ($this->relationIsEditable($relation, $fields)) {
                        return $this->constructLink($relation, $obj->ID);
                    }
                    // If the relation isn't in a gridfield, we have no link for it.
                    return '';
                }
                // We're not interested in unrelated relations.
                continue;
            }

            // Check for relations that have gridfields we can build a link from.
            if ($this->relationIsEditable($relation, $fields)) {
                $candidate = $relation;
            }
        }

        // Only do this if we didn't find a direct reciprocal relation.
        return $candidate ? $this->constructLink($candidate, $obj->ID) : '';
    }

    private function relationIsEditable(string $relation, FieldList $fields): bool
    {
        $field = $fields->dataFieldByName($relation);
        return $field
            && $field instanceof GridField
            && $field->getConfig()->getComponentByType(GridFieldDetailForm::class);
    }

    private function constructLink(string $relation, int $id): string
    {
        $ownerType = $this->owner->config()->get('cms_edit_owner');
        $prefix = is_a($ownerType, CMSMain::class, true) ? 'field' : 'ItemEditForm/field';
        return Controller::join_links(
            $this->owner->CMSEditLink(),
            $prefix,
            $relation,
            'item',
            $id
        );
    }
}
