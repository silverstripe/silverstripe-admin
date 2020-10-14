<?php

namespace SilverStripe\Admin\Tests;

use SilverStripe\Admin\Forms\UsedOnTable;
use SilverStripe\Admin\Tests\UsedOnTableTest\UsedOnTableTest_Base;
use SilverStripe\Admin\Tests\UsedOnTableTest\UsedOnTableTest_Belongs;
use SilverStripe\Admin\Tests\UsedOnTableTest\UsedOnTableTest_ExtTest_Extension;
use SilverStripe\Admin\Tests\UsedOnTableTest\UsedOnTableTest_ExtTest_Inner;
use SilverStripe\Admin\Tests\UsedOnTableTest\UsedOnTableTest_ExtTest_Middle;
use SilverStripe\Admin\Tests\UsedOnTableTest\UsedOnTableTest_ExtTest_Outer;
use SilverStripe\Admin\Tests\UsedOnTableTest\UsedOnTableTest_ExtTest_UsedThing;
use SilverStripe\Admin\Tests\UsedOnTableTest\UsedOnTableTest_HasMany;
use SilverStripe\Admin\Tests\UsedOnTableTest\UsedOnTableTest_Hub;
use SilverStripe\Admin\Tests\UsedOnTableTest\UsedOnTableTest_HubExtension;
use SilverStripe\Admin\Tests\UsedOnTableTest\UsedOnTableTest_ManyMany;
use SilverStripe\Admin\Tests\UsedOnTableTest\UsedOnTableTest_ManyManyNoBelongs;
use SilverStripe\Admin\Tests\UsedOnTableTest\UsedOnTableTest_ManyManyThrough;
use SilverStripe\Admin\Tests\UsedOnTableTest\UsedOnTableTest_ManyManyThroughNoBelongs;
use SilverStripe\Admin\Tests\UsedOnTableTest\UsedOnTableTest_ThroughObject;
use SilverStripe\Admin\Tests\UsedOnTableTest\UsedOnTableTest_ThroughObjectMMT;
use SilverStripe\Admin\Tests\UsedOnTableTest\UsedOnTableTest_ThroughObjectMMTNB;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Core\Config\Config;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\ORM\DataList;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\DB;
use SilverStripe\ORM\Queries\SQLDelete;

class UsedOnTableTest extends SapphireTest
{

    protected $usesDatabase = true;

    // This static is required to get Config to populate
    protected static $extra_data_objects = [
        UsedOnTableTest_Base::class,
        UsedOnTableTest_Belongs::class,
        UsedOnTableTest_ExtTest_Inner::class,
        UsedOnTableTest_ExtTest_Middle::class,
        UsedOnTableTest_ExtTest_Outer::class,
        UsedOnTableTest_ExtTest_UsedThing::class,
        UsedOnTableTest_HasMany::class,
        UsedOnTableTest_Hub::class,
        UsedOnTableTest_ManyMany::class,
        UsedOnTableTest_ManyManyNoBelongs::class,
        UsedOnTableTest_ManyManyThrough::class,
        UsedOnTableTest_ManyManyThroughNoBelongs::class,
        UsedOnTableTest_ThroughObject::class,
        UsedOnTableTest_ThroughObjectMMT::class,
        UsedOnTableTest_ThroughObjectMMTNB::class,
    ];

    // This is static is required to get the database tables to get created
    protected static $extra_dataobjects = [
        UsedOnTableTest_Base::class,
        UsedOnTableTest_Belongs::class,
        UsedOnTableTest_ExtTest_Inner::class,
        UsedOnTableTest_ExtTest_Middle::class,
        UsedOnTableTest_ExtTest_Outer::class,
        UsedOnTableTest_ExtTest_UsedThing::class,
        UsedOnTableTest_HasMany::class,
        UsedOnTableTest_Hub::class,
        UsedOnTableTest_ManyMany::class,
        UsedOnTableTest_ManyManyNoBelongs::class,
        UsedOnTableTest_ManyManyThrough::class,
        UsedOnTableTest_ManyManyThroughNoBelongs::class,
        UsedOnTableTest_ThroughObject::class,
        UsedOnTableTest_ThroughObjectMMT::class,
        UsedOnTableTest_ThroughObjectMMTNB::class,
    ];

    private function getUsage(DataObject $record)
    {
        // Using DataObject for $record, not just File, because the function is actually agnostic
        // as the admin module doesn't require the assets module
        $usedOnTable = UsedOnTable::create("Used On");
        $usedOnTable->setRecord($record);
        $request = new HTTPRequest('GET', '/');
        $response = $usedOnTable->usage($request);
        $json = json_decode($response->getBody(), true);
        return $json['usage'];
    }

