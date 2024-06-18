<?php

namespace SilverStripe\Admin;

use InvalidArgumentException;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Control\HTTPResponse_Exception;
use SilverStripe\Core\ClassInfo;
use SilverStripe\Core\Convert;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Dev\BulkLoader;
use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\FileField;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Forms\GridField\GridFieldConfig;
use SilverStripe\Forms\GridField\GridFieldConfig_RecordEditor;
use SilverStripe\Forms\GridField\GridFieldDetailForm;
use SilverStripe\Forms\GridField\GridFieldExportButton;
use SilverStripe\Forms\GridField\GridFieldFilterHeader;
use SilverStripe\Forms\GridField\GridFieldImportButton;
use SilverStripe\Forms\GridField\GridFieldPaginator;
use SilverStripe\Forms\GridField\GridFieldPrintButton;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\LiteralField;
use SilverStripe\ORM\ArrayList;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\ValidationResult;
use SilverStripe\Security\Security;
use SilverStripe\View\ArrayData;

/**
 * Generates a three-pane UI for editing model classes, tabular results and edit forms.
 *
 * Relies on data such as {@link DataObject::$db} and {@link DataObject::getCMSFields()}
 * to scaffold interfaces "out of the box", while at the same time providing
 * flexibility to customize the default output.
 */
abstract class ModelAdmin extends LeftAndMain
{
    /**
     * @inheritdoc
     */
    private static $url_rule = '/$ModelClass/$Action';

    /**
     * List of all managed {@link DataObject}s in this interface.
     *
     * Simple notation with class names only:
     * <code>
     * array('MyObjectClass','MyOtherObjectClass')
     * </code>
     *
     * Extended notation with options (e.g. custom titles):
     * <code>
     * array(
     *   'MyObjectClass' => ['title' => "Custom title"]
     *   'urlslug' => ['title' => "Another title", 'dataClass' => MyNamespacedClass::class]
     * )
     * </code>
     *
     * Available options:
     * - 'title': Set custom titles for the tabs or dropdown names
     * - 'dataClass': The class name being managed. Defaults to the key. Useful for making shorter URLs or placing the same class in multiple tabs
     *
     * @config
     * @var array|string
     */
    private static $managed_models = null;

    /**
     * Override menu_priority so that ModelAdmin CMSMenu objects
     * are grouped together directly above the Help menu item.
     * @var float
     */
    private static $menu_priority = -0.5;

    /**
     * @var string
     */
    private static $menu_icon_class = 'font-icon-database';

    private static $allowed_actions = [
        'ImportForm',
        'SearchForm'
    ];

    private static $url_handlers = [
        '$ModelClass/$Action' => 'handleAction'
    ];

    /**
     * @var string The {@link \SilverStripe\ORM\DataObject} sub-class being managed during this object's lifetime.
     */
    protected $modelClass;

        /**
     * @var string The {@link \SilverStripe\ORM\DataObject} the currently active model tab, and key of managed_models.
     */
    protected $modelTab;

    /**
     * Change this variable if you don't want the Import from CSV form to appear.
     * This variable can be a boolean or an array.
     * If array, you can list className you want the form to appear on. i.e. array('myClassOne','myClassTwo')
     */
    public $showImportForm = true;

    /**
     * Change this variable if you don't want the gridfield search to appear.
     * This variable can be a boolean or an array.
     * If array, you can list className you want the form to appear on. i.e. array('myClassOne','myClassTwo')
     */
    public $showSearchForm = true;

    /**
     * List of all {@link DataObject}s which can be imported through
     * a subclass of {@link BulkLoader} (mostly CSV data).
     * By default {@link CsvBulkLoader} is used, assuming a standard mapping
     * of column names to {@link DataObject} properties/relations.
     *
     * e.g. "BlogEntry" => "BlogEntryCsvBulkLoader"
     *
     * @config
     * @var array
     */
    private static $model_importers = null;

    /**
     * @config
     * @var int Amount of results to show per page
     */
    private static $page_length = 30;

