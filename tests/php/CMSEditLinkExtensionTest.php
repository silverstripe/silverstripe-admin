<?php

namespace SilverStripe\Admin\Tests;

use LogicException;
use SilverStripe\Admin\Tests\CMSEditLinkExtensionTest\BasicNestedObject;
use SilverStripe\Admin\Tests\CMSEditLinkExtensionTest\ManagedDataObject;
use SilverStripe\Admin\Tests\CMSEditLinkExtensionTest\CMSEditModelAdmin;
use SilverStripe\Admin\Tests\CMSEditLinkExtensionTest\NestedObject;
use SilverStripe\Admin\Tests\CMSEditLinkExtensionTest\PolymorphicNestedObject;
use SilverStripe\Dev\SapphireTest;

class CMSEditLinkExtensionTest extends SapphireTest
{
    protected static $fixture_file = 'CMSEditLinkExtensionTest.yml';

    protected $usesDatabase = true;

    protected static $extra_dataobjects = [
        ManagedDataObject::class,
        BasicNestedObject::class,
        NestedObject::class,
        PolymorphicNestedObject::class,
    ];

    protected static $extra_controllers = [
        CMSEditModelAdmin::class,
    ];

    public function testGetCMSEditOwner()
    {
        $adminSingleton = CMSEditModelAdmin::singleton();
        $root = $this->objFromFixture(ManagedDataObject::class, 'root');
        $basicNested = $this->objFromFixture(BasicNestedObject::class, 'one');
        $nested = $this->objFromFixture(NestedObject::class, 'one');
        $polymorphic = $this->objFromFixture(PolymorphicNestedObject::class, 'one');

        $this->assertSame($adminSingleton, $root->getCMSEditOwner());
        $this->assertSame($root->ID, $basicNested->getCMSEditOwner()->ID);
        $this->assertSame($root->ID, $nested->getCMSEditOwner()->ID);
        $this->assertSame($root->ID, $polymorphic->getCMSEditOwner()->ID);
    }

    public function testGetEditLinkForDataObject()
    {
        $root = $this->objFromFixture(ManagedDataObject::class, 'root');
        $basicNested = $this->objFromFixture(BasicNestedObject::class, 'one');
        $nested = $this->objFromFixture(NestedObject::class, 'one');
        $polymorphic = $this->objFromFixture(PolymorphicNestedObject::class, 'one');

        $rootUrl = "http://localhost/admin/cms-edit-test/belongsHere/EditForm/field/belongsHere/item/$root->ID";
        $this->assertSame(
            "$rootUrl/ItemEditForm/field/BasicNested/item/$basicNested->ID",
            $root->getCMSEditLinkForManagedDataObject($basicNested, 'Parent')
        );
        $this->assertSame(
            "$rootUrl/ItemEditForm/field/Nested/item/$nested->ID",
            $root->getCMSEditLinkForManagedDataObject($nested, 'Parent')
        );
        $this->assertSame(
            "$rootUrl/ItemEditForm/field/Polymorphic/item/$polymorphic->ID",
            $root->getCMSEditLinkForManagedDataObject($polymorphic, 'Parent')
        );
    }

    public function testGetEditLinkForDataObjectException()
    {
        $root = $this->objFromFixture(ManagedDataObject::class, 'root');
        $nested = $this->objFromFixture(NestedObject::class, 'redHerringOne');

        $this->expectException(LogicException::class);
        $this->assertNull($root->getCMSEditLinkForManagedDataObject($nested, 'AnotherOfTheSameClass'));
    }

    public function testCMSEditLink()
    {
        $root = $this->objFromFixture(ManagedDataObject::class, 'root');
        $basicNested = $this->objFromFixture(BasicNestedObject::class, 'one');
        $nested = $this->objFromFixture(NestedObject::class, 'one');
        $polymorphic = $this->objFromFixture(PolymorphicNestedObject::class, 'one');

        $rootUrl = "http://localhost/admin/cms-edit-test/belongsHere/EditForm/field/belongsHere/item/$root->ID";
        $this->assertSame($rootUrl, $root->CMSEditLink());
        $this->assertSame(
            "$rootUrl/ItemEditForm/field/BasicNested/item/$basicNested->ID",
            $basicNested->CMSEditLink()
        );
        $this->assertSame(
            "$rootUrl/ItemEditForm/field/Nested/item/$nested->ID",
            $nested->CMSEditLink()
        );
        $this->assertSame(
            "$rootUrl/ItemEditForm/field/Polymorphic/item/$polymorphic->ID",
            $polymorphic->CMSEditLink()
        );
    }
}
