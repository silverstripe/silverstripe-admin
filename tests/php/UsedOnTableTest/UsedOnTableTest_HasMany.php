<?php

namespace SilverStripe\Admin\Tests\UsedOnTableTest;

class UsedOnTableTest_HasMany extends UsedOnTableTest_Base
{
    private static $table_name = 'TestOnly_UsedOnTableTest_HasMany';

    private static $has_one = [
        'Hub' => UsedOnTableTest_Hub::class
    ];
}
