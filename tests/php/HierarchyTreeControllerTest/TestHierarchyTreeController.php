<?php

namespace SilverStripe\Admin\Tests\HierarchyTreeControllerTest;

use SilverStripe\Admin\HierarchyTreeController;
use SilverStripe\Security\Permission;

class TestHierarchyTreeController extends HierarchyTreeController
{
    private static string $url_segment = 'test-hierarchy';

    private static string $model_class = TestHierarchyModel::class;

    public function canOrganiseTree(): bool
    {
        return (bool) Permission::check('ADMIN');
    }

    public function canCreateTopLevel(): bool
    {
        return (bool) Permission::check('ADMIN');
    }
}
