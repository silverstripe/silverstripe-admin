<?php

namespace SilverStripe\Admin\Tests\UsedOnTableTest;

use SilverStripe\Dev\TestOnly;
use SilverStripe\ORM\DataObject;

// This functions as a File in the Extension Test
class UsedOnTableTest_ExtTest_UsedThing extends DataObject implements TestOnly
{
    private static $table_name = 'TestOnly_UsedOnTableTest_ExtTest_UsedThing';
}
