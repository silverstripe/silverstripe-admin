<?php

namespace SilverStripe\Admin\Tests;

use PHPUnit\Framework\Attributes\DataProvider;
use SilverStripe\Admin\Tests\SingleRecordAdminTest\TestAdmin;
use SilverStripe\Admin\Tests\SingleRecordAdminTest\TestRecord;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\Session;
use SilverStripe\Dev\SapphireTest;

class SingleRecordAdminTest extends SapphireTest
{
    protected static $extra_dataobjects = [
        TestRecord::class,
    ];

    protected function tearDown(): void
    {
        TestRecord::get()->removeAll();
    }

    public static function provideGetRecord(): array
    {
        return [
            [
                'recordExists' => false,
                'restrictToSingleRecord' => false,
                'allowNew' => false,
                'useFixtureID' => false,
                'expected' => null,
            ],
            [
                'recordExists' => false,
                'restrictToSingleRecord' => false,
                'allowNew' => false,
                'useFixtureID' => true,
                'expected' => null,
            ],
            [
                'recordExists' => true,
                'restrictToSingleRecord' => false,
                'allowNew' => false,
                'useFixtureID' => true,
                'expected' => 'existing',
            ],
            [
                'recordExists' => true,
                'restrictToSingleRecord' => false,
                'allowNew' => false,
                'useFixtureID' => false,
                'expected' => null,
            ],
            [
                'recordExists' => true,
                'restrictToSingleRecord' => true,
                'allowNew' => false,
                'useFixtureID' => false,
                'expected' => 'existing',
            ],
            [
                'recordExists' => true,
                'restrictToSingleRecord' => false,
                'allowNew' => true,
                'useFixtureID' => false,
                'expected' => 'new',
            ],
            [
                'recordExists' => true,
                'restrictToSingleRecord' => false,
                'allowNew' => true,
                'useFixtureID' => true,
                'expected' => 'existing',
            ],
            [
                'recordExists' => true,
                'restrictToSingleRecord' => true,
                'allowNew' => true,
                'useFixtureID' => true,
                'expected' => 'existing',
            ],
        ];
    }

    #[DataProvider('provideGetRecord')]
    public function testGetRecord(
        bool $recordExists,
        bool $restrictToSingleRecord,
        bool $allowNew,
        bool $useFixtureID,
        ?string $expected
    ): void {
        $admin = new TestAdmin();
        if ($recordExists) {
            $record = new TestRecord();
            $recordID = $record->write();
        } else {
            $recordID = 9999;
        }
        TestAdmin::config()->set('restrict_to_single_record', $restrictToSingleRecord);
        TestAdmin::config()->set('allow_new_record', $allowNew);

        if ($useFixtureID) {
            $result = $admin->getRecord($recordID);
        } else {
            $result = $admin->getRecord(0);
        }

        if ($expected === 'existing') {
            $this->assertInstanceOf(TestRecord::class, $result);
            $this->assertSame($recordID, $result->ID);
        } elseif ($expected === 'new') {
            $this->assertInstanceOf(TestRecord::class, $result);
            $this->assertSame(0, $result->ID);
        } else {
            $this->assertNull($result);
        }
    }

    public static function provideCurrentRecordID(): array
    {
        return [
            'unrelated ID request var is ignored' => [
                'explicitID' => null,
                'requestVars' => ['ID' => '915', 'format' => 'json'],
                'expected' => null,
            ],
            'explicit id wins over request var' => [
                'explicitID' => 123,
                'requestVars' => ['ID' => '915'],
                'expected' => 123,
            ],
        ];
    }

    #[DataProvider('provideCurrentRecordID')]
    public function testCurrentRecordID(?int $explicitID, array $requestVars, ?int $expected): void
    {
        $admin = new TestAdmin();
        $admin->setRequest(new HTTPRequest('GET', 'admin/test/EditForm/field/MyField/tree', $requestVars));
        $admin->setCurrentRecordID($explicitID);
        $this->assertSame($expected, $admin->currentRecordID());
    }

    public function testGetEditFormIgnoresUnrelatedIDRequestVar(): void
    {
        $this->logInWithPermission('ADMIN');
        $record = new TestRecord();
        $recordID = $record->write();
        $requestVars = ['ID' => $recordID + 1, 'format' => 'json'];
        $request = new HTTPRequest('GET', 'admin/test/EditForm/field/MyField/tree', $requestVars);
        $request->setSession(new Session([]));
        $admin = new TestAdmin();
        $admin->setRequest($request);
        $form = $admin->getEditForm();
        $this->assertSame($recordID, (int) $form->Fields()->dataFieldByName('ID')->dataValue());
    }
}
