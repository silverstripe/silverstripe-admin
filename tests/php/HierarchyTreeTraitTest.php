<?php

namespace SilverStripe\Admin\Tests;

use SilverStripe\Admin\Tests\HierarchyTreeControllerTest\TestHierarchyModel;
use SilverStripe\Dev\FunctionalTest;
use SilverStripe\ORM\DataObject;

class HierarchyTreeTraitTest extends FunctionalTest
{
    protected static $fixture_file = 'HierarchyTreeControllerTest.yml';

    protected static $extra_dataobjects = [
        TestHierarchyModel::class,
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->logInWithPermission('ADMIN');
    }

    public function testSavejsonnodeUpdatesParentID(): void
    {
        $node = $this->objFromFixture(TestHierarchyModel::class, 'child1');
        $newParent = $this->objFromFixture(TestHierarchyModel::class, 'child2');

        $response = $this->post('/admin/test-hierarchy/savejsonnode', [
            'ID' => $node->ID,
            'ParentID' => $newParent->ID,
            'SiblingIDs' => [$node->ID],
        ]);

        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody(), true);
        $this->assertIsArray($data);

        // Refresh node from DB to verify change was persisted
        $node = DataObject::get(TestHierarchyModel::class)->byID($node->ID);
        $this->assertSame($newParent->ID, $node->ParentID);
    }

    public function testSavejsonnodeMovesNodeBetweenParents(): void
    {
        $node = $this->objFromFixture(TestHierarchyModel::class, 'grandchild1');
        $newParent = $this->objFromFixture(TestHierarchyModel::class, 'child2');
        $oldParent = $this->objFromFixture(TestHierarchyModel::class, 'child1');

        // Move from child1 to child2
        $response = $this->post('/admin/test-hierarchy/savejsonnode', [
            'ID' => $node->ID,
            'ParentID' => $newParent->ID,
            'SiblingIDs' => [$node->ID],
        ]);

        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody(), true);
        $this->assertIsArray($data);
        $this->assertArrayHasKey('modified', $data);

        // Refresh node from DB to verify change was persisted
        $node = DataObject::get(TestHierarchyModel::class)->byID($node->ID);
        $this->assertSame($newParent->ID, $node->ParentID);
        $this->assertNotSame($oldParent->ID, $node->ParentID);
    }

    public function testSavejsonnodeValidatesSecurityToken(): void
    {
        // In FunctionalTest, the mainSession automatically handles security tokens
        // This test would require bypassing the middleware which isn't practical
        // The security token validation is tested in CMSMainTest::testSecurityTokenValidation
        $this->markTestSkipped('Security token validation is tested in CMSMainTest');
    }

    public function testUpdatejsonnodesReturnsCorrectJsonStructure(): void
    {
        $node1 = $this->objFromFixture(TestHierarchyModel::class, 'child1');
        $node2 = $this->objFromFixture(TestHierarchyModel::class, 'child2');

        $response = $this->get('/admin/test-hierarchy/updatejsonnodes?ids=' . $node1->ID . ',' . $node2->ID);

        $this->assertSame(200, $response->getStatusCode());
        $this->assertSame('application/json', $response->getHeader('Content-Type'));

        $data = json_decode($response->getBody(), true);
        $this->assertIsArray($data);
        $this->assertArrayHasKey((string) $node1->ID, $data);
        $this->assertArrayHasKey((string) $node2->ID, $data);

        // Verify no HTML is included (JSON-only response)
        $this->assertArrayNotHasKey('html', $data[(string) $node1->ID]);
    }

    public function testUpdatejsonnodesIncludesParentIDAndSiblingIDs(): void
    {
        $node = $this->objFromFixture(TestHierarchyModel::class, 'grandchild1');

        $response = $this->get('/admin/test-hierarchy/updatejsonnodes?ids=' . $node->ID);

        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody(), true);
        $nodeData = $data[(string) $node->ID];

        $this->assertArrayHasKey('ParentID', $nodeData);
        $this->assertArrayHasKey('NextID', $nodeData);
        $this->assertArrayHasKey('PrevID', $nodeData);
        $this->assertSame($node->ParentID, $nodeData['ParentID']);
    }

    public function testUpdatejsonnodesHandlesMultipleNodes(): void
    {
        $node1 = $this->objFromFixture(TestHierarchyModel::class, 'grandchild1');
        $node2 = $this->objFromFixture(TestHierarchyModel::class, 'grandchild2');
        $node3 = $this->objFromFixture(TestHierarchyModel::class, 'grandchild3');

        $response = $this->get('/admin/test-hierarchy/updatejsonnodes?ids='
            . $node1->ID . ',' . $node2->ID . ',' . $node3->ID);

        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody(), true);

        $this->assertArrayHasKey((string) $node1->ID, $data);
        $this->assertArrayHasKey((string) $node2->ID, $data);
        $this->assertArrayHasKey((string) $node3->ID, $data);

        // Verify each has required fields
        foreach ([$node1->ID, $node2->ID, $node3->ID] as $id) {
            $this->assertArrayHasKey('ParentID', $data[(string) $id]);
            $this->assertArrayHasKey('NextID', $data[(string) $id]);
            $this->assertArrayHasKey('PrevID', $data[(string) $id]);
        }
    }
}
