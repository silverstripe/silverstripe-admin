<?php

namespace SilverStripe\Admin;

use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\Convert;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Forms\GridField\GridFieldConfig_RecordEditor;
use SilverStripe\Forms\GridField\GridFieldDataColumns;
use SilverStripe\Forms\GridField\GridFieldDetailForm;
use SilverStripe\Forms\GridField\GridFieldExportButton;
use SilverStripe\Forms\GridField\GridFieldImportButton;
use SilverStripe\Forms\GridField\GridFieldPageCount;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\Tab;
use SilverStripe\Forms\TabSet;
use SilverStripe\Security\Group;
use SilverStripe\Security\Member;
use SilverStripe\Security\Permission;
use SilverStripe\Security\PermissionProvider;
use SilverStripe\Security\PermissionRole;
use SilverStripe\View\ArrayData;
use SilverStripe\View\Requirements;

/**
 * Security section of the CMS
 */
class SecurityAdmin extends LeftAndMain implements PermissionProvider
{

    private static $url_segment = 'security';

    private static $url_rule = '/$Action/$ID/$OtherID';

    private static $menu_title = 'Security';

    private static $tree_class = Group::class;

    private static $subitem_class = Member::class;

    private static $required_permission_codes = 'CMS_ACCESS_SecurityAdmin';

    private static $menu_icon_class = 'font-icon-torsos-all';

    private static $allowed_actions = array(
        'EditForm',
        'MemberImportForm',
        'memberimport',
        'GroupImportForm',
        'groupimport',
        'groups',
        'users',
        'roles'
    );

    /**
     * Shortcut action for setting the correct active tab.
     *
     * @param HTTPRequest $request
     * @return HTTPResponse
     */
    public function users($request)
    {
        return $this->index($request);
    }

    /**
     * Shortcut action for setting the correct active tab.
     *
     * @param HTTPRequest $request
     * @return HTTPResponse
     */
    public function groups($request)
    {
        return $this->index($request);
    }

    /**
     * Shortcut action for setting the correct active tab.
     *
     * @param HTTPRequest $request
     * @return HTTPResponse
     */
    public function roles($request)
    {
        return $this->index($request);
    }

    public function getEditForm($id = null, $fields = null)
    {
        // Build gridfield configs
        $memberListConfig = GridFieldConfig_RecordEditor::create()
            ->addComponent(new GridFieldExportButton('buttons-before-left'));
        $groupListConfig = GridFieldConfig_RecordEditor::create()
            ->addComponent(new GridFieldExportButton('buttons-before-left'));

        /** @var GridFieldDetailForm $detailForm */
        $detailForm = $memberListConfig->getComponentByType(GridFieldDetailForm::class);
        $memberValidator = Member::singleton()->getValidator();
        $detailForm->setValidator($memberValidator);

        /** @var GridFieldPageCount $memberPaginator */
        $memberListConfig->removeComponentsByType(GridFieldPageCount::class);
        $memberListConfig->addComponent(new GridFieldPageCount('buttons-before-right'));

        /** @var GridFieldPageCount $groupPaginator */
        $groupListConfig->removeComponentsByType(GridFieldPageCount::class);
        $groupListConfig->addComponent(new GridFieldPageCount('buttons-before-right'));

        // Add import capabilities. Limit to admin since the import logic can affect assigned permissions
        if (Permission::check('ADMIN')) {
            // @todo when grid field is converted to react use the react component
            $memberListConfig->addComponent(
                GridFieldImportButton::create('buttons-before-left')
                    ->setImportIframe($this->Link('memberimport'))
                    ->setModalTitle(_t(__CLASS__ . '.IMPORTUSERS', 'Import users'))
            );
            $groupListConfig->addComponent(
                GridFieldImportButton::create('buttons-before-left')
                    ->setImportIframe($this->Link('groupimport'))
                    ->setModalTitle(_t(__CLASS__ . '.IMPORTGROUPS', 'Import groups'))
            );
        }

        // Build gridfield
        $memberList = GridField::create(
            'Members',
            false,
            Member::get(),
            $memberListConfig
        )->addExtraClass("members_grid");

        // Build group fields
        $groupList = GridField::create(
            'Groups',
            false,
            Group::get(),
            $groupListConfig
        );
        /** @var GridFieldDataColumns $columns */
        $columns = $groupList->getConfig()->getComponentByType(GridFieldDataColumns::class);
        $columns->setDisplayFields(array(
            'Breadcrumbs' => Group::singleton()->fieldLabel('Title')
        ));
        $columns->setFieldFormatting(array(
            'Breadcrumbs' => function ($val, $item) {
                /** @var Group $item */
                return Convert::raw2xml($item->getBreadcrumbs(' > '));
            }
        ));

        $fields = FieldList::create(
            TabSet::create(
                'Root',
                Tab::create(
                    'Users',
                    _t(__CLASS__ . '.Users', 'Users'),
                    LiteralField::create(
                        'MembersCautionText',
                        sprintf(
                            '<div class="alert alert-warning" role="alert">%s</div>',
                            _t(
                                __CLASS__ . '.MemberListCaution',
                                'Caution: Removing members from this list will remove them from all groups and the database'
                            )
                        )
                    ),
                    $memberList
                ),
                Tab::create(
                    'Groups',
                    Group::singleton()->i18n_plural_name(),
                    $groupList
                )
            )->setTemplate('SilverStripe\\Forms\\CMSTabSet'),
            // necessary for tree node selection in LeftAndMain.EditForm.js
            new HiddenField('ID', false, 0)
        );

        // Add roles editing interface
        $rolesTab = null;
        if (Permission::check('APPLY_ROLES')) {
            $rolesField = GridField::create(
                'Roles',
                false,
                PermissionRole::get(),
                GridFieldConfig_RecordEditor::create()
            );

            $rolesTab = $fields->findOrMakeTab('Root.Roles', _t(__CLASS__ . '.TABROLES', 'Roles'));
            $rolesTab->push($rolesField);
        }

        // Build replacement form
        $form = Form::create(
            $this,
            'EditForm',
            $fields,
            new FieldList()
        )->setHTMLID('Form_EditForm');
        $form->addExtraClass('cms-edit-form fill-height');
        $form->setTemplate($this->getTemplatesWithSuffix('_EditForm'));
        $form->addExtraClass('ss-tabset cms-tabset ' . $this->BaseCSSClasses());
        $form->setAttribute('data-pjax-fragment', 'CurrentForm');

        $this->extend('updateEditForm', $form);

        return $form;
    }

