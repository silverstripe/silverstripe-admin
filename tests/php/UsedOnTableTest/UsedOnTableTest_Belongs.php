<?php

namespace SilverStripe\Admin\Tests\UsedOnTableTest;

class UsedOnTableTest_Belongs extends UsedOnTableTest_Base
{
    private static $table_name = 'TestOnly_UsedOnTableTest_Belongs';

    private static $belongs_many_many = [
        'Hubs' => UsedOnTableTest_Hub::class
    ];
}
