<?php

namespace SilverStripe\Admin\Tests\ModelAdminTest;

use SilverStripe\Dev\TestOnly;
use SilverStripe\ORM\DataObject;

class Contact extends DataObject implements TestOnly
{
    private static $table_name = 'ModelAdminTest_Contact';
    private static $db = [
        'Name' => 'Varchar',
        'Phone' => 'Varchar',
    ];
    private static $summary_fields = [
        'Name' => 'Name',
        'Phone' => 'Phone'
    ];
}
