<?php

namespace SilverStripe\Admin\Tests\UsedOnTableTest;

class UsedOnTableTest_ManyManyThroughNoBelongs extends UsedOnTableTest_Base
{
    private static $table_name = 'TestOnly_UsedOnTableTest_ManyManyThroughNoBelongs';

    private static $many_many = [
        'Hubs' => [
            'through' => UsedOnTableTest_ThroughObjectMMTNB::class,
            // note: you cannot swap from/to around, Silverstripe MMT expects 'from' to be
            // the type of class that defines the many_many_through relationship
            // i.e. this class
            'from' => 'MMTNBObj',
            'to' => 'HubObj',
        ],
    ];
}
