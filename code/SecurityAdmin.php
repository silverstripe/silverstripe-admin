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
class SecurityAdmin extends ModelAdmin implements PermissionProvider
{

    private static $managed_models = [
        Member::class,
        Group::class,
        PermissionRole::class
    ];

    private static $url_segment = 'security';

    private static $menu_title = 'Security';

    private static $required_permission_codes = 'CMS_ACCESS_SecurityAdmin';

    private static $menu_icon_class = 'font-icon-torsos-all';

    /**
     * Shortcut action for setting the correct active tab.
     *
     * @param HTTPRequest $request
     * @return HTTPResponse
     * @deprecated 1.5
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
     * @deprecated 1.5
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
     * @deprecated 1.5
     */
    public function roles($request)
    {
        return $this->index($request);
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