    /**
     * Initialize the model admin interface. Sets up embedded jquery libraries and requisite plugins.
     *
     * Sets the `modelClass` field which determines which of the {@link DataObject} objects will have visible data. This
     * is determined by the URL (with the first slug being the name of the DataObject class to represent. If this class
     * is loaded without any URL, we pick the first DataObject from the list of {@link ModelAdmin::$managed_models}.
     */
    protected function init()
    {
        parent::init();

        $models = $this->getManagedModels();
        $this->modelTab = $this->getRequest()->param('ModelClass');

        // if we've hit the "landing" page
        if ($this->modelTab === null) {
            reset($models);
            $this->modelTab = key($models ?? []);
        }

        // security check for valid models
        if (!$this->isManagedModel($this->modelTab)) {
            // if it fails to match the string exactly, try reverse-engineering a classname
            $this->modelTab = $this->unsanitiseClassName($this->modelTab);

            if (!$this->isManagedModel($this->modelTab)) {
                throw new \RuntimeException(sprintf('ModelAdmin::init(): Invalid Model class %s', $this->modelTab));
            }
        }

        $this->modelClass = isset($models[$this->modelTab]['dataClass'])
            ? $models[$this->modelTab]['dataClass']
            : $this->modelTab;
    }

    /**
     * Overrides {@link \SilverStripe\Admin\LeftAndMain} to ensure the active model class (the DataObject we are
     * currently viewing) is included in the URL.
     *
     * @inheritdoc
     */
    public function Link($action = null)
    {
        if (!$action) {
            $action = $this->sanitiseClassName($this->modelTab);
        }
        return parent::Link($action);
    }

    /**
     * Get the link for the tab of a DataObject subclass managed by this ModelAdmin.
     *
     * Note that if the modelClass is managed on multiple tabs and you want a link for a
     * specific tab you should use {@link getLinkForModelTab} instead.
     *
     * @throws InvalidArgumentException if $modelClass is not managed by this ModelAdmin.
     */
    public function getLinkForModelClass(string $modelClass): string
    {
        if (!$this->isManagedModel($modelClass)) {
            throw new InvalidArgumentException("$modelClass isn't managed by this ModelAdmin.");
        }
        return $this->getLinkForModelTab($this->getModelTabForModelClass($modelClass));
    }

    /**
     * Get the link for a specific tab on this ModelAdmin.
     *
     * If you do not have multiple tabs for a given class you should use {@link getLinkForModelClass}
     * instead.
     *
     * @param string $modelTab This is either the custom url segment for the tab or, if that
     * was not not defined, it is the fully qualified class name of the managed model.
     * In the latter case, you should prefer to use {@link getLinkForModelClass}.
     *
     * @throws InvalidArgumentException if $modelTab is not a tab on this ModelAdmin.
     */
    public function getLinkForModelTab(string $modelTab): string
    {
        // Don't use isManagedModel here because a subclass of a managed model may not have its own tab.
        if (!array_key_exists($modelTab, $this->getManagedModels())) {
            throw new InvalidArgumentException("$modelTab isn't a tab on this ModelAdmin.");
        }
        return $this->Link($this->sanitiseClassName($modelTab));
    }

    /**
     * Get the link for editing an object inside this ModelAdmin.
     *
     * @throws InvalidArgumentException if $obj is not managed by this ModelAdmin.
     */
    public function getCMSEditLinkForManagedDataObject(DataObject $obj): string
    {
        $modelTab = $this->getModelTabForModelClass($obj->ClassName);
        if ($modelTab === null) {
            throw new InvalidArgumentException("$obj->ClassName isn't managed by this ModelAdmin");
        }
        $link = static::join_links(
            $this->getLinkForModelClass($obj->ClassName),
            'EditForm/field/',
            $this->sanitiseClassName($modelTab),
            'item',
            $obj->ID
        );
        $this->extend('updateEditLinkForDataObject', $link, $obj);
        return $link;
    }

