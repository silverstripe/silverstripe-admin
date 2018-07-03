<?php

namespace SilverStripe\Admin;

use DNADesign\Elemental\Models\BaseElement;
use DNADesign\Elemental\Models\ElementalArea;
use SilverStripe\Admin\AdminRootController;
use SilverStripe\Admin\ModelAdmin;
use SilverStripe\Assets\AssetControlExtension;
use SilverStripe\Assets\File;
use SilverStripe\CMS\Model\SiteTree;
use SilverStripe\Control\Controller;
use SilverStripe\Core\ClassInfo;
use SilverStripe\Core\Config\Config;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Forms\GridField\GridField_ActionMenu;
use SilverStripe\Forms\GridField\GridFieldConfig_Base;
use SilverStripe\Forms\GridField\GridFieldDataColumns;
use SilverStripe\Forms\GridField\GridFieldDetailForm;
use SilverStripe\Forms\GridField\GridFieldRestoreAction;
use SilverStripe\Forms\GridField\GridFieldViewButton;
use SilverStripe\ORM\ArrayList;
use SilverStripe\ORM\DataObject;
use SilverStripe\Security\Member;
use SilverStripe\Versioned\Versioned;
use SilverStripe\Versioned\VersionedGridFieldState\VersionedGridFieldState;
use SilverStripe\View\ArrayData;

class ArchiveAdmin extends ModelAdmin
{
    private static $url_segment = 'archive';

    private static $menu_title = 'Archives';

    private static $menu_icon_class = 'font-icon-box';

    public $showSearchForm = false;

    public $showOthers = false;

