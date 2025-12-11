<?php

namespace SilverStripe\Admin\Tests\HierarchyTreeControllerTest;

use SilverStripe\Dev\TestOnly;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\Hierarchy\Hierarchy;

class TestHierarchyModel extends DataObject implements TestOnly
{
    private static string $singular_name = 'Test Hierarchy Model';

    private static string $plural_name = 'Test Hierarchy Models';

    private static array $db = [
        'Title' => 'Varchar(255)',
    ];

    private static string $table_name = 'TestHierarchyModel';

    private static array $extensions = [
        Hierarchy::class,
    ];
}
