<?php

namespace SilverStripe\Admin\Tests\UsedOnTableTest;

use SilverStripe\Dev\TestOnly;
use SilverStripe\ORM\DataObject;

// This class is fairly similar to a Content Block in that it is not directly connected
// to a page instead it is connected to an intermediary object (UsedOnTableTest_ExtTest_Middle)
// The ThingObj is effectively a file, so this is basically a File (Content) Block
class UsedOnTableTest_ExtTest_Outer extends DataObject implements TestOnly
{
    private static $table_name = 'TestOnly_UsedOnTableTest_ExtTest_Outer';

    private static $db = [
        'Title' => 'Varchar'
    ];

    private static $has_one = [
        'MiddleObj' => UsedOnTableTest_ExtTest_Middle::class,
        'ThingObj' => UsedOnTableTest_ExtTest_UsedThing::class,
    ];
}