    public function getEditForm($id = null, $fields = null)
    {
        $fields = new FieldList();
        $otherVersionedObjects = $this->getOtherVersionedObjects();

        $modelClass = $this->request->getVar('others') ? 'others' : $this->modelClass;

        switch ($modelClass) {
            case SiteTree::class:
                // Construct gridfield showing archived Pages
                $listField = $this->createArchiveGridField('Pages', SiteTree::class);
                $listColumns = $listField->getConfig()->getComponentByType(GridFieldDataColumns::class);
                $listColumns->setDisplayFields([
                    'Title' => SiteTree::singleton()->fieldLabel('Title'),
                    'i18n_singular_name' => _t(__CLASS__ . '.COLUMN_TYPE', 'Type'),
                    'LastEdited.Ago' => _t(__CLASS__ . '.COLUMN_DATEARCHIVED', 'Date Archived'),
                    'ParentID' => _t(__CLASS__ . '.COLUMN_ORIGIN', 'Origin'),
                    'AuthorID' => _t(__CLASS__ . '.COLUMN_ARCHIVEDBY', 'Archived By')
                ]);
                $listColumns->setFieldFormatting([
                    'ParentID' => function ($val, $item) {
                        if (SiteTree::get_by_id($val)) {
                            $breadcrumbs = SiteTree::get_by_id($val)->getBreadcrumbItems(2);
                            $breadcrumbString = '../';
                            foreach ($breadcrumbs as $item) {
                                $breadcrumbString = $breadcrumbString . $item->Title . '/';
                            };
                            return $breadcrumbString;
                        }
                    },
                    'AuthorID' => function ($val, $item) {
                        return Member::get_by_id($val)->Name;
                    },
                ]);

                $fields->push($listField);
                break;

            case BaseElement::class:
                // Construct gridfield showing archived Blocks
                $listField = $this->createArchiveGridField('Blocks', BaseElement::class);
                $listColumns = $listField->getConfig()->getComponentByType(GridFieldDataColumns::class);
                $listColumns->setDisplayFields([
                    'Title' => BaseElement::singleton()->fieldLabel('Title'),
                    'Type' => _t(__CLASS__ . '.COLUMN_TYPE', 'Type'),
                    'LastEdited.Ago' => _t(__CLASS__ . '.COLUMN_DATEARCHIVED', 'Date Archived'),
                    'Breadcrumbs' => _t(__CLASS__ . '.COLUMN_ORIGIN', 'Origin'),
                    'AuthorID' => _t(__CLASS__ . '.COLUMN_ARCHIVEDBY', 'Archived By')
                ]);
                $listColumns->setFieldFormatting([
                    'Breadcrumbs' => function ($val, $item) {
                        $parent = $item->Page;

                        return $parent ? $parent->Breadcrumbs() : null;
                    },
                    'AuthorID' => function ($val, $item) {
                        /** @var Page $item */
                        return Member::get_by_id($val)->Name;
                    },
                ]);

                $fields->push($listField);
                break;

            case File::class:
                // Construct gridfield showing archived Files
                $listField = $this->createArchiveGridField('Files', File::class);

                $listColumns = $listField->getConfig()->getComponentByType(GridFieldDataColumns::class);
                $listColumns->setDisplayFields([
                    'Name' => File::singleton()->fieldLabel('Name'),
                    'appCategory' => _t(__CLASS__ . '.COLUMN_TYPE', 'Type'),
                    'LastEdited.Ago' => _t(__CLASS__ . '.COLUMN_DATEARCHIVED', 'Date Archived'),
                    'Parent.Name' => _t(__CLASS__ . '.COLUMN_ORIGIN', 'Origin'),
                    'AuthorID' => _t(__CLASS__ . '.COLUMN_ARCHIVEDBY', 'Archived By'),
                ]);
                $listColumns->setFieldFormatting([
                    'AuthorID' => function ($val, $item) {
                        /** @var Page $item */
                        return Member::get_by_id($val)->Name;
                    },
                ]);

                $fields->push($listField);
                break;

            case 'others':
                $modelSelectField = $this->getOtherModelSelector($modelClass);
                $fields->push($modelSelectField);
                break;

            default:
                $modelSelectField = $this->getOtherModelSelector($modelClass);
                $fields->push($modelSelectField);

                // If a valid other model name is passed via a request param
                // then show a gridfield with archived records
                if (array_search($modelClass, $otherVersionedObjects)) {
                    $listField = $this->createArchiveGridField('Others', $modelClass);

                    $listColumns = $listField->getConfig()->getComponentByType(GridFieldDataColumns::class);
                    $listColumns->setDisplayFields([
                        'Name' => _t(__CLASS__ . '.COLUMN_NAME', 'Name'),
                        'LastEdited.Ago' => _t(__CLASS__ . '.COLUMN_DATEARCHIVED', 'Date Archived'),
                        'AuthorID' => _t(__CLASS__ . '.COLUMN_ARCHIVEDBY', 'Archived By'),
                    ]);
                    $listColumns->setFieldFormatting([
                        'AuthorID' => function ($val, $item) {
                            /** @var DataObject $item */
                            return Member::get_by_id($val)->Name;
                        },
                    ]);

                    $fields->push($listField);
                }
                break;
        }

        $form = Form::create(
            $this,
            'EditForm',
            $fields,
            FieldList::create()
        )->setHTMLID('Form_EditForm');
        $form->addExtraClass('cms-edit-form cms-panel-padded center flexbox-area-grow discardchanges');
        $form->setTemplate($this->getTemplatesWithSuffix('_EditForm'));
        $form->addExtraClass('ss-tabset cms-tabset ' . $this->BaseCSSClasses());
        $editFormAction = Controller::join_links($this->Link($this->sanitiseClassName($this->modelClass)), 'EditForm');
        $form->setFormAction($editFormAction);
        $form->setAttribute('data-pjax-fragment', 'CurrentForm');

        $this->extend('updateEditForm', $form);

        return $form;
    }

    /**
     * Create a gridfield which displays archived objects
     *
     * @return GridField
     */
    protected function createArchiveGridField($title, $class)
    {
        $config = GridFieldConfig_Base::create();

        $items = Versioned::get_including_deleted($class);

        $items = $items->filterByCallback(function ($item) {
            // Doesn't exist on either stage or live
            return $item->isArchived();
        });

        $detailForm = new GridFieldDetailForm;

        $field = GridField::create(
            $title,
            false,
            $items->sort('LastEdited DESC'),
            $config
        );
        $field->setModelClass($class);
        $field->getConfig()->removeComponentsByType(VersionedGridFieldState::class);
        $field->getConfig()->addComponent($detailForm);
        $field->getConfig()->addComponent(new GridFieldViewButton);
        $field->getConfig()->addComponent(new GridFieldRestoreAction);
        // $field->getConfig()->addComponent(new GridField_ActionMenu);

        return $field;
    }

