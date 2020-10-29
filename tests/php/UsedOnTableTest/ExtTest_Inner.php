<?php

namespace SilverStripe\Admin\Tests\UsedOnTableTest;

use SilverStripe\Dev\TestOnly;
use SilverStripe\ORM\DataObject;

// This functions as a page in the Extension test
class ExtTest_Inner extends DataObject implements TestOnly
{
    private static $table_name = 'TestOnly_UsedOnTableTest_ExtTest_Inner';

    private static $db = [
        'Title' => 'Varchar'
    ];

    private static $has_many = [
        'MiddleObjs' => ExtTest_Middle::class
    ];
}
