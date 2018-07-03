<?php

namespace SilverStripe\Admin;

use DNADesign\Elemental\Models\BaseElement;
use DNADesign\Elemental\Models\ElementalArea;
use SilverStripe\Admin\LeftAndMain;
use SilverStripe\Assets\AssetControlExtension;
use SilverStripe\Assets\File;
use SilverStripe\CMS\Model\SiteTree;
use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
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
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\Tab;
use SilverStripe\Forms\TabSet;
use SilverStripe\ORM\DataObject;
use SilverStripe\Security\Member;
use SilverStripe\Versioned\Versioned;
use SilverStripe\Versioned\VersionedGridFieldState\VersionedGridFieldState;

class ArchiveAdmin extends ModelAdmin
{
    private static $url_segment = 'archive';

    private static $url_rule = '/$ModelClass/$Action';

    private static $menu_title = 'Archives';

    private static $menu_icon_class = 'font-icon-box';

    private static $allowed_actions = [
        'EditForm',
        'pages',
        'blocks',
        'files',
        'others'
    ];

    private static $url_handlers = array(
        '$ModelClass/$Action' => 'handleAction'
    );

    protected $modelClass;

    /**
     * Shortcut action for setting the correct active tab.
     *
     * @param HTTPRequest $request
     * @return HTTPResponse
     */
    public function pages($request)
    {
        return $this->index($request);
    }

    /**
     * Shortcut action for setting the correct active tab.
     *
     * @param HTTPRequest $request
     * @return HTTPResponse
     */
    public function blocks($request)
    {
        return $this->index($request);
    }

    /**
     * Shortcut action for setting the correct active tab.
     *
     * @param HTTPRequest $request
     * @return HTTPResponse
     */
    public function files($request)
    {
        return $this->index($request);
    }

    /**
     * Shortcut action for setting the correct active tab.
     *
     * @param HTTPRequest $request
     * @return HTTPResponse
     */
    public function others($request)
    {
        return $this->index($request);
    }