    /**
     * Produces an edit form that includes a default {@link \SilverStripe\Forms\GridField\GridField} for the currently
     * active {@link \SilverStripe\ORM\DataObject}. The GridField will show data from the currently active `modelClass`
     * only (see {@link ModelAdmin::init()}).
     *
     * @param int|null $id
     * @param \SilverStripe\Forms\FieldList $fields
     * @return \SilverStripe\Forms\Form A Form object with one tab per {@link \SilverStripe\Forms\GridField\GridField}
     */
    public function getEditForm($id = null, $fields = null)
    {
        $form = Form::create(
            $this,
            'EditForm',
            new FieldList($this->getGridField()),
            new FieldList()
        )->setHTMLID('Form_EditForm');
        $form->addExtraClass('cms-edit-form cms-panel-padded center flexbox-area-grow');
        $form->setTemplate($this->getTemplatesWithSuffix('_EditForm'));
        $editFormAction = Controller::join_links($this->getLinkForModelTab($this->modelTab), 'EditForm');
        $form->setFormAction($editFormAction);
        $form->setAttribute('data-pjax-fragment', 'CurrentForm');

        $this->extend('updateEditForm', $form);

        return $form;
    }

    /**
     * Generate the GridField field that will be used for this ModelAdmin.
     *
     * Developers may override this method in their ModelAdmin class to customise their GridField. Extensions can use
     * the `updateGridField` hook for the same purpose.
     *
     * @see {@link getGridFieldConfig()}
     * @return GridField
     */
    protected function getGridField(): GridField
    {
        $field = GridField::create(
            $this->sanitiseClassName($this->modelTab),
            false,
            $this->getList(),
            $this->getGridFieldConfig()
        );

        $this->extend('updateGridField', $field);

        return $field;
    }

    /**
     * Generate the GridField Configuration that will use for the ModelAdmin Gridfield.
     *
     * Developers may override this method in their ModelAdmin class to customise their GridFieldConfiguration.
     * Extensions can use the `updateGridFieldConfig` hook for the same purpose.
     *
     * @return GridFieldConfig
     */
    protected function getGridFieldConfig(): GridFieldConfig
    {
        $config = GridFieldConfig_RecordEditor::create($this->config()->get('page_length'));

        $exportButton = Injector::inst()->createWithArgs(GridFieldExportButton::class, ['buttons-before-left']);
        $exportButton->setExportColumns($this->getExportFields());

        $config
            ->addComponent($exportButton)
            ->addComponents(Injector::inst()->createWithArgs(GridFieldPrintButton::class, ['buttons-before-left']));

        // Remove default and add our own filter header with extension points
        // to retain API until deprecation in 5.0
        $config->removeComponentsByType(GridFieldFilterHeader::class);
        $config->addComponent(Injector::inst()->createWithArgs(GridFieldFilterHeader::class, [
            false,
            function ($context) {
                $this->extend('updateSearchContext', $context);
            },
            function ($form) {
                $this->extend('updateSearchForm', $form);
            }
        ]));

        if (!$this->showSearchForm ||
            (is_array($this->showSearchForm) && !in_array($this->modelClass, $this->showSearchForm ?? []))
        ) {
            $config->removeComponentsByType(GridFieldFilterHeader::class);
        }

        // GridFieldPaginator has to be added after filter header for it to function correctly
        $paginator = $config->getComponentByType(GridFieldPaginator::class);
        if ($paginator) {
            $config
                ->removeComponent($paginator)
                ->addComponent($paginator);
        }

        // Validation
        if (singleton($this->modelClass)->hasMethod('getCMSCompositeValidator')) {
            $detailValidator = singleton($this->modelClass)->getCMSCompositeValidator();
            $detailform = $config->getComponentByType(GridFieldDetailForm::class);
            $detailform->setValidator($detailValidator);
        }

        if ($this->showImportForm) {
            $config->addComponent(
                GridFieldImportButton::create('buttons-before-left')
                    ->setImportForm($this->ImportForm())
                    ->setModalTitle(_t(__CLASS__ . '.IMPORT', 'Import from CSV'))
            );
        }

        $this->extend('updateGridFieldConfig', $config);

        return $config;
    }

