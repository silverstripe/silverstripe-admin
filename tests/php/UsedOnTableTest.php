<?php

namespace SilverStripe\Admin\Tests;

use SilverStripe\Admin\Forms\UsedOnTable;
use SilverStripe\Assets\File;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Dev\SapphireTest;

class UsedOnTableTest extends SapphireTest
{
    protected static $fixture_file = 'UsedOnTableTest.yml';

    public function testOK()
    {
        $usedOnTable = UsedOnTable::create("Used On");

        $file1 = $this->objFromFixture(File::class, 'file1');
        $usedOnTable->setRecord($file1);

        $request = new HTTPRequest('GET', '/');
        $response = $usedOnTable->usage($request);
        $responseBody = json_decode($response->getBody(), true);

        $expected = [
            'usage' => [
                [
                    'id' => 'SilverStripe\Assets\Shortcodes\FileLink\/1',
                    'title' => '#1',
                    'type' => 'File Link',
                    'state' => null,
                    'link' => null,
                ]
            ]
        ];
        $this->assertEquals($expected, $responseBody);
    }

    public function testExtensionExclusion()
    {
        UsedOnTable::config()->update('extensions', [
            UsedOnTableTest\UsedOnTableExtension::class
        ]);

        $usedOnTable = UsedOnTable::create("Used On");

        $file1 = $this->objFromFixture(File::class, 'file1');
        $usedOnTable->setRecord($file1);

        $request = new HTTPRequest('GET', '/');
        $response = $usedOnTable->usage($request);
        $responseBody = json_decode($response->getBody(), true);

        $this->assertEmpty($responseBody['usage']);
    }
}