    public function getEditForm($id = null, $fields = null)
    {
        // Construct gridfield showing archived Pages
        $pageList = $this->createArchiveGridField('Pages', SiteTree::class);
        $pageColumns = $pageList->getConfig()->getComponentByType(GridFieldDataColumns::class);
        $pageColumns->setDisplayFields([
                'Title' => SiteTree::singleton()->fieldLabel('Title'),
                'i18n_singular_name' => SiteTree::singleton()->fieldLabel('Type'),
                'LastEdited.Ago' => 'Date Archived',
                'ParentID' => 'Origin',
                'AuthorID' => 'Archived By'
            ]);
        $pageColumns->setFieldFormatting([
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

        $fields = FieldList::create(
            TabSet::create(
                'Root',
                Tab::create(
                    'Pages',
                    SiteTree::singleton()->i18n_plural_name(),
                    $pageList
                )
            )->setTemplate('SilverStripe\\Forms\\CMSTabSet')
        );

        if (class_exists(BaseElement::class)) {
            // Construct gridfield showing archived Blocks
            $blockList = $this->createArchiveGridField('Blocks', BaseElement::class);
            $blockColumns = $blockList->getConfig()->getComponentByType(GridFieldDataColumns::class);
            $blockColumns->setDisplayFields([
                'Title' => BaseElement::singleton()->fieldLabel('Title'),
                'Type' => 'Type',
                'LastEdited.Ago' => 'Date Archived',
                'Breadcrumbs' => 'Origin',
                'AuthorID' => 'Archived By'
            ]);
            $blockColumns->setFieldFormatting([
                'Breadcrumbs' => function ($val, $item) {
                    $parent = $item->Page;

                    return $parent ? $parent->Breadcrumbs() : null;
                },
                'AuthorID' => function ($val, $item) {
                    /** @var Page $item */
                    return Member::get_by_id($val)->Name;
                },
            ]);

            $fields->addFieldToTab('Root', Tab::create(
                'Blocks',
                ucfirst(BaseElement::singleton()->i18n_plural_name()),
                $blockList
            ));
        }

        // The files archive is only useful if archived assets are stored
        if (Config::inst()->get(AssetControlExtension::class, 'keep_archived_assets')) {
            // Construct gridfield showing archived Files
            $fileList = $this->createArchiveGridField('Files', File::class);
            $fileColumns = $fileList->getConfig()->getComponentByType(GridFieldDataColumns::class);
            $fileColumns->setDisplayFields([
                'Name' => File::singleton()->fieldLabel('Name'),
                'appCategory' => 'Type',
                'LastEdited.Ago' => 'Date Archived',
                'Parent.Name' => 'Origin',
                'AuthorID' => 'Archived By',
            ]);
            $fileColumns->setFieldFormatting([
                'AuthorID' => function ($val, $item) {
                    /** @var Page $item */
                    return Member::get_by_id($val)->Name;
                },
            ]);

            $fields->addFieldToTab('Root', Tab::create(
                'Files',
                File::singleton()->i18n_plural_name(),
                $fileList
            ));
        }

        $otherVersionedObjects = $this->getOtherVersionedObjects();

        // If there are custom versioned objects then construct a tab to view them
        if (count($otherVersionedObjects)) {
            $displayClass = $this->request->param('ModelClass') ? $this->unsanitiseClassName($this->request->param('ModelClass')): null;

            $modelSelectField = DropdownField::create('OtherDropdown', 'Select a content type', $otherVersionedObjects, $displayClass);
            $modelSelectField->setAttribute('data-others-archive-url', $this->Link());
            $modelSelectField->addExtraClass('other-model-selector');
            $modelSelectField->setEmptyString('Select…');
            $modelSelectField->setHasEmptyDefault(true);

            // We contstruct a tab with a field to select which other model to view
            $fields->addFieldToTab('Root', Tab::create(
                'Others',
                _t(__CLASS__ . '.Others', 'Others'),
                $modelSelectField
            ));

            // If a valid other model name is passed via a request param
            // then show a gridfield with archived records
            if ($displayClass && isset($otherVersionedObjects[$displayClass])) {
                $otherList = $this->createArchiveGridField('Others', $displayClass);
                $otherColumns = $otherList->getConfig()->getComponentByType(GridFieldDataColumns::class);
                $otherColumns->setDisplayFields([
                    'Name' => 'Name',
                    'LastEdited.Ago' => 'Date Archived',
                    'AuthorID' => 'Archived By',
                ]);
                $otherColumns->setFieldFormatting([
                    'AuthorID' => function ($val, $item) {
                        /** @var DataObject $item */
                        return Member::get_by_id($val)->Name;
                    },
                ]);

                $fields->addFieldToTab('Root.Others', $otherList);
            }
        }

        // Build replacement form
        $form = Form::create(
            $this,
            'EditForm',
            $fields,
            FieldList::create()
        )->setHTMLID('Form_EditForm');
        $form->addExtraClass('cms-edit-form fill-height discardchanges');
        $form->setTemplate($this->getTemplatesWithSuffix('_EditForm'));
        $form->addExtraClass('ss-tabset cms-tabset ' . $this->BaseCSSClasses());
        // $editFormAction = Controller::join_links($this->Link($this->sanitiseClassName($)), 'EditForm');
        // $form->setFormAction($editFormAction);
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
     * @return array
     */
    protected function getOtherVersionedObjects()
    {
        $versionedClasses = array_filter(
            ClassInfo::subclassesFor(DataObject::class),
            function ($class) {
                return (
                    DataObject::has_extension($class, Versioned::class) &&
                    !self::isExcludedClass($class)
                );
            }
        );

        $versionedClasses = array_flip($versionedClasses);

        foreach (array_keys($versionedClasses) as $className) {
            $versionedClasses[$className] = $className::singleton()->i18n_plural_name();
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
    protected function isExcludedClass($className)
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

        return array_search(strtolower($className), $excludedClasses) !== false;
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
}
