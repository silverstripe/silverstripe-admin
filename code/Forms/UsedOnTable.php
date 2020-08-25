<?php

namespace SilverStripe\Admin\Forms;

use League\Flysystem\Exception;
use SilverStripe\CMS\Model\SiteTree;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\ClassInfo;
use SilverStripe\Forms\FormField;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\Tests\MySQLDatabaseTest\Data;
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
        $dataObjects = $record->findOwners();
        $siteTreeSubClasses = ClassInfo::subclassesFor(SiteTree::class);

        // Example:
        // public function updateUsage(ArrayList &$dataObjects, DataObject &$record)
        //     $dataObjects = $dataObjects->exclude('ClassName', MyDataObject::class);
        $this->extend('updateUsage', $dataObjects, $record);

        // TODO: this is all pretty messy, needs a good tidy up before merging
        $tmpArr = [];
        /**
         * @var int $id
         * @var DataObject $dataObject
         */
        foreach ($dataObjects as $dataObject) {
            //$state = $this->getState($user);
            $link = $dataObject->hasMethod('CMSEditLink') ? $dataObject->CMSEditLink() : null;

            $isPage = false;
            $parentID = 0;
            $parentClass = '';
            if ($dataObject->ParentID && $parent = $dataObject->Parent()) {
                $parentID = $parent->ID;
                $parentClass = get_class($parent);
            }
            $ancestorPageID = 0;
            $object = $dataObject;
            // maximum of 3 levels
            for ($i = 0; $i < 3; $i++) {
                $isPage = in_array(get_class($object), $siteTreeSubClasses);
                if ($isPage) {
                    if ($object !== $dataObject) {
                        $ancestorPageID = $object->ID;
                    }
                    break;
                }
                // extension
                if ($object->ParentID && $parent = $object->Parent()) {
                    $object = $parent;
                    continue;
                }
                break;
            }

            $arr = [
                'id' => $dataObject->ID,
                'title' => $dataObject->getTitle() ?: _t(__CLASS__ . '.UNTITLED', 'Untitled'),
                'type' => ucwords($dataObject->singular_name()),
                //'state' => $state,
                'link' => $link,
                'class' => get_class($dataObject),
                'parentID' => $parentID,
                'parentClass' => $parentClass,
                'ancestorPageID' => $ancestorPageID,
                'isPage' => $isPage,
            ];
            $this->extend('updateUsageArray', $arr, $dataObject);
            $tmpArr[] = $arr;
        }

        $pages = [];
        foreach ($tmpArr as $arr) {
            if ($arr['isPage']) {
                $id = $arr['id'];
            } elseif ($arr['ancestorPageID'] !== 0) {
                $id = $arr['ancestorPageID'];
            } else {
                continue;
            }
            $pages[$id] = $pages[$id] ?? [];
            $pages[$id][] = $arr;
        }
        foreach (array_keys($pages) as $i) {
            usort($pages[$i], function ($a, $b) use ($siteTreeSubClasses) {
                if ($a['class'] === $b['parentClass'] && $a['ID'] === $b['parentID']) {
                    return -1;
                } elseif ($b['class'] === $a['parentClass'] && $b['ID'] === $a['parentID']) {
                    return 1;
                } elseif (in_array($a['class'], $siteTreeSubClasses)) {
                    return -1;
                } elseif (in_array($b['class'], $siteTreeSubClasses)) {
                    return 1;
                }
                return 0;
            });
        }

        $keepKeys = ['id', 'title', 'type', 'link'];
        $usage = [];
        foreach ($tmpArr as $arr) {
            if ($arr['isPage']) {
                $id = $arr['id'];
                $data = $pages[$id];
            } else {
                if ($arr['ancestorPageID'] !== 0) {
                    // will be nested in $pages
                    continue;
                }
                // other type of dataObject not nested on a page
                $data = [$arr];
            }
            foreach ($data as $i => $arr) {
                foreach (array_keys($arr) as $key) {
                    if (!in_array($key, $keepKeys)) {
                        unset($data[$i][$key]);
                    }
                }
            }
            $usage[] = $data;
        }

        $data = [
            'usage' => $usage,
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
