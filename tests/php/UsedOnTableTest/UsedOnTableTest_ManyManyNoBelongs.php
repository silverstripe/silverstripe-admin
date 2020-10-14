<?php

namespace SilverStripe\Admin\Tests\UsedOnTableTest;

// No belong_many_many on UsedOnTableTest_Hub
class UsedOnTableTest_ManyManyNoBelongs extends UsedOnTableTest_Base
{
    private static $table_name = 'TestOnly_UsedOnTableTest_ManyManyNoBelongs';

    private static $many_many = [
        'Hubs' => UsedOnTableTest_Hub::class
    ];
}