    /**
     * Define which fields are used in the {@link getEditForm} GridField export.
     * By default, it uses the summary fields from the model definition.
     *
     * @return array
     */
    public function getExportFields()
    {
        return singleton($this->modelClass)->summaryFields();
    }

    /**
     * You can override how ModelAdmin returns DataObjects by either overloading this method, or defining an extension
     * to ModelAdmin that implements the `updateList` method (and takes a {@link \SilverStripe\ORM\DataList} as the
     * first argument).
     *
     * For example, you might want to do this if this particular ModelAdmin should only ever show objects where an
     * Archived flag is set to false. That would be best done as an extension, for example:
     *
     * <code>
     * public function updateList(\SilverStripe\ORM\DataList $list)
     * {
     *     return $list->filter('Archived', false);
     * }
     * </code>
     *
     * Note: If you override this method you may also need to override getCMSEditLinkForManagedDataObject()
     *
     * @return \SilverStripe\ORM\DataList
     */
    public function getList()
    {
        $list = DataObject::singleton($this->modelClass)->get();

        $this->extend('updateList', $list);

        return $list;
    }

    /**
     * The model managed by this instance.
     * See $managed_models for potential values.
     *
     * @return string
     */
    public function getModelClass()
    {
        return $this->modelClass;
    }

    /**
     * @return \SilverStripe\ORM\ArrayList An ArrayList of all managed models to build the tabs for this ModelAdmin
     */
    protected function getManagedModelTabs()
    {
        $models = $this->getManagedModels();
        $forms = new ArrayList();

        foreach ($models as $tab => $options) {
            $forms->push(new ArrayData([
                'Title' => $options['title'],
                'Tab' => $tab,
                // `getManagedModels` did not always return a `dataClass` attribute
                // Legacy behaviour is for `ClassName` to map to `$tab`
                'ClassName' => isset($options['dataClass']) ? $options['dataClass'] : $tab,
                'Link' => $this->getLinkForModelTab($tab),
                'LinkOrCurrent' => ($tab == $this->modelTab) ? 'current' : 'link'
            ]));
        }

        return $forms;
    }

    /**
     * Sanitise a model class' name for inclusion in a link
     *
     * @param string $class
     * @return string
     */
    protected function sanitiseClassName($class)
    {
        return str_replace('\\', '-', $class ?? '');
    }

    /**
     * Unsanitise a model class' name from a URL param
     *
     * @param string $class
     * @return string
     */
    protected function unsanitiseClassName($class)
    {
        return str_replace('-', '\\', $class ?? '');
    }

    /**
     * @return array Map of class name to an array of 'title' (see {@link $managed_models})
     */
    public function getManagedModels()
    {
        $models = $this->config()->get('managed_models');
        if (is_string($models)) {
            $models = [$models];
        }
        if (!count($models ?? [])) {
            throw new \RuntimeException(
                'ModelAdmin::getManagedModels():
				You need to specify at least one DataObject subclass in private static $managed_models.
				Make sure that this property is defined, and that its visibility is set to "private"'
            );
        }

        // Normalize models to have their model class in array key
        foreach ($models as $k => $v) {
            // No custom tab url segment
            if (is_numeric($k)) {
                $models[$v] = ['dataClass' => $v, 'title' => singleton($v)->i18n_plural_name()];
                unset($models[$k]);
            // Custom title but no custom tab url segment
            } elseif (is_array($v) && !isset($v['dataClass'])) {
                $models[$k]['dataClass'] = $k;
            // Custom tab url segment but no custom title
            } elseif (is_a($v, DataObject::class, true)) {
                $models[$k] = ['dataClass' => $v, 'title' => singleton($v)->i18n_plural_name()];
            }
        }

        return $models;
    }

