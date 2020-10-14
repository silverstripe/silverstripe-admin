<?php

namespace SilverStripe\Admin\Forms;

use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\ClassInfo;
use SilverStripe\Forms\FormField;
use SilverStripe\ORM\ArrayList;
use SilverStripe\ORM\Connect\Query;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\DataObjectSchema;
use SilverStripe\ORM\Queries\SQLSelect;
use SilverStripe\Versioned\RecursivePublishable;
use SilverStripe\Versioned\Versioned;
use SilverStripe\Core\Config\Config;

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
     * An extension hook can be used to do the following:
     * a) Exclude DataObjects of a particular type of class from showing in results
     * b) Link ancestors of a DataObject so they show on the same row of results
     *
     * Example php:
     *
     * namespace My\App\Extensions;
     *
     * use SilverStripe\Core\Extension;
     * use SilverStripe\ORM\DataObject;
     *
     * class UsedOnTableExtension extends Extension
     * {
     *
     *     public function updateUsageExcludedClasses(array &$excludedClasses)
     *     {
     *         $excludedClasses[] = MyDataObjectToExclude::class;
     *     }
     *
     *     public function updateUsageAncestorDataObjects(array &$ancestorDataObjects, DataObject $dataObject)
     *     {
     *         if (!($dataObject instanceof MyDataObjectThatIWantToLink)) {
     *             return;
     *         }
     *         $parentObjectIWantToIgnore = $dataObject->MyParentComponent();
     *         $grandParentObjectIWantToLink = $parentObjectIWantToIgnore->MyParentComponent();
     *         // Add $grandParentObjectIWantToLink to ancestors, but not $parentObjectIWantToIgnore
     *         $ancestorDataObjects[] = $grandParentIWantToLink;
     *     }
     * }
     *
     * Example yml:
     *
     * SilverStripe\Admin\Forms\UsedOnTable:
     *   extensions:
     *     - My\App\Extensions\UsedOnTableExtension
     *
     * @param HTTPRequest $request
     * @return HTTPResponse $response
     *
     * @throws \ReflectionException
     */
    public function usage(HTTPRequest $request)
    {
        $record = $this->getRecord();

        // Relationship types has_many and belongs_to are not required
        $relationTypes = [
            'has_one',
            'many_many',
            'belongs_many_many',
        ];

        $config = Config::inst()->getAll();
        $dataObjectSchema = DataObjectSchema::create();
        $classToTableName = $dataObjectSchema->getTableNames();

        // Exclude classes from being queried and showing in the results via an extension hook
        $excludedClasses = [];
        $this->extend('updateUsageExcludedClasses', $excludedClasses);

        // Fix issue that only happens when unit-testing via SapphireTest
        // TestOnly class tables are only created if they're defined in SapphireTest::$extra_dataobject
        // This means there's a large number of TestOnly classes, unrelated to the UsedOnTable, that
        // do not have tables.  Remove these table-less classes from $classToTableName.
        foreach ($classToTableName as $class => $tableName) {
            if (!ClassInfo::hasTable($tableName)) {
                unset($classToTableName[$class]);
            }
        }
        $throughClasses = [];
        $classIDs = [];

        // Loop all config data to find reverse relationships pointing back to $record
        foreach (array_keys($config) as $lowercaseClassName) {
            if (!class_exists($lowercaseClassName)) {
                continue;
            }
            // Example of $class: My\App\MyPage (extends SiteTree)
            $class = ClassInfo::class_name($lowercaseClassName);
            if (!is_subclass_of($class, DataObject::class) || in_array($class, $excludedClasses)) {
                continue;
            }

            // Loop has_one and many_many within the config data for the class
            foreach ($relationTypes as $relationType) {
                $configData = Config::forClass($class)->get($relationType);
                if (empty($configData)) {
                    continue;
                }
                foreach ($configData as $component => $componentClass) {
                    // Example $component: 'MyFile'
                    // Example $componentClassName: SilverStripe\Assets\File::class
                    // Example php file config: private static $has_one = [ 'MyFile' => File::class ]
                    $componentClass = $this->updateComponentClass($componentClass, $config, $throughClasses);

                    // $record with usually be a File, or a subclass of File. Example: MyFile
                    // $componentClass will usually be a File, so a $record subclass like MyFile will match
                    if (!($record instanceof $componentClass)) {
                        continue;
                    }

                    // Query database to get file usage data
                    $results = [];
                    if ($relationType === 'has_one') {
                        // Ensure table exists, this is required for TestOnly SapphireTest classes
                        if (!isset($classToTableName[$class])) {
                            continue;
                        }

                        // Example: class MyPage ... private static $has_one = [ 'MyFile' => File::class ]
                        $componentIDField = "{$component}ID";

                        // Only get database fields from the current class model, not parent class model
                        $dbFields = $dataObjectSchema->databaseFields($class, false);
                        if (!isset($dbFields[$componentIDField])) {
                            continue;
                        }
                        $tableName = $dataObjectSchema->tableName($class);

                        // Example SQL: SELECT "ID" FROM "MyPage" WHERE "MyFileID" = 123;
                        $results = SQLSelect::create(
                            '"ID"',
                            sprintf('"%s"', $tableName),
                            sprintf('"%s" = %s', $componentIDField, $record->ID)
                        )->execute();
                    }
                    if ($relationType === 'many_many' || $relationType === 'belongs_many_many') {
                        $results = $this->fetchManyManyResults(
                            $record,
                            $class,
                            $component,
                            false,
                            $dataObjectSchema,
                            $classToTableName
                        );
                    }
                    $this->updateClassIDs($classIDs, $results, $class);
                }
            }
        }

        // Loop has_one relationships on the DataObject we're getting usage for
        // e.g. File.has_one = Page, Page.has_many = File
        $class = get_class($record);
        foreach (Config::forClass($class)->get('has_one') as $component => $componentClass) {
            $componentClass = $this->updateComponentClass($componentClass, $config, $throughClasses);
            if (in_array($componentClass, $excludedClasses)) {
                continue;
            }
            $componentIDField = "{$component}ID";
            // Find the table that contains $componentIDField - this is relevant for subclassed DataObjects
            $tableName = '';
            $candidateClass = $class;
            // Using a for loop rather than a while loop just to be safe
            for ($i = 0; $i < 25 && $candidateClass; $i++) {
                $dbFields = $dataObjectSchema->databaseFields($candidateClass, false);
                if (array_key_exists($componentIDField, $dbFields)) {
                    $tableName = $dataObjectSchema->tableName($candidateClass);
                    break;
                }
                $candidateClass = get_parent_class($class);
            }
            if ($tableName === '') {
                continue;
            }
            // Example SQL: SELECT "MyPageID" FROM "MyFile" WHERE "ID" = 789 "MyPageID" > 0;
            $results = SQLSelect::create(
                sprintf('"%s"', $componentIDField),
                sprintf('"%s"', $tableName),
                sprintf('"ID" = %s AND "%s" > 0', $record->ID, $componentIDField)
            )->execute();
            $this->updateClassIDs($classIDs, $results, $componentClass);
        }

        // Loop many_many relationships on the DataObject we're getting usage for
        // This is for the scenario where there is a missing corresponding
        // belongs_many_many on the opposite object
        foreach (Config::forClass($class)->get('many_many') as $component => $componentClass) {
            $componentClass = $this->updateComponentClass($componentClass, $config, $throughClasses);
            // Prevent double counting
            $belongsManyManyClasses = array_values(Config::forClass($componentClass)->get('belongs_many_many'));
            if (in_array($class, $belongsManyManyClasses) || in_array($componentClass, $excludedClasses)) {
                continue;
            }
            $results = $this->fetchManyManyResults(
                $record,
                $class,
                $component,
                true,
                $dataObjectSchema,
                $classToTableName
            );
            $this->updateClassIDs($classIDs, $results, $componentClass);
        }

        // Remove "through" classes used in many-many relationships
        foreach (array_keys($classIDs) as $class) {
            if (isset($throughClasses[$class])) {
                unset($classIDs[$class]);
            }
        }

        // Fetch all objects of a class in a single query for better performance
        $classObjs = [];
        foreach ($classIDs as $class => $ids) {
            $classObjs[$class] = [];
            foreach ($class::get()->filter('ID', $ids) as $obj) {
                $classObjs[$class][$obj->ID] = $obj;
            }
        }

        // Returned ArrayList can have multiple entries for the same DataObject
        // For example, the File is used multiple times on a single Page.
        $usage = new ArrayList();
        foreach ($classIDs as $class => $ids) {
            foreach ($ids as $id) {
                // Ensure the $classObj exists, this is to cover an edge case where there is an orphaned
                // many-many join table database record with no corresponding DataObject database record
                if (!isset($classObjs[$class][$id])) {
                    continue;
                }
                $usage->push($classObjs[$class][$id]);
            }
        }

        // Legacy extension hook kept for backwards compatibility
        // Use 'updateUsageExcludedClasses' extension hook instead which prevents database from being queried
        //
        // Example: public function updateUsage(ArrayList &$usage, DataObject &$record)
        //     $dataObjects = $usage->exclude('ClassName', MyDataObject::class);
        $this->extend('updateUsage', $usage, $record);

        $usageData = [];
        foreach ($usage as $dataObject) {
            $tableRowData = [
                'id' => $dataObject->ID,
                'title' => $dataObject->getTitle() ?: _t(__CLASS__ . '.UNTITLED', 'Untitled'),
                'type' => ucwords($dataObject->i18n_singular_name()),
                'link' => $dataObject->hasMethod('CMSEditLink') ? $dataObject->CMSEditLink() : null,
                'ancestors' => []
            ];
            // Show linked ancestor DataObjects in the same row on the used on table
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
        $response = new HTTPResponse(json_encode(['usage' => $usageData]));
        return $response->addHeader('Content-Type', 'application/json');
    }

    /**
     * Convert a many_many_through $componentClass array to the 'to' component on the 'through' object
     * If $componentClass represents a through object, then also update the $throughClasses array
     *
     * @param string|array $componentClass
     * @param array $config
     * @param array $throughClasses
     * @return string
     */
    private function updateComponentClass($componentClass, array $config, array &$throughClasses): string
    {
        if (!is_array($componentClass)) {
            return $componentClass;
        }
        $throughClass = $componentClass['through'];
        $throughClasses[$throughClass] = true;
        $lowercaseThroughClass = strtolower($throughClass);
        $toComponent = $componentClass['to'];
        return $config[$lowercaseThroughClass]['has_one'][$toComponent];
    }

    /**
     * Query the database to retrieve many-many results
     *
     * @param DataObject $record - The DataObject whose usage data is being retrieved, usually a File
     * @param string $class - example: My\App\SomePageType
     * @param string $component - example: 'SomeFiles' - My\App\SomePageType::SomeFiles()
     * @param bool $reverseRead - false: SomePage::SomeFiles(), true: SomeFile::SomePages()
     * @param DataObjectSchema $dataObjectSchema
     * @param array $classToTableName
     * @param array $allPhysicalTables
     * @return Query|null
     */
    private function fetchManyManyResults(
        DataObject $record,
        string $class,
        string $component,
        bool $reverseRead,
        DataObjectSchema $dataObjectSchema,
        array $classToTableName
    ): ?Query {
        // Example php file: class MyPage ... private static $many_many = [ 'MyFile' => File::class ]
        $data = $dataObjectSchema->manyManyComponent($class, $component);
        if (!$data || !($data['join'] ?? false)) {
            return null;
        }
        $joinTableName = $data['join'];

        // Special logic for some many_many_through relationships
        // $joinTableName, instead of the name of the join table, it will be a namespaced classname
        // Example $class: SilverStripe\Assets\Shortcodes\FileLinkTracking
        // Example $joinTableName: SilverStripe\Assets\Shortcodes\FileLink
        if (!ClassInfo::hasTable($joinTableName) && class_exists($joinTableName)) {
            $class = $joinTableName;
            if (!isset($classToTableName[$class])) {
                return null;
            }
            $joinTableName = $classToTableName[$class];
        }
        if (!ClassInfo::hasTable($joinTableName)) {
            return null;
        }

        $parentField = rtrim($data['parentField'], 'ID') . 'ID';
        $childField = rtrim($data['childField'], 'ID') . 'ID';
        $selectField = $reverseRead ? $childField : $parentField;
        $selectFields = [$selectField];
        $dbFields = $dataObjectSchema->databaseFields($class);
        if ($parentField === 'ParentID' && isset($dbFields['ParentClass'])) {
            $selectFields[] = 'ParentClass';
        }
        $whereField = $reverseRead ? $parentField : $childField;

        // Example SQL: SELECT MyPageID FROM MyPage_SomeFiles WHERE SomeFileID = 456;
        return SQLSelect::create(
            sprintf('"' . implode('", "', $selectFields) . '"'),
            sprintf('"%s"', $joinTableName),
            sprintf('"%s" = %s', $whereField, $record->ID)
        )->execute();
    }

    /**
     * Update the $classIDs array with the relationship IDs from database $results
     *
     * @param array $classIDs
     * @param Query|null $results
     * @param string $class
     */
    private function updateClassIDs(array &$classIDs, ?Query $results, string $class): void
    {
        if (is_null($results) || !is_subclass_of($class, DataObject::class)) {
            return;
        }
        foreach ($results as $row) {
            if (count(array_keys($row)) == 2 && isset($row['ParentClass']) && isset($row['ParentID'])) {
                // Example $class: SilverStripe\Assets\Shortcodes\FileLinkTracking
                // Example $parentClass: Page
                $parentClass = $row['ParentClass'];
                $classIDs[$parentClass] = $classIDs[$parentClass] ?? [];
                $classIDs[$parentClass][] = $row['ParentID'];
            } else {
                foreach (array_values($row) as $classID) {
                    $classIDs[$class] = $classIDs[$class] ?? [];
                    $classIDs[$class][] = $classID;
                }
            }
        }
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