    public function memberimport()
    {
        Requirements::clear();
        Requirements::javascript('silverstripe/admin: client/dist/js/vendor.js');
        Requirements::javascript('silverstripe/admin: client/dist/js/MemberImportForm.js');
        Requirements::css('silverstripe/admin: client/dist/styles/bundle.css');

        return $this->renderWith('BlankPage', array(
            'Form' => $this->MemberImportForm()->forTemplate(),
            'Content' => ' '
        ));
    }

    /**
     * @see SecurityAdmin_MemberImportForm
     *
     * @return Form
     */
    public function MemberImportForm()
    {
        if (!Permission::check('ADMIN')) {
            return null;
        }

        /** @var Group $group */
        $group = $this->currentPage();
        $form = new MemberImportForm($this, __FUNCTION__);
        $form->setGroup($group);

        return $form;
    }

    public function groupimport()
    {
        Requirements::clear();
        Requirements::javascript('silverstripe/admin: client/dist/js/vendor.js');
        Requirements::javascript('silverstripe/admin: client/dist/js/MemberImportForm.js');
        Requirements::css('silverstripe/admin: client/dist/styles/bundle.css');

        return $this->renderWith('BlankPage', array(
            'Content' => ' ',
            'Form' => $this->GroupImportForm()->forTemplate()
        ));
    }

    /**
     * @see SecurityAdmin_MemberImportForm
     *
     * @skipUpgrade
     * @return Form
     */
    public function GroupImportForm()
    {
        if (!Permission::check('ADMIN')) {
            return null;
        }

        return new GroupImportForm($this, __FUNCTION__);
    }

    /**
     * Disable GridFieldDetailForm backlinks for this view, as its
     */
    public function Backlink()
    {
        return false;
    }

    public function Breadcrumbs($unlinked = false)
    {
        $crumbs = parent::Breadcrumbs($unlinked);

        // Name root breadcrumb based on which record is edited,
        // which can only be determined by looking for the fieldname of the GridField.
        // Note: Titles should be same titles as tabs in RootForm().
        $params = $this->getRequest()->allParams();
        if (isset($params['FieldName'])) {
            // TODO FieldName param gets overwritten by nested GridFields,
            // so shows "Members" rather than "Groups" for the following URL:
            // admin/security/EditForm/field/Groups/item/2/ItemEditForm/field/Members/item/1/edit
            $firstCrumb = $crumbs->shift();
            if ($params['FieldName'] == 'Groups') {
                $crumbs->unshift(new ArrayData(array(
                    'Title' => Group::singleton()->i18n_plural_name(),
                    'Link' => $this->Link('groups')
                )));
            } elseif ($params['FieldName'] == 'Users') {
                $crumbs->unshift(new ArrayData(array(
                    'Title' => _t(__CLASS__ . '.Users', 'Users'),
                    'Link' => $this->Link('users')
                )));
            } elseif ($params['FieldName'] == 'Roles') {
                $crumbs->unshift(new ArrayData(array(
                    'Title' => _t(__CLASS__ . '.TABROLES', 'Roles'),
                    'Link' => $this->Link('roles')
                )));
            }
            $crumbs->unshift($firstCrumb);
        }

        return $crumbs;
    }

    public function providePermissions()
    {
        $title = $this->menu_title();
        return array(
            "CMS_ACCESS_SecurityAdmin" => [
                'name' => _t(
                    'SilverStripe\\CMS\\Controllers\\CMSMain.ACCESS',
                    "Access to '{title}' section",
                    ['title' => $title]
                ),
                'category' => _t('SilverStripe\\Security\\Permission.CMS_ACCESS_CATEGORY', 'CMS Access'),
                'help' => _t(
                    __CLASS__ . '.ACCESS_HELP',
                    'Allow viewing, adding and editing users, as well as assigning permissions and roles to them.'
                )
            ],
            'EDIT_PERMISSIONS' => array(
                'name' => _t(__CLASS__ . '.EDITPERMISSIONS', 'Manage permissions for groups'),
                'category' => _t(
                    'SilverStripe\\Security\\Permission.PERMISSIONS_CATEGORY',
                    'Roles and access permissions'
                ),
                'help' => _t(
                    __CLASS__ . '.EDITPERMISSIONS_HELP',
                    'Ability to edit Permissions and IP Addresses for a group.'
                    . ' Requires the "Access to \'Security\' section" permission.'
                ),
                'sort' => 0
            ),
            'APPLY_ROLES' => array(
                'name' => _t(__CLASS__ . '.APPLY_ROLES', 'Apply roles to groups'),
                'category' => _t(
                    'SilverStripe\\Security\\Permission.PERMISSIONS_CATEGORY',
                    'Roles and access permissions'
                ),
                'help' => _t(
                    __CLASS__ . '.APPLY_ROLES_HELP',
                    'Ability to edit the roles assigned to a group.'
                    . ' Requires the "Access to \'Users\' section" permission.'
                ),
                'sort' => 0
            )
        );
    }
}