    public function testUsageUnrelated()
    {
        $myFile = new UsedOnTableTest_Base();
        $myFile->write();
        $myPage = new UsedOnTableTest_Hub();
        $myPage->Title = 'Unrelated page';
        $myPage->write();
        $usage = $this->getUsage($myFile);
        $this->assertSame(0, count($usage));
    }

    public function testUsageHasOne()
    {
        $pageTitle = 'My Page that has_one File';
        $myFile = new UsedOnTableTest_Base();
        $myFile->write();
        $myPage = new UsedOnTableTest_Hub();
        $myPage->Title = $pageTitle;
        $myPage->HO = $myFile;
        $myPage->write();
        $usage = $this->getUsage($myFile);
        $this->assertSame(1, count($usage));
        $this->assertSame($pageTitle, $usage[0]['title']);
    }

    public function testUsageHasOneHubExtension()
    {
        // Add DataExtension and reset database so that tables + columns get added
        UsedOnTableTest_Hub::add_extension(UsedOnTableTest_HubExtension::class);
        DataObject::reset();
        self::resetDBSchema(true, true);
        //
        $pageTitle = 'My Page that has_one File using HubExtension';
        $myFile = new UsedOnTableTest_Base();
        $myFile->write();
        $myPage = new UsedOnTableTest_Hub();
        $myPage->Title = $pageTitle;
        $myPage->ExtHO = $myFile;
        $myPage->write();
        $usage = $this->getUsage($myFile);
        $this->assertSame(1, count($usage));
        $this->assertSame($pageTitle, $usage[0]['title']);
    }

    public function testUsageHasMany()
    {
        $pageTitle = 'My Page that has_many File';
        $myPage = new UsedOnTableTest_Hub();
        $myPage->Title = $pageTitle;
        $myPage->write();
        $myFile = new UsedOnTableTest_HasMany();
        $myFile->write();
        $myPage->HM()->add($myFile);
        $usage = $this->getUsage($myFile);
        $this->assertSame(1, count($usage));
        $this->assertSame($pageTitle, $usage[0]['title']);
    }

    public function testUsageManyManyWithBelongs()
    {
        $pageTitle = 'My Page that many_many File with belong_many_many Page';
        $myPage = new UsedOnTableTest_Hub();
        $myPage->Title = $pageTitle;
        $myPage->write();
        $myFile = new UsedOnTableTest_Belongs();
        $myFile->write();
        $myPage->MMtoBMM()->add($myFile);
        $usage = $this->getUsage($myFile);
        $this->assertSame(1, count($usage));
        $this->assertSame($pageTitle, $usage[0]['title']);
    }

    public function testUsageManyManyWithoutBelongs()
    {
        $pageTitle = 'My Page that many_many File without belong_many_many Page';
        $myPage = new UsedOnTableTest_Hub();
        $myPage->Title = $pageTitle;
        $myPage->write();
        $myFile = new UsedOnTableTest_Base();
        $myFile->write();
        $myPage->MMtoNoBMM()->add($myFile);
        $usage = $this->getUsage($myFile);
        $this->assertSame(1, count($usage));
        $this->assertSame($pageTitle, $usage[0]['title']);
    }

    public function testUsageManyManyWithoutBelongsHubExtension()
    {
        // Add DataExtension and reset database so that tables + columns get added
        UsedOnTableTest_Hub::add_extension(UsedOnTableTest_HubExtension::class);
        DataObject::reset();
        self::resetDBSchema(true, true);
        //
        $pageTitle = 'My Page that many_many File without belong_many_many Page using HubExtension';
        $myPage = new UsedOnTableTest_Hub();
        $myPage->Title = $pageTitle;
        $myPage->write();
        $myFile = new UsedOnTableTest_Base();
        $myFile->write();
        $myPage->ExtMMtoNoBMM()->add($myFile);
        $usage = $this->getUsage($myFile);
        $this->assertSame(1, count($usage));
        $this->assertSame($pageTitle, $usage[0]['title']);
    }

    public function testUsageManyManyWithoutBelongsOrphanedJoinTable()
    {
        $pageTitle = 'My Page that many_many File without belong_many_many Page orphaned join table';
        $myPage = new UsedOnTableTest_Hub();
        $myPage->Title = $pageTitle;
        $myPage->write();
        $myFile = new UsedOnTableTest_Base();
        $myFile->write();
        $myPage->MMtoNoBMM()->add($myFile);
        // manually delete Page record from database, leaving join table record intact
        SQLDelete::create('"TestOnly_UsedOnTableTest_Hub"', sprintf('"ID" = %s', $myPage->ID))->execute();
        SQLDelete::create('"TestOnly_UsedOnTableTest_Base"', sprintf('"ID" = %s', $myPage->ID))->execute();
        $usage = $this->getUsage($myFile);
        $this->assertSame(0, count($usage));
    }

