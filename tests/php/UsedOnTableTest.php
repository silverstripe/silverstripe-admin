<?php

namespace SilverStripe\Admin\Tests;

use SilverStripe\Admin\Forms\UsedOnTable;
use SilverStripe\Admin\Tests\UsedOnTableTest\ExtTest_Extension;
use SilverStripe\Admin\Tests\UsedOnTableTest\ExtTest_Inner;
use SilverStripe\Admin\Tests\UsedOnTableTest\ExtTest_Middle;
use SilverStripe\Admin\Tests\UsedOnTableTest\ExtTest_Outer;
use SilverStripe\Admin\Tests\UsedOnTableTest\ExtTest_UsedThing;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\ORM\DataObject;

class UsedOnTableTest extends SapphireTest
{

    protected $usesDatabase = true;

    // This static is required to get Config to populate
    protected static $extra_data_objects = [
        ExtTest_Inner::class,
        ExtTest_Middle::class,
        ExtTest_Outer::class,
        ExtTest_UsedThing::class,
    ];

    // This is static is required to get the database tables to get created
    protected static $extra_dataobjects = [
        ExtTest_Inner::class,
        ExtTest_Middle::class,
        ExtTest_Outer::class,
        ExtTest_UsedThing::class,
    ];

    public function testExtensionLinkingAndExclusion()
    {
        UsedOnTable::add_extension(ExtTest_Extension::class);

        // This Thing is a basically a File
        $thingObj = new ExtTest_UsedThing();
        $thingObj->write();

        // This Inner is basically a Page
        $innerObjTitle = 'My inner';
        $innerObj = new ExtTest_Inner();
        $innerObj->Title = $innerObjTitle;
        $innerObj->write();

        // This Middle is basically an ElementalArea
        $middleObj = new ExtTest_Middle();
        $middleObj->write();
        $innerObj->MiddleObjs()->add($middleObj);

        // Add a Thing to Middle to test the Exclusion part of the Extension
        $middleObj->ThingObj = $thingObj;
        $middleObj->write();

        // This Outer is basically an Elemental FileBlock
        $outerObjTitle = 'My outer';
        $outerObj = new ExtTest_Outer();
        $outerObj->Title = $outerObjTitle;
        $outerObj->ThingObj = $thingObj;
        $outerObj->write();
        $middleObj->OuterObjs()->add($outerObj);

        $usage = $this->getUsage($thingObj);
        $this->assertSame(1, count($usage ?? []));
        $this->assertSame($outerObjTitle, $usage[0]['title']);
        $this->assertSame($innerObjTitle, $usage[0]['ancestors'][0]['title']);
    }

    private function getUsage(DataObject $record)
    {
        // Using DataObject for $record, not just File, because the function is actually agnostic
        // as the admin module doesn't require the assets module
        $usedOnTable = UsedOnTable::create("Used On");
        $usedOnTable->setRecord($record);
        $request = new HTTPRequest('GET', '/');
        $response = $usedOnTable->usage($request);
        $json = json_decode($response->getBody() ?? '', true);
        return $json['usage'];
    }
}
