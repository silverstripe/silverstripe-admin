<?php

namespace SilverStripe\Admin\Tests\ModelAdminTest;

use SilverStripe\Dev\TestOnly;
use SilverStripe\ORM\DataObject;

class Player extends DataObject implements TestOnly
{
    private static $table_name = 'ModelAdminTest_Player';
    private static $db = [
        'Name' => 'Varchar',
        'Position' => 'Varchar',
    ];
    private static $has_one = [
        'Contact' => Contact::class
    ];
}
