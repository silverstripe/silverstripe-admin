<?php

namespace SilverStripe\Admin;

use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\Convert;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Dev\BulkLoader;
use SilverStripe\Dev\Deprecation;
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
     *   'MyObjectClass' => array('title' => "Custom title")
     * )
     * </code>
     *
     * Available options:
     * - 'title': Set custom titles for the tabs or dropdown names
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

    private static $allowed_actions = array(
        'ImportForm',
        'SearchForm'
    );

    private static $url_handlers = array(
        '$ModelClass/$Action' => 'handleAction'
    );

    /**
     * @var string The {@link \SilverStripe\ORM\DataObject} sub-class being managed during this object's lifetime.
     */
    protected $modelClass;

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
     * is loaded without any URL, we pick the first DataObject from the list of {@link self::$managed_models}.
     */
    protected function init()
    {
        parent::init();

        $models = $this->getManagedModels();

        if ($this->getRequest()->param('ModelClass')) {
            $this->modelClass = $this->unsanitiseClassName($this->getRequest()->param('ModelClass'));
        } else {
            reset($models);
            $this->modelClass = key($models);
        }

        // security check for valid models
        if (!array_key_exists($this->modelClass, $models)) {
            user_error('ModelAdmin::init(): Invalid Model class', E_USER_ERROR);
        }
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
            $action = $this->sanitiseClassName($this->modelClass);
        }
        return parent::Link($action);
    }

    /**
     * Produces an edit form that includes a default {@link \SilverStripe\Forms\GridField\GridField} for the currently
     * active {@link \SilverStripe\ORM\DataObject}. The GridField will show data from the currently active `modelClass`
     * only (see {@link self::init()}).
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
        $editFormAction = Controller::join_links($this->Link($this->sanitiseClassName($this->modelClass)), 'EditForm');
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
            $this->sanitiseClassName($this->modelClass),
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

        $exportButton = new GridFieldExportButton('buttons-before-left');
        $exportButton->setExportColumns($this->getExportFields());

        $config
            ->addComponent($exportButton)
            ->addComponents(new GridFieldPrintButton('buttons-before-left'));

        // Remove default and add our own filter header with extension points
        // to retain API until deprecation in 5.0
        $config->removeComponentsByType(GridFieldFilterHeader::class);
        $config->addComponent(new GridFieldFilterHeader(
            false,
            function ($context) {
                $this->extend('updateSearchContext', $context);
            },
            function ($form) {
                $this->extend('updateSearchForm', $form);
            }
        ));

        if (!$this->showSearchForm ||
            (is_array($this->showSearchForm) && !in_array($this->modelClass, $this->showSearchForm))
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
        if (singleton($this->modelClass)->hasMethod('getValidatorList')) {
            $detailValidator = singleton($this->modelClass)->getValidatorList();
            /** @var GridFieldDetailForm $detailform */
            $detailform = $config->getComponentByType(GridFieldDetailForm::class);
            $detailform->setValidator($detailValidator);
        }

        if ($this->showImportForm) {
            $config->addComponent(
                GridFieldImportButton::create('buttons-before-left')
                    ->setImportForm($this->ImportForm())
                    ->setModalTitle(_t('SilverStripe\\Admin\\ModelAdmin.IMPORT', 'Import from CSV'))
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
     * @deprecated 4.3.0
     * @return \SilverStripe\ORM\Search\SearchContext
     */
    public function getSearchContext()
    {
        Deprecation::notice('4.3', 'Will be removed in favor of GridFieldFilterHeader in 5.0');

        $gridField = $this->getEditForm()->fields()
            ->fieldByName($this->sanitiseClassName($this->modelClass));

        $filterHeader = $gridField->getConfig()
            ->getComponentByType(GridFieldFilterHeader::class);

        $context = $filterHeader
            ->getSearchContext($gridField);

        return $context;
    }

    /**
     * Gets a list of fields that have been searched
     *
     * @deprecated 4.3.0
     * @return ArrayList
     */
    public function SearchSummary()
    {
        Deprecation::notice('4.3', 'Will be removed in favor of GridFieldFilterHeader in 5.0');

        $context = $this->getSearchContext();

        return $context->getSummary();
    }

    /**
     * Returns the search form
     *
     * @deprecated 4.3.0
     * @return Form|bool
     */
    public function SearchForm()
    {
        Deprecation::notice('4.3', 'Will be removed in favor of GridFieldFilterHeader  in 5.0');

        if (!$this->showSearchForm
            || (is_array($this->showSearchForm) && !in_array($this->modelClass, $this->showSearchForm))
        ) {
            return false;
        }

        $gridField = $this->getEditForm()->fields()
        ->fieldByName($this->sanitiseClassName($this->modelClass));

        $filterHeader = $gridField->getConfig()
            ->getComponentByType(GridFieldFilterHeader::class);

        $form = $filterHeader->getSearchForm($gridField);

        return $form;
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

        foreach ($models as $class => $options) {
            $forms->push(new ArrayData(array(
                'Title' => $options['title'],
                'ClassName' => $class,
                'Link' => $this->Link($this->sanitiseClassName($class)),
                'LinkOrCurrent' => ($class == $this->modelClass) ? 'current' : 'link'
            )));
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
        return str_replace('\\', '-', $class);
    }

    /**
     * Unsanitise a model class' name from a URL param
     *
     * @param string $class
     * @return string
     */
    protected function unsanitiseClassName($class)
    {
        return str_replace('-', '\\', $class);
    }

    /**
     * @return array Map of class name to an array of 'title' (see {@link $managed_models})
     */
    public function getManagedModels()
    {
        $models = $this->config()->get('managed_models');
        if (is_string($models)) {
            $models = array($models);
        }
        if (!count($models)) {
            user_error(
                'ModelAdmin::getManagedModels():
				You need to specify at least one DataObject subclass in private static $managed_models.
				Make sure that this property is defined, and that its visibility is set to "private"',
                E_USER_ERROR
            );
        }

        // Normalize models to have their model class in array key
        foreach ($models as $k => $v) {
            if (is_numeric($k)) {
                $models[$v] = array('title' => singleton($v)->i18n_plural_name());
                unset($models[$k]);
            }
        }

        return $models;
    }

    /**
     * Returns all importers defined in {@link self::$model_importers}.
     * If none are defined, we fall back to {@link self::managed_models}
     * with a default {@link CsvBulkLoader} class. In this case the column names of the first row
     * in the CSV file are assumed to have direct mappings to properties on the object.
     *
     * @return array Map of model class names to importer instances
     */
    public function getModelImporters()
    {
        $importerClasses = $this->config()->get('model_importers');

        // fallback to all defined models if not explicitly defined
        if (is_null($importerClasses)) {
            $models = $this->getManagedModels();
            foreach ($models as $modelName => $options) {
                $importerClasses[$modelName] = 'SilverStripe\\Dev\\CsvBulkLoader';
            }
        }

        $importers = array();
        foreach ($importerClasses as $modelClass => $importerClass) {
            $importers[$modelClass] = new $importerClass($modelClass);
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
            (is_array($this->showImportForm) && !in_array($this->modelClass, $this->showImportForm))
        ) {
            return false;
        }

        $importers = $this->getModelImporters();
        if (!$importers || !isset($importers[$this->modelClass])) {
            return false;
        }

        if (!$modelSNG->canCreate(Security::getCurrentUser())) {
            return false;
        }

        $fields = new FieldList(
            new HiddenField('ClassName', false, $this->modelClass),
            new FileField('_CsvFile', false)
        );

        // get HTML specification for each import (column names etc.)
        $importerClass = $importers[$this->modelClass];
        /** @var BulkLoader $importer */
        $importer = new $importerClass($this->modelClass);
        $spec = $importer->getImportSpec();
        $specFields = new ArrayList();
        foreach ($spec['fields'] as $name => $desc) {
            $specFields->push(new ArrayData(array('Name' => $name, 'Description' => $desc)));
        }
        $specRelations = new ArrayList();
        foreach ($spec['relations'] as $name => $desc) {
            $specRelations->push(new ArrayData(array('Name' => $name, 'Description' => $desc)));
        }
        $specHTML = $this->customise(array(
            'ClassName' => $this->sanitiseClassName($this->modelClass),
            'ModelName' => Convert::raw2att($modelName),
            'Fields' => $specFields,
            'Relations' => $specRelations,
        ))->renderWith($this->getTemplatesWithSuffix('_ImportSpec'));

        $fields->push(new LiteralField("SpecFor{$modelName}", $specHTML));
        $fields->push(
            new CheckboxField(
                'EmptyBeforeImport',
                _t('SilverStripe\\Admin\\ModelAdmin.EMPTYBEFOREIMPORT', 'Replace data'),
                false
            )
        );

        $actions = new FieldList(
            FormAction::create('import', _t('SilverStripe\\Admin\\ModelAdmin.IMPORT', 'Import from CSV'))
                ->addExtraClass('btn btn-outline-secondary font-icon-upload')
        );

        $form = new Form(
            $this,
            "ImportForm",
            $fields,
            $actions
        );
        $form->setFormAction(
            Controller::join_links($this->Link($this->sanitiseClassName($this->modelClass)), 'ImportForm')
        );

        $this->extend('updateImportForm', $form);

        return $form;
    }

    /**
     * Imports the submitted CSV file based on specifications given in
     * {@link self::model_importers}.
     * Redirects back with a success/failure message.
     *
     * @todo Figure out ajax submission of files via jQuery.form plugin
     *
     * @param array $data
     * @param Form $form
     * @param HTTPRequest $request
     * @return bool|HTTPResponse
     */
    public function import($data, $form, $request)
    {
        if (!$this->showImportForm || (is_array($this->showImportForm)
                && !in_array($this->modelClass, $this->showImportForm))
        ) {
            return false;
        }

        $importers = $this->getModelImporters();
        /** @var BulkLoader $loader */
        $loader = $importers[$this->modelClass];

        // File wasn't properly uploaded, show a reminder to the user
        if (empty($_FILES['_CsvFile']['tmp_name']) ||
            file_get_contents($_FILES['_CsvFile']['tmp_name']) == ''
        ) {
            $form->sessionMessage(
                _t('SilverStripe\\Admin\\ModelAdmin.NOCSVFILE', 'Please browse for a CSV file to import'),
                ValidationResult::TYPE_ERROR
            );
            $this->redirectBack();
            return false;
        }

        if (!empty($data['EmptyBeforeImport']) && $data['EmptyBeforeImport']) { //clear database before import
            $loader->deleteExistingRecords = true;
        }
        $results = $loader->load($_FILES['_CsvFile']['tmp_name']);

        $message = '';

        if ($results) {
            if ($results->CreatedCount()) {
                $message .= _t(
                    'SilverStripe\\Admin\\ModelAdmin.IMPORTEDRECORDS',
                    "Imported {count} records.",
                    array('count' => $results->CreatedCount())
                );
            }
            if ($results && $results->UpdatedCount()) {
                $message .= _t(
                    'SilverStripe\\Admin\\ModelAdmin.UPDATEDRECORDS',
                    "Updated {count} records.",
                    array('count' => $results->UpdatedCount())
                );
            }
            if ($results->DeletedCount()) {
                $message .= _t(
                    'SilverStripe\\Admin\\ModelAdmin.DELETEDRECORDS',
                    "Deleted {count} records.",
                    array('count' => $results->DeletedCount())
                );
            }
            if (!$results->CreatedCount() && !$results->UpdatedCount()) {
                $message .= _t('SilverStripe\\Admin\\ModelAdmin.NOIMPORT', "Nothing to import");
            }
        } else {
            $message .= _t('SilverStripe\\Admin\\ModelAdmin.NOIMPORT', "Nothing to import");
        }

        $form->sessionMessage($message, 'good');
        return $this->redirectBack();
    }

    /**
     * @param bool $unlinked
     * @return ArrayList
     */
    public function Breadcrumbs($unlinked = false)
    {
        $items = parent::Breadcrumbs($unlinked);

        // Show the class name rather than ModelAdmin title as root node
        $models = $this->getManagedModels();
        $params = $this->getRequest()->getVars();
        if (isset($params['url'])) {
            unset($params['url']);
        }

        $items[0]->Title = $models[$this->modelClass]['title'];
        $items[0]->Link = Controller::join_links(
            $this->Link($this->sanitiseClassName($this->modelClass)),
            '?' . http_build_query($params)
        );

        return $items;
    }
}
