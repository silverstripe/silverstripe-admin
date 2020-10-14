<?php

namespace SilverStripe\Admin\Tests\UsedOnTableTest;

use SilverStripe\Dev\TestOnly;
use SilverStripe\ORM\DataObject;

class UsedOnTableTest_Base extends DataObject implements TestOnly
{
    private static $table_name = 'TestOnly_UsedOnTableTest_Base';

    private static $db = [
        'Title' => 'Varchar'
    ];
}
