<?php

namespace SilverStripe\Admin\Tests\UsedOnTableTest;

class UsedOnTableTest_ThroughObjectMMT extends UsedOnTableTest_Base
{
    private static $table_name = 'TestOnly_UsedOnTableTest_ThroughObjectMMT';

    private static $has_one = [
        'HubObj' => UsedOnTableTest_Hub::class,
        'MMTObj' => UsedOnTableTest_ManyManyThrough::class,
    ];
}
