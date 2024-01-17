<?php

namespace SilverStripe\Admin;

use SilverStripe\CMS\Controllers\CMSMain;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\GridField\GridFieldConfig;
use SilverStripe\Forms\GridField\GridFieldImportButton;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Security\Group;
use SilverStripe\Security\GroupCsvBulkLoader;
use SilverStripe\Security\Member;
use SilverStripe\Security\MemberCsvBulkLoader;
use SilverStripe\Security\Permission;
use SilverStripe\Security\PermissionProvider;
use SilverStripe\Security\PermissionRole;
use SilverStripe\View\Requirements;

/**
 * Security section of the CMS
 */
class SecurityAdmin extends ModelAdmin implements PermissionProvider
{
    private static $managed_models = [
        'users' => [
            'title' => 'Users',
            'dataClass' => Member::class
        ],
        'groups' => [
            'title' => 'Groups',
            'dataClass' => Group::class
        ],
        'roles' => [
            'title' => 'Roles',
            'dataClass' => PermissionRole::class
        ],
    ];

    /**
     * We have to add both the model tab reference and the class name as keys for the importers because ModelAdmin
     * currently checks for $importers[$modelClass] in some places and $importers[$this->modelTab] in others.
     * This is a bug that we should fix in CMS 5
     */
    private static $model_importers = [
        'users' => MemberCsvBulkLoader::class,
        Member::class => MemberCsvBulkLoader::class,
        'groups' => GroupCsvBulkLoader::class,
        Group::class => GroupCsvBulkLoader::class,
    ];

    private static $allowed_actions = [
        'ImportForm',
    ];

    private static $url_segment = 'security';

    private static $menu_title = 'Security';

    private static $menu_priority = 0;

    private static $tree_class = Group::class;

    private static $required_permission_codes = 'CMS_ACCESS_SecurityAdmin';

    private static $menu_icon_class = 'font-icon-torsos-all';

    public function getManagedModels()
    {
        $models = parent::getManagedModels();
        // Ensure tab titles can be localised
        foreach ($models as $key => $spec) {
            switch ($spec['dataClass']) {
                case Member::class:
                    $spec['title'] = _t(__CLASS__ . '.Users', 'Users');
                    break;
                case Group::class:
                case PermissionRole::class:
                    $spec['title'] = singleton($spec['dataClass'])->i18n_plural_name();
            }
        }
        return $models;
    }

    /**
     * @return Form|false
     */
    public function ImportForm()
    {
        $form = parent::ImportForm();
        if (!$form) {
            return $form;
        }
        $form->Fields()->removeByName('EmptyBeforeImport');
        $extraInfo = match ($this->modelClass) {
            Member::class => _t(
                __CLASS__ . '.ImportFormHelpMember',
                '<p>Groups can be assigned by the <em>Groups</em> column. Groups are identified by their'
                . ' <em>Code</em> property, multiple groups can be separated by comma. Existing group'
                . ' memberships are not cleared.</p>'
            ),
            Group::class => _t(
                __CLASS__ . '.ImportFormHelpGroup',
                '<ul><li>Existing groups are matched by their unique <em>Code</em> value, and updated'
                . ' with any new values from the imported file</li><li>Group hierarchies can be created'
                . ' by using a <em>ParentCode</em> column.</li><li>Permission codes can be assigned by'
                . ' the <em>PermissionCode</em> column. Existing permission codes are not cleared.</li></ul>'
            ),
            default => ''
        };
        if ($extraInfo) {
            $form->Fields()->insertBefore('_CsvFile', LiteralField::create('ExtraInfo', $extraInfo));
        }
        return $form;
    }

    protected function getGridFieldConfig(): GridFieldConfig
    {
        $config = parent::getGridFieldConfig();
        // Limit import to admin since the import logic can affect assigned permissions
        if (!Permission::check('ADMIN') || $this->modelClass == PermissionRole::class) {
            $config->removeComponentsByType(GridFieldImportButton::class);
            return $config;
        }
        $importButton = $config->getComponentByType(GridFieldImportButton::class);
        if ($importButton) {
            $modalTitle = match ($this->modelClass) {
                Member::class => _t(__CLASS__ . '.IMPORTUSERS', 'Import users'),
                Group::class => _t(__CLASS__ . '.IMPORTGROUPS', 'Import groups'),
                default => null,
            };
            if ($modalTitle !== null) {
                $importButton->setModalTitle($modalTitle);
            }
        }
        return $config;
    }

    public function providePermissions()
    {
        $title = $this->menu_title();
        return [
            "CMS_ACCESS_SecurityAdmin" => [
                'name' => _t(
                    CMSMain::class . '.ACCESS',
                    "Access to '{title}' section",
                    ['title' => $title]
                ),
                'category' => _t(Permission::class . '.CMS_ACCESS_CATEGORY', 'CMS Access'),
                'help' => _t(
                    __CLASS__ . '.ACCESS_HELP',
                    'Allow viewing, adding and editing users, as well as assigning permissions and roles to them.'
                ),
            ],
            'EDIT_PERMISSIONS' => [
                'name' => _t(__CLASS__ . '.EDITPERMISSIONS', 'Manage permissions for groups'),
                'category' => _t(
                    Permission::class . '.PERMISSIONS_CATEGORY',
                    'Roles and access permissions'
                ),
                'help' => _t(
                    __CLASS__ . '.EDITPERMISSIONS_HELP',
                    'Ability to edit Permissions and IP Addresses for a group.'
                    . ' Requires the "Access to \'Security\' section" permission.'
                ),
                'sort' => 0,
            ],
            'APPLY_ROLES' => [
                'name' => _t(__CLASS__ . '.APPLY_ROLES', 'Apply roles to groups'),
                'category' => _t(
                    Permission::class . '.PERMISSIONS_CATEGORY',
                    'Roles and access permissions'
                ),
                'help' => _t(
                    __CLASS__ . '.APPLY_ROLES_HELP',
                    'Ability to edit the roles assigned to a group.'
                    . ' Requires the "Access to \'Users\' section" permission.'
                ),
                'sort' => 0,
            ],
        ];
    }
}
