<?php

namespace SilverStripe\Admin\Tests\UsedOnTableTest;

// The "Hub" acts similar to how a Page would normally behave
// Though it's been kept as a DataObject to keep things more abstract
// All the other 'UsedOnTableTest_*' classes represent Files (excluding _ExtText_*)
class UsedOnTableTest_Hub extends UsedOnTableTest_Base
{
    private static $table_name = 'TestOnly_UsedOnTableTest_Hub';

    private static $has_one = [
        'HO' => UsedOnTableTest_Base::class
    ];

    private static $has_many = [
        'HM' => UsedOnTableTest_HasMany::class
    ];

    private static $many_many = [
        // has belongs_many_many on the other end
        'MMtoBMM' => UsedOnTableTest_Belongs::class,
        // does not have belong_many_many on the other end
        'MMtoNoBMM' => UsedOnTableTest_Base::class,
        // manyManyThrough
        'MMT' => [
            'through' => UsedOnTableTest_ThroughObject::class,
            'from' => 'HubObj',
            'to' => 'BaseObj',
        ],
    ];

    private static $belongs_many_many = [
        // has many_many on the other end
        'BMMtoMM' => UsedOnTableTest_ManyMany::class,
        'BMMtoMMT' => UsedOnTableTest_ManyManyThrough::class
        // Not testing the following, will throw this Silverstripe error:
        // belongs_many_many relation ... points to ... without matching many_many
        // does not have many_many on the other end
        // 'BMMtoNoMM' => UsedOnTableTest_Base::class
    ];
}
