<?php

namespace SilverStripe\Admin\Tests\Navigator;

use SilverStripe\Admin\Navigator\SilverStripeNavigator;
use SilverStripe\Admin\Navigator\SilverStripeNavigatorItem_Unversioned;
use SilverStripe\Dev\SapphireTest;

class SilverStripeNavigatorTest extends SapphireTest
{
    protected static $extra_dataobjects = [
        UnversionedRecord::class,
    ];

    public function testGetItemsAutoDiscovery(): void
    {
        $record = new UnversionedRecord();
        $record->PreviewLinkTestProperty = 'some-value';
        $record->write();
        $navigator = new SilverStripeNavigator($record);
        $classes = array_map('get_class', $navigator->getItems()->toArray());

        $this->assertContains(
            SilverStripeNavigatorTest_TestItem::class,
            $classes,
            'Autodiscovers new classes'
        );
    }

    public function testGetItemsUnversioned(): void
    {
        $record = new UnversionedRecord();
        $record->previewLinkTestProperty = 'some-value';
        $record->write();
        $navigator = new SilverStripeNavigator($record);
        $classes = array_map('get_class', $navigator->getItems()->toArray());

        // Has the unversioned link
        $this->assertContains(SilverStripeNavigatorItem_Unversioned::class, $classes);
    }

    public function testCanViewUnversioned(): void
    {
        $record = new UnversionedRecord();
        $record->write();
        $unversionedLinkItem = new SilverStripeNavigatorItem_Unversioned($record);

        // Cannot view unversioned link when there's no preview link
        $this->assertFalse($unversionedLinkItem->canView());

        $record->previewLinkTestProperty = 'some-value';

        // Can view unversioned link
        $this->assertTrue($unversionedLinkItem->canView());
    }
}
