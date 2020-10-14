<?php

namespace SilverStripe\Admin\Tests\UsedOnTableTest;

class UsedOnTableTest_ThroughObjectMMTNB extends UsedOnTableTest_Base
{
    private static $table_name = 'TestOnly_UsedOnTableTest_ThroughObjectMMTNB';

    private static $has_one = [
        'HubObj' => UsedOnTableTest_Hub::class,
        'MMTNBObj' => UsedOnTableTest_ManyManyThroughNoBelongs::class,
    ];
}
