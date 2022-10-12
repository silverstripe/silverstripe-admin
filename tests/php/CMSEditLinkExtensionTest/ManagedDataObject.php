<?php

namespace SilverStripe\Admin\Tests\CMSEditLinkExtensionTest;

use SilverStripe\Admin\CMSEditLinkExtension;
use SilverStripe\Dev\TestOnly;
use SilverStripe\ORM\DataObject;

class ManagedDataObject extends DataObject implements TestOnly
{
    private static $table_name = 'CMSEditLinkTest_ManagedDataObject';

    private static $cms_edit_owner = CMSEditModelAdmin::class;

    private static $db = [
        'Name' => 'Varchar(255)',
    ];

    private static $has_many = [
        'ArbitraryRelation' => NestedObject::class,
        'Nested' => NestedObject::class . '.Parent',
        'AnotherArbitraryRelation' => NestedObject::class . '.AnotherOfTheSameClass',
        'BasicNested' => BasicNestedObject::class,
        'Polymorphic' => PolymorphicNestedObject::class,
    ];

    public function getCMSFields()
    {
        $fields = parent::getCMSFields();
        $fields->removeByName(['ArbitraryRelation', 'AnotherArbitraryRelation']);
        return $fields;
    }

    private static $extensions = [
        CMSEditLinkExtension::class,
    ];
}
