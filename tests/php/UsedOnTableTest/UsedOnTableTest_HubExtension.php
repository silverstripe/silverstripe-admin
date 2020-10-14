<?php

namespace SilverStripe\Admin\Tests\UsedOnTableTest;

use SilverStripe\Dev\TestOnly;
use SilverStripe\ORM\DataExtension;

class UsedOnTableTest_HubExtension extends DataExtension implements TestOnly
{
    private static $has_one = [
        'ExtHO' => UsedOnTableTest_Base::class
    ];

    private static $many_many = [
        // does not have belong_many_many on the other end
        'ExtMMtoNoBMM' => UsedOnTableTest_Base::class
    ];
}
