<?php

namespace SilverStripe\Admin;

use DNADesign\Elemental\Models\BaseElement;
use DNADesign\Elemental\Models\ElementalArea;
use SilverStripe\Admin\LeftAndMain;
use SilverStripe\Assets\File;
use SilverStripe\CMS\Model\SiteTree;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Core\ClassInfo;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Forms\GridField\GridFieldConfig_RecordViewer;
use SilverStripe\Forms\GridField\GridFieldDataColumns;
use SilverStripe\Forms\GridField\GridFieldRestoreAction;
use SilverStripe\Forms\Tab;
use SilverStripe\Forms\TabSet;
use SilverStripe\ORM\DataObject;
use SilverStripe\Security\Member;
use SilverStripe\Versioned\Versioned;
use SilverStripe\Versioned\VersionedGridFieldState\VersionedGridFieldState;

class ArchiveAdmin extends LeftAndMain
{
    private static $url_segment = 'archive';

    private static $url_rule = '/$Action/$ID/$OtherID';

    private static $menu_title = 'Archives';

    private static $menu_icon_class = 'font-icon-box';

    private static $allowed_actions = [
        'EditForm',
        'pages',
        'blocks',
        'files',
        'others'
    ];

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
        $pageList = $this->createArchiveGridField('Pages', SiteTree::class);
        $pageColumns = $pageList->getConfig()->getComponentByType(GridFieldDataColumns::class);
        $pageColumns->setDisplayFields([
                'Title' => SiteTree::singleton()->fieldLabel('Title'),
                'i18n_singular_name' => SiteTree::singleton()->fieldLabel('Type'),
                'LastEdited.Ago' => 'Date Archived',
                'Breadcrumbs' => 'Origin',
                'AuthorID' => 'Archived By'
            ]);
        $pageColumns->setFieldFormatting([
            'AuthorID' => function ($val, $item) {
                /** @var Page $item */
                return Member::get_by_id($val)->Name;
            },
        ]);

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

        $fields = FieldList::create(
            TabSet::create(
                'Root',
                Tab::create(
                    'Pages',
                    SiteTree::singleton()->i18n_plural_name(),
                    $pageList
                ),
                Tab::create(
                    'Blocks',
                    ucfirst(BaseElement::singleton()->i18n_plural_name()),
                    $blockList
                ),
                Tab::create(
                    'Files',
                    File::singleton()->i18n_plural_name(),
                    $fileList
                ),
                Tab::create(
                    'Others',
                    _t(__CLASS__ . '.Others', 'Others'),
                    DropdownField::create('OtherDropdown', 'Select a content type', $this->getOtherVersionedObjects())
                )
            )->setTemplate('SilverStripe\\Forms\\CMSTabSet')
        );

        // Build replacement form
        $form = Form::create(
            $this,
            'EditForm',
            $fields,
            FieldList::create()
        )->setHTMLID('Form_EditForm');
        $form->addExtraClass('cms-edit-form fill-height');
        $form->setTemplate($this->getTemplatesWithSuffix('_EditForm'));
        $form->addExtraClass('ss-tabset cms-tabset ' . $this->BaseCSSClasses());
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
        $config = GridFieldConfig_RecordViewer::create();

        $items = Versioned::get_including_deleted($class);

        $items = $items->filterByCallback(function ($item) {
            // Doesn't exist on either stage or live
            return $item->isArchived();
        });

        $field = GridField::create(
            $title,
            false,
            $items->sort('LastEdited DESC'),
            $config
        );
        $field->setModelClass(SiteTree::class);
        $field->getConfig()->removeComponentsByType(VersionedGridFieldState::class);
        $field->getConfig()->addComponent(new GridFieldRestoreAction);

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
}
