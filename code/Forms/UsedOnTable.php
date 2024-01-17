<?php

namespace SilverStripe\Admin\Forms;

use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Forms\FormField;
use SilverStripe\ORM\ArrayList;
use SilverStripe\ORM\DataObject;
use SilverStripe\Versioned\RecursivePublishable;
use SilverStripe\Versioned\Versioned;

/**
 * Provides a table which displays the provided record's owners
 *
 * NOTE: This should be a dataless field but due to how field actions work - it needs recursive checking
 */
class UsedOnTable extends FormField
{

    protected $schemaDataType = FormField::SCHEMA_DATA_TYPE_CUSTOM;

    /**
     * @var string
     */
    protected $schemaComponent = 'UsedOnTable';

    /**
     * @config
     * @var array
     */
    private static $allowed_actions = [
        'usage'
    ];

    /**
     * @var DataObject|RecursivePublishable
     */
    protected $record;

    /**
     * @return array
     */
    public function getSchemaDataDefaults()
    {
        $defaults = parent::getSchemaDataDefaults();
        $record = $this->getRecord();

        // can't really provide data for no ID or record
        if (!$record || !$record->ID) {
            return $defaults;
        }
        $usageLink = $this->Link('usage');

        $defaults['data'] = array_merge($defaults['data'], [
            'recordId' => $record->ID,
            'recordClass' => get_class($record),
            'readUsageEndpoint' => [
                'url' => $usageLink,
                'method' => 'get',
            ]
        ]);

        return $defaults;
    }

    /**
     * @param HTTPRequest $request
     * @return HTTPResponse $response
     */
    public function usage(HTTPRequest $request)
    {
        $usage = ArrayList::create();

        $record = $this->getRecord() ?: DataObject::create();
        if ($record->canView()) {
            // Exclude classes from being queried and showing in the results via an extension hook
            $excludedClasses = [];
            $this->extend('updateUsageExcludedClasses', $excludedClasses);

            $usage = $record->findAllRelatedData($excludedClasses);

            // Legacy extension hook kept for backwards compatibility
            // Use 'updateUsageExcludedClasses' extension hook instead which prevents database from being queried
            //
            // Example: public function updateUsage(ArrayList &$usage, DataObject &$record)
            //     $dataObjects = $usage->exclude('ClassName', MyDataObject::class);
            $this->extend('updateUsage', $usage, $record);
        }

        $usageData = [];
        foreach ($usage as $dataObject) {
            // Extension hook to update the DataObject for any general reason
            // A common scenario is to substitute the $dataObject for $dataObject->Parent()
            // To exclude a $dataObject from showing, set it to null in the extension
            $this->extend('updateUsageDataObject', $dataObject);
            if (!$dataObject) {
                continue;
            }

            $tableRowData = [
                'id' => $dataObject->ID,
                'title' => $dataObject->getTitle() ?: _t(__CLASS__ . '.UNTITLED', 'Untitled'),
                'type' => ucfirst($dataObject->i18n_singular_name() ?? ''),
                'link' => $dataObject->hasMethod('CMSEditLink') ? $dataObject->CMSEditLink() : null,
                'ancestors' => []
            ];

            // Extension hook to show linked ancestor DataObjects in the same row on the used on table
            // Example use case is an Elemental FileBlock on an ElementalArea (exclude) on a BlockPage (linked)
            // Example outcome: $ancestorDataObjects => [ ParentDataObject (possibly excluded), GrandParentDataObject ]
            $ancestorDataObjects = [];
            $this->extend('updateUsageAncestorDataObjects', $ancestorDataObjects, $dataObject);
            /** @var DataObject $ancestorDataObject */
            foreach ($ancestorDataObjects as $ancestorDataObject) {
                $tableRowData['ancestors'][] = [
                    'title' => $ancestorDataObject->getTitle() ?: _t(__CLASS__ . '.UNTITLED', 'Untitled'),
                    'link' => $ancestorDataObject->hasMethod('CMSEditLink') ? $ancestorDataObject->CMSEditLink() : null,
                ];
            }
            $usageData[] = $tableRowData;
        }
        $response = HTTPResponse::create(json_encode(['usage' => $usageData]));
        $response->addHeader('Content-Type', 'application/json');
        return $response;
    }

    /**
     * @param DataObject|RecursivePublishable $record
     * @return null|string
     */
    protected function getState($record)
    {
        if (!$record->hasExtension(Versioned::class)) {
            return null;
        }

        if ($record->isOnDraftOnly()) {
            return _t(__CLASS__ . '.ADDEDTODRAFT', 'Draft');
        }

        if ($record->isModifiedOnDraft()) {
            return _t(__CLASS__ . '.MODIFIEDONDRAFTSHORT', 'Modified');
        }

        return null;
    }

    /**
     * @return DataObject|RecursivePublishable
     */
    public function getRecord()
    {
        if ($this->record) {
            return $this->record;
        }
        $form = $this->getForm();
        if (!$form) {
            return null;
        }

        // Get record from form
        $record = $form->getRecord();
        if ($record && ($record instanceof DataObject)) {
            $this->record = $record;
            return $record;
        }

        return null;
    }

    /**
     * @param DataObject|RecursivePublishable $record
     */
    public function setRecord($record)
    {
        $this->record = $record;
    }

    /**
     * Attributes to be given for this field type
     *
     * @return array
     */
    public function getAttributes()
    {
        $attributes = [
            'class' => $this->extraClass(),
            'id' => $this->ID(),
            'data-schema' => json_encode($this->getSchemaData()),
            'data-state' => json_encode($this->getSchemaState()),
        ];

        $attributes = array_merge($attributes, $this->attributes);

        $this->extend('updateAttributes', $attributes);

        return $attributes;
    }
}
