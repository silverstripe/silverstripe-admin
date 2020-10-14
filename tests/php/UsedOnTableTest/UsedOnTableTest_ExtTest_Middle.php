<?php

namespace SilverStripe\Admin\Tests\UsedOnTableTest;

use SilverStripe\Dev\TestOnly;
use SilverStripe\ORM\DataObject;

// This class is fairly similar to an ElementalArea, its purpose to
// a) connect InnerObj to OuterObs in UsedOnTableText_ExtTest_Extension
// b) removed from the UsedOnTable results in UsedOnTableText_ExtTest_Extension

class UsedOnTableTest_ExtTest_Middle extends DataObject implements TestOnly
{

    private static $table_name = 'TestOnly_UsedOnTableTest_ExtTest_Middle';

    private static $has_one = [
        // linking test
        'InnerObj' => UsedOnTableTest_ExtTest_Inner::class,
        // exclusion test
        'ThingObj' => UsedOnTableTest_ExtTest_UsedThing::class,
    ];

    private static $has_many = [
        'OuterObjs' => UsedOnTableTest_ExtTest_Outer::class,
    ];
}