    public function testUsageBelongsManyMany()
    {
        $pageTitle = 'My Page that belongs_many_many File with many_many Page';
        $pageTitle2 = 'My other Page that belongs_many_many File with many_many Page';
        $myPage = new UsedOnTableTest_Hub();
        $myPage->Title = $pageTitle;
        $myPage->write();
        $myPage2 = new UsedOnTableTest_Hub();
        $myPage2->Title = $pageTitle2;
        $myPage2->write();
        $myFile = new UsedOnTableTest_ManyMany();
        $myFile->write();
        // add from both pages from different directions
        $myPage->BMMtoMM()->add($myFile);
        $myFile->Hubs()->add($myPage2);
        $usage = $this->getUsage($myFile);
        $this->assertSame(2, count($usage));
        $this->assertSame($pageTitle, $usage[0]['title']);
        $this->assertSame($pageTitle2, $usage[1]['title']);
    }

    public function testUsageManyManyThrough()
    {
        $pageTitle = 'My Page that many_many_through File';
        $myPage = new UsedOnTableTest_Hub();
        $myPage->Title = $pageTitle;
        $myPage->write();
        $myFile = new UsedOnTableTest_Base();
        $myFile->write();
        $myPage->MMT()->add($myFile);
        $usage = $this->getUsage($myFile);
        $this->assertSame(1, count($usage));
        $this->assertSame($pageTitle, $usage[0]['title']);
    }

    public function testUsageFileManyManyWithoutPageBelongs()
    {
        $pageTitle = 'My Page that not belongs_many_many File with many_many Page';
        $myPage = new UsedOnTableTest_Hub();
        $myPage->Title = $pageTitle;
        $myPage->write();
        $myFile = new UsedOnTableTest_ManyManyNoBelongs();
        $myFile->write();
        $myFile->Hubs()->add($myPage);
        $usage = $this->getUsage($myFile);
        $this->assertSame(1, count($usage));
        $this->assertSame($pageTitle, $usage[0]['title']);
    }

    public function testUsageFileManyManyThroughWithPageBelongs()
    {
        $pageTitle = 'My Page that many_many_belongs File with many_many_through Page';
        $pageTitle2 = 'My other Page that many_many_belongs File with many_many_through Page';
        $myPage = new UsedOnTableTest_Hub();
        $myPage->Title = $pageTitle;
        $myPage->write();
        $myPage2 = new UsedOnTableTest_Hub();
        $myPage2->Title = $pageTitle2;
        $myPage2->write();
        $myFile = new UsedOnTableTest_ManyManyThrough();
        $myFile->write();
        // add from both pages from different directions
        $myPage->BMMtoMMT()->add($myFile);
        $myFile->Hubs()->add($myPage2);
        $usage = $this->getUsage($myFile);
        $this->assertSame(2, count($usage));
        $this->assertSame($pageTitle, $usage[0]['title']);
        $this->assertSame($pageTitle2, $usage[1]['title']);
    }

    public function testUsageFileManyManyThroughWithoutPageBelongs()
    {
        $pageTitle = 'My Page that does not many_many_belongs File that many_many_through Page';
        $myPage = new UsedOnTableTest_Hub();
        $myPage->Title = $pageTitle;
        $myPage->write();
        $myFile = new UsedOnTableTest_ManyManyThroughNoBelongs();
        $myFile->write();
        $myFile->Hubs()->add($myPage);
        $usage = $this->getUsage($myFile);
        $this->assertSame(1, count($usage));
        $this->assertSame($pageTitle, $usage[0]['title']);
    }

    public function testExtensionLinkingAndExclusion()
    {
        UsedOnTable::add_extension(UsedOnTableTest_ExtTest_Extension::class);

        // This Thing is a basically a File
        $thingObj = new UsedOnTableTest_ExtTest_UsedThing();
        $thingObj->write();

        // This Inner is basically a Page
        $innerObjTitle = 'My inner';
        $innerObj = new UsedOnTableTest_ExtTest_Inner();
        $innerObj->Title = $innerObjTitle;
        $innerObj->write();

        // This Middle is basically an ElementalArea
        $middleObj = new UsedOnTableTest_ExtTest_Middle();
        $middleObj->write();
        $innerObj->MiddleObjs()->add($middleObj);

        // Add a Thing to Middle to test the Exclusion part of the Extension
        $middleObj->ThingObj = $thingObj;
        $middleObj->write();

        // This Outer is basically an Elemental FileBlock
        $outerObjTitle = 'My outer';
        $outerObj = new UsedOnTableTest_ExtTest_Outer();
        $outerObj->Title = $outerObjTitle;
        $outerObj->ThingObj = $thingObj;
        $outerObj->write();
        $middleObj->OuterObjs()->add($outerObj);

        $usage = $this->getUsage($thingObj);
        $this->assertSame(1, count($usage));
        $this->assertSame($outerObjTitle, $usage[0]['title']);
        $this->assertSame($innerObjTitle, $usage[0]['ancestors'][0]['title']);
    }
}