    /**
     * Get the model tab name for a given model class
     *
     * If there are multiple tabs for a given model class, the first one defined will
     * be returned.
     * If you want a specific tab to be returned for a given model class you should
     * override this method.
     *
     * @throws InvalidArgumentException if $modelClass isn't a DataObject subclass
     */
    protected function getModelTabForModelClass(string $modelClass): ?string
    {
        if (!is_subclass_of($modelClass, DataObject::class)) {
            throw new InvalidArgumentException('$modelClass must be a subclass of DataObject.');
        }
        $managed = $this->getManagedModels();
        // Check the superclasses as well as the specifically passed-in class
        $classes = array_reverse(ClassInfo::ancestry($modelClass));
        foreach ($classes as $class) {
            foreach ($managed as $tab => $spec) {
                if (!isset($spec['dataClass'])) {
                    $spec['dataClass'] = $tab;
                }
                if ($spec['dataClass'] === $class) {
                    return $tab;
                }
            }
        }
        return null;
    }

    /**
     * Check whether a model is managed by this ModelAdmin class
     */
    public function isManagedModel(string $modelClassOrModelTab): bool
    {
        if (is_subclass_of($modelClassOrModelTab, DataObject::class)) {
            return $this->getModelTabForModelClass($modelClassOrModelTab) !== null;
        }
        return array_key_exists($modelClassOrModelTab, $this->getManagedModels());
    }

    /**
     * Returns all importers defined in {@link ModelAdmin::$model_importers}.
     * If none are defined, we fall back to {@link ModelAdmin::managed_models}
     * with a default {@link CsvBulkLoader} class. In this case the column names of the first row
     * in the CSV file are assumed to have direct mappings to properties on the object.
     *
     * @return array Map of model class names to importer instances
     */
    public function getModelImporters()
    {
        $importerClasses = $this->config()->get('model_importers');
        $models = $this->getManagedModels();

        // fallback to all defined models if not explicitly defined
        if (is_null($importerClasses)) {
            foreach ($models as $modelName => $options) {
                $importerClasses[$modelName] = 'SilverStripe\\Dev\\CsvBulkLoader';
            }
        }

        $importers = [];
        foreach ($importerClasses as $modelClass => $importerClass) {
            $tab = $modelClass;
            if (isset($models[$modelClass]['dataClass'])) {
                $modelClass = $models[$modelClass]['dataClass'];
            }
            $importer = new $importerClass($modelClass);
            if (ClassInfo::hasMethod($importer, 'setCheckPermissions')) {
                $importer->setCheckPermissions(true);
            }
            $importers[$tab] = $importer;
        }

        return $importers;
    }

    /**
     * Generate a CSV import form for a single {@link DataObject} subclass.
     *
     * @return Form|false
     */
    public function ImportForm()
    {
        $modelSNG = singleton($this->modelClass);
        $modelName = $modelSNG->i18n_singular_name();
        // check if a import form should be generated
        if (!$this->showImportForm ||
            (is_array($this->showImportForm) && !in_array($this->modelTab, $this->showImportForm ?? []))
        ) {
            return false;
        }

        $importers = $this->getModelImporters();
        if (!$importers || !isset($importers[$this->modelTab])) {
            return false;
        }

        $fields = new FieldList(
            new HiddenField('ClassName', false, $this->modelClass),
            new FileField('_CsvFile', false)
        );

        // get HTML specification for each import (column names etc.)
        /** @var BulkLoader $importer */
        $importer = $importers[$this->modelTab];
        $spec = $importer->getImportSpec();
        $specFields = new ArrayList();
        foreach ($spec['fields'] as $name => $desc) {
            $specFields->push(new ArrayData(['Name' => $name, 'Description' => $desc]));
        }
        $specRelations = new ArrayList();
        foreach ($spec['relations'] as $name => $desc) {
            $specRelations->push(new ArrayData(['Name' => $name, 'Description' => $desc]));
        }
        $specHTML = $this->customise([
            'ClassName' => $this->sanitiseClassName($this->modelClass),
            'ModelName' => Convert::raw2att($modelName),
            'Fields' => $specFields,
            'Relations' => $specRelations,
        ])->renderWith($this->getTemplatesWithSuffix('_ImportSpec'));

        $fields->push(new LiteralField("SpecFor{$modelName}", $specHTML));
        $fields->push(
            new CheckboxField(
                'EmptyBeforeImport',
                _t(__CLASS__ . '.EMPTYBEFOREIMPORT', 'Replace data'),
                false
            )
        );

        $actions = new FieldList(
            FormAction::create('import', _t(__CLASS__ . '.IMPORT', 'Import from CSV'))
                ->addExtraClass('btn btn-outline-secondary font-icon-upload')
        );

        $form = new Form(
            $this,
            "ImportForm",
            $fields,
            $actions
        );
        $form->setFormAction(
            Controller::join_links($this->getLinkForModelTab($this->modelTab), 'ImportForm')
        );

        $this->extend('updateImportForm', $form);

        return $form;
    }

