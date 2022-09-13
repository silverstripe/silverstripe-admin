<?php

namespace SilverStripe\Admin\Tests\CMSEditLinkExtensionTest;

use SilverStripe\Admin\CMSEditLinkExtension;
use SilverStripe\Dev\TestOnly;
use SilverStripe\ORM\DataObject;

class NestedObject extends DataObject implements TestOnly
{
    private static $table_name = 'CMSEditLinkTest_NestedObject';

    private static $cms_edit_owner = 'Parent';

    private static $db = [
        'Name' => 'Varchar(255)',
    ];

    private static $has_one = [
        'Parent' => ManagedDataObject::class,
        'AnotherOfTheSameClass' => ManagedDataObject::class,
        'ThirdOne' => ManagedDataObject::class,
    ];

    private static $extensions = [
        CMSEditLinkExtension::class,
    ];
}
