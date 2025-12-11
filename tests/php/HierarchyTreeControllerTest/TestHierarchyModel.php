<?php

namespace SilverStripe\Admin\Tests\HierarchyTreeControllerTest;

use SilverStripe\Dev\TestOnly;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\Hierarchy\Hierarchy;
use SilverStripe\Security\Permission;

class TestHierarchyModel extends DataObject implements TestOnly
{
    private static string $table_name = 'HierarchyTreeControllerTest_TestHierarchyModel';

    private static array $db = [
        'Title' => 'Varchar(255)',
    ];

    private static array $extensions = [
        Hierarchy::class,
    ];

    private static bool $test_deny_permission = false;

    public function canView($member = null): bool
    {
        if (self::config()->get('test_deny_permission')) {
            return false;
        }
        return Permission::check('CMS_ACCESS', 'any', $member);
    }
}
