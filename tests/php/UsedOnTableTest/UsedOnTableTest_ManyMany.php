<?php

namespace SilverStripe\Admin\Tests\UsedOnTableTest;

class UsedOnTableTest_ManyMany extends UsedOnTableTest_Base
{
    private static $table_name = 'TestOnly_UsedOnTableTest_ManyMany';

    private static $many_many = [
        'Hubs' => UsedOnTableTest_Hub::class
    ];
}
