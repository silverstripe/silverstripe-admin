<?php

namespace SilverStripe\Admin\Forms;

use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Forms\FormField;
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
     * @skipUpgrade
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
        $record = $this->getRecord();
        $usage = $record->findOwners();

        $this->extend('updateUsage', $usage, $record);

        $usageData = [];
        /**
         * @var string $userId
         * @var DataObject $user
         */
        foreach ($usage as $userId => $user) {
            $state = $this->getState($user);
            $link = $user->hasMethod('CMSEditLink') ? $user->CMSEditLink() : null;

            $usageData[] = [
                'id' => $userId,
                'title' => $user->getTitle(),
                'type' => $user->singular_name(),
                'state' => $state,
                'link' => $link,
            ];
        }

        $data = [
            'usage' => $usageData,
        ];

        $response = new HTTPResponse(json_encode($data));
        return $response
            ->addHeader('Content-Type', 'application/json');
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
     * @return array
     */
    public function getAttributes()
    {
        $attributes = array(
            'class' => $this->extraClass(),
            'id' => $this->ID(),
            'data-schema' => json_encode($this->getSchemaData()),
            'data-state' => json_encode($this->getSchemaState()),
        );

        $attributes = array_merge($attributes, $this->attributes);

        $this->extend('updateAttributes', $attributes);

        return $attributes;
    }
}
