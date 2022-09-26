<?php

namespace SilverStripe\Admin\Tests\ModelAdminTest;

use SilverStripe\Dev\TestOnly;

class ContactSubclass extends Contact implements TestOnly
{
    private static $table_name = 'ModelAdminTest_ContactSubclass';
    private static $db = [
        'Address' => 'Text',
    ];
}