    /**
     * Finds versioned objects that are not pages, blocks or files
     *
     * @param boolean $forDisplay
     * @return array
     */
    protected function getOtherVersionedObjects($forDisplay = false)
    {
        $versionedClasses = array_filter(
            ClassInfo::subclassesFor(DataObject::class),
            function ($class) {
                return (
                    DataObject::has_extension($class, Versioned::class) &&
                    self::isOthersClass($class)
                );
            }
        );

        if ($forDisplay) {
            $versionedClasses = array_flip($versionedClasses);

            foreach (array_keys($versionedClasses) as $className) {
                $versionedClasses[$className] = $className::singleton()->i18n_plural_name();
            }
        }

        return $versionedClasses;
    }

    /**
     * Returns true if the given class should be excluded from the 'others' tab
     * as it would be displayed on one of the other tabs
     *
     * @param string $className
     * @return bool
     */
    protected function isOthersClass($className)
    {
        $existingTabs = [
            SiteTree::class,
            BaseElement::class,
            ElementalArea::class,
            File::class
        ];

        $excludedClasses = [];

        foreach ($existingTabs as $excludedClass) {
            $excludedClasses = array_merge($excludedClasses, array_keys(ClassInfo::subclassesFor($excludedClass)));
        }

        return array_search(strtolower($className), $excludedClasses) === false;
    }

    /**
     * Creates a dropdown field that displays other archived models
     *
     * @return DropdownField
     */
    public function getOtherModelSelector($modelClass = '')
    {
        $otherVersionedObjects = $this->getOtherVersionedObjects(true);

        $modelSelectField = DropdownField::create(
            'OtherDropdown',
            _t(__CLASS__ . '.SELECT_TYPE', 'Select a content type'),
            $otherVersionedObjects,
            $modelClass
        );
        $modelSelectField->setAttribute('data-others-archive-url', AdminRootController::admin_url() . $this->config()->get('url_segment') . '/');
        $modelSelectField->addExtraClass('other-model-selector');
        $modelSelectField->setEmptyString(_t(__CLASS__ . '.SELECT_EMPTY', 'Select…'));
        $modelSelectField->setHasEmptyDefault(true);

        return $modelSelectField;
    }

    /**
     * Archive admin needs some extra logic for whether an archive tab should be shown
     *
     * @return array Map of class name to an array of 'title' (see {@link $managed_models})
     */
    public function getManagedModels()
    {
        // The 'Pages' should always be present and we allow 'Others' as a special
        $archivableModels = [
            SiteTree::class
        ];

        // Add the blocks archive if the Elemental module is installed
        if (class_exists(BaseElement::class)) {
            array_push($archivableModels, BaseElement::class);
        }
        // The files archive is only useful if archived assets are stored
        if (Config::inst()->get(AssetControlExtension::class, 'keep_archived_assets')) {
            array_push($archivableModels, File::class);
        }

        // Normalize models to have their model class in array key (and make sure the name is uppercase)
        foreach ($archivableModels as $k => $v) {
            $archivableModels[$v] = array('title' => ucfirst(singleton($v)->i18n_plural_name()), 'showAsTab' => true);
            unset($archivableModels[$k]);
        }

        $otherModels = $this->getOtherVersionedObjects();
        if ($otherModels) {
            foreach ($otherModels as $k => $v) {
                $archivableModels[$v] = array('title' => ucfirst(singleton($v)->i18n_plural_name()), 'showAsTab' => false);
                unset($archivableModels[$k]);
            }
        }

        return $archivableModels;
    }

    /**
     * Add the special 'Others' tab
     *
     * @return \SilverStripe\ORM\ArrayList An ArrayList of all managed models to build the tabs for this ModelAdmin
     */
    protected function getManagedModelTabs()
    {
        $isOtherActive = ($this->isOthersClass($this->modelClass) || $this->request->getVar('others') !== null);

        $models = $this->getManagedModels();
        $models = array_filter($models, function ($item) {
            return $item['showAsTab'] === true;
        });

        $forms = new ArrayList();

        foreach ($models as $class => $options) {
            $forms->push(new ArrayData(array(
                'Title' => $options['title'],
                'ClassName' => $class,
                'Link' => $this->Link($this->sanitiseClassName($class)),
                'LinkOrCurrent' => ($class == $this->modelClass) ? 'current' : 'link'
            )));
        }

        $forms->push(new ArrayData([
            'Title' => _t(__CLASS__ . '.TAB_OTHERS', 'Others'),
            'ClassName' => 'Others',
            'Link' => $this->Link('?others=1'),
            'LinkOrCurrent' => ($isOtherActive ? 'current' : 'link')
        ]));

        $forms->first()->LinkOrCurrent = 'link';

        return $forms;
    }
}
