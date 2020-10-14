<?php

namespace SilverStripe\Admin\Tests\UsedOnTableTest;

class UsedOnTableTest_ThroughObject extends UsedOnTableTest_Base
{
    private static $table_name = 'TestOnly_UsedOnTableTest_ThroughObject';

    private static $has_one = [
        'HubObj' => UsedOnTableTest_Hub::class,
        'BaseObj' => UsedOnTableTest_Base::class,
    ];
}
