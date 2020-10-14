<?php

namespace SilverStripe\Admin\Tests\UsedOnTableTest;

class UsedOnTableTest_ManyManyThrough extends UsedOnTableTest_Base
{
    private static $table_name = 'TestOnly_UsedOnTableTest_ManyManyThrough';

    private static $many_many = [
        'Hubs' => [
            'through' => UsedOnTableTest_ThroughObjectMMT::class,
            'from' => 'MMTObj',
            'to' => 'HubObj',
        ],
    ];
}