    /**
     * Imports the submitted CSV file based on specifications given in
     * {@link ModelAdmin::model_importers}.
     * Redirects back with a success/failure message.
     */
    public function import(array $data, Form $form): HTTPResponse
    {
        if (!$this->showImportForm || (is_array($this->showImportForm)
                && !in_array($this->modelClass, $this->showImportForm ?? []))
        ) {
            return $this->redirectBack();
        }

        $importers = $this->getModelImporters();
        /** @var BulkLoader $loader */
        $loader = $importers[$this->modelTab];

        // File wasn't properly uploaded, show a reminder to the user
        if (empty($_FILES['_CsvFile']['tmp_name']) ||
            file_get_contents($_FILES['_CsvFile']['tmp_name'] ?? '') == ''
        ) {
            $form->sessionMessage(
                _t(__CLASS__ . '.NOCSVFILE', 'Please browse for a CSV file to import'),
                ValidationResult::TYPE_ERROR
            );
            return $this->redirectBack();
        }

        if (!empty($data['EmptyBeforeImport']) && $data['EmptyBeforeImport']) { //clear database before import
            $loader->deleteExistingRecords = true;
        }
        try {
            $results = $loader->load($_FILES['_CsvFile']['tmp_name']);
        } catch (HTTPResponse_Exception $e) {
            $form->sessionMessage($e->getMessage(), ValidationResult::TYPE_ERROR);
            return $this->redirectBack();
        }

        $message = '';

        if ($results) {
            if ($results->CreatedCount()) {
                $message .= _t(
                    __CLASS__ . '.IMPORTEDRECORDS',
                    "Imported {count} records.",
                    ['count' => $results->CreatedCount()]
                );
            }
            if ($results && $results->UpdatedCount()) {
                $message .= _t(
                    __CLASS__ . '.UPDATEDRECORDS',
                    "Updated {count} records.",
                    ['count' => $results->UpdatedCount()]
                );
            }
            if ($results->DeletedCount()) {
                $message .= _t(
                    __CLASS__ . '.DELETEDRECORDS',
                    "Deleted {count} records.",
                    ['count' => $results->DeletedCount()]
                );
            }
            if (!$results->CreatedCount() && !$results->UpdatedCount()) {
                $message .= _t(__CLASS__ . '.NOIMPORT', "Nothing to import");
            }
        } else {
            $message .= _t(__CLASS__ . '.NOIMPORT', "Nothing to import");
        }

        $form->sessionMessage($message, 'good');
        return $this->redirectBack();
    }

    public function Breadcrumbs($unlinked = false)
    {
        $items = parent::Breadcrumbs($unlinked);

        // Show the class name rather than ModelAdmin title as root node
        $models = $this->getManagedModels();
        $params = $this->getRequest()->getVars();
        if (isset($params['url'])) {
            unset($params['url']);
        }

        $items[0]->Title = $models[$this->modelTab]['title'];
        $items[0]->Link = Controller::join_links(
            $this->getLinkForModelTab($this->modelTab),
            '?' . http_build_query($params ?? [])
        );

        return $items;
    }
}
