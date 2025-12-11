<?php

namespace SilverStripe\Admin\Tests;

use SilverStripe\Admin\Tests\HierarchyTreeControllerTest\TestHierarchyModel;
use SilverStripe\Dev\FunctionalTest;

class HierarchyTreeControllerTest extends FunctionalTest
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

    public function testJsonViewReturnsValidJson(): void
    {
        $url = '/admin/test-hierarchy/jsonview';
        $response = $this->mainSession->sendRequest('GET', $url, []);
        $this->assertSame(200, $response->getStatusCode());
        $this->assertSame('application/json', $response->getHeader('Content-Type'));
        $data = json_decode($response->getBody(), true);
        $this->assertIsArray($data);
        $this->assertArrayHasKey('currentRecordID', $data);
        $this->assertArrayHasKey('data', $data);
        // Verify MarkedSet properties are included
        if (!empty($data['data'])) {
            $firstNode = $data['data'][0];
            $this->assertArrayHasKey('marked', $firstNode);
            $this->assertArrayHasKey('expanded', $firstNode);
            $this->assertArrayHasKey('opened', $firstNode);
            $this->assertArrayHasKey('limited', $firstNode);
            $this->assertArrayHasKey('count', $firstNode);
            $this->assertArrayHasKey('depth', $firstNode);
            $this->assertArrayHasKey('statusFlags', $firstNode);
            $this->assertIsArray($firstNode['statusFlags']);
        }
    }

    public function testJsonViewWithModelClass(): void
    {
        $url = '/admin/test-hierarchy/jsonview';
        $response = $this->mainSession->sendRequest('GET', $url, []);
        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody(), true);
        $this->assertIsArray($data['data']);
    }

    public function testJsonViewWithCurrentRecord(): void
    {
        $record = $this->objFromFixture(TestHierarchyModel::class, 'grandchild1');
        $url = '/admin/test-hierarchy/jsonview/0/' . $record->ID;
        $response = $this->mainSession->sendRequest('GET', $url, []);
        $this->assertSame(200, $response->getStatusCode());
        $this->assertSame('application/json', $response->getHeader('Content-Type'));
        $data = json_decode($response->getBody(), true);
        $this->assertIsArray($data);
        $this->assertArrayHasKey('currentRecordID', $data);
        $this->assertArrayHasKey('data', $data);
        $this->assertIsInt($data['currentRecordID']);
        $this->assertEquals($record->ID, $data['currentRecordID']);
    }

    public function testJsonViewRejectedWithoutPermission(): void
    {
        $this->logInWithPermission('ADMIN');
        TestHierarchyModel::config()->set('test_deny_permission', true);
        $url = '/admin/test-hierarchy/jsonview';
        $response = $this->mainSession->sendRequest('GET', $url, []);
        $this->assertSame(403, $response->getStatusCode());
        $this->assertSame('application/json', $response->getHeader('Content-Type'));
        $data = json_decode($response->getBody(), true);
        $this->assertIsArray($data);
        $this->assertArrayHasKey('status', $data);
        $this->assertSame('error', $data['status']);
        $this->assertArrayHasKey('errors', $data);
        $this->assertIsArray($data['errors']);
        $this->assertCount(1, $data['errors']);
        $error = $data['errors'][0];
        $this->assertArrayHasKey('type', $error);
        $this->assertSame('error', $error['type']);
        $this->assertArrayHasKey('code', $error);
        $this->assertSame(403, $error['code']);
        $this->assertArrayHasKey('value', $error);
        $this->assertSame('You do not have permission to view this content', $error['value']);
    }

    public function testPartialTreeWithNodeThresholdTotal(): void
    {
        TestHierarchyModel::config()->set('node_threshold_total', 3);
        $url = '/admin/test-hierarchy/jsonview';
        $response = $this->mainSession->sendRequest('GET', $url, []);
        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody(), true);
        $this->assertIsArray($data['data']);
        $totalNodes = $this->countNodesInTree($data['data']);
        $this->assertLessThanOrEqual(5, $totalNodes);
    }

    public function testPartialTreeWithNodeThresholdLeaf(): void
    {
        TestHierarchyModel::config()->set('node_threshold_leaf', 2);
        TestHierarchyModel::config()->set('node_threshold_total', 100);
        $url = '/admin/test-hierarchy/jsonview';
        $response = $this->mainSession->sendRequest('GET', $url, []);
        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody(), true);
        $this->assertIsArray($data['data']);
        $root = $this->findNodeByTitle($data['data'], 'Root');
        $this->assertNotNull($root);
        $this->assertArrayHasKey('limited', $root);
        $this->assertTrue($root['limited'], 'Root should be limited because it has 3 children (threshold is 2)');
        $this->assertArrayHasKey('count', $root);
        $this->assertEquals(0, $root['count'], 'Limited nodes return 0 count (no children in this response)');
        $this->assertEmpty($root['children'], 'Limited nodes should have empty children array');
        $this->assertArrayHasKey('marked', $root);
        $this->assertTrue($root['marked']);
        $this->assertArrayHasKey('expanded', $root);
        $this->assertArrayHasKey('opened', $root);
        $this->assertArrayHasKey('depth', $root);
    }

    public function testPartialTreeWithRootID(): void
    {
        $child1 = $this->objFromFixture(TestHierarchyModel::class, 'child1');
        $url = '/admin/test-hierarchy/jsonview/' . $child1->ID;
        $response = $this->mainSession->sendRequest('GET', $url, []);
        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody(), true);
        $this->assertIsArray($data['data']);
        $this->assertCount(2, $data['data']);
        $titles = array_column($data['data'], 'title');
        $this->assertContains('Grandchild 1', $titles);
        $this->assertContains('Grandchild 2', $titles);
    }

    public function testPartialTreeWithBothThresholds(): void
    {
        TestHierarchyModel::config()->set('node_threshold_total', 3);
        TestHierarchyModel::config()->set('node_threshold_leaf', 1);
        $url = '/admin/test-hierarchy/jsonview';
        $response = $this->mainSession->sendRequest('GET', $url, []);
        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody(), true);
        $this->assertIsArray($data['data']);
        $totalNodes = $this->countNodesInTree($data['data']);
        $this->assertLessThanOrEqual(5, $totalNodes);
        $child1 = $this->findNodeByTitle($data['data'], 'Child 1');
        if ($child1 !== null) {
            $this->assertTrue($child1['limited']);
        }
    }

    public function testNodeThresholdTotalLimitsMarking(): void
    {
        TestHierarchyModel::config()->set('node_threshold_total', 2);
        $url = '/admin/test-hierarchy/jsonview';
        $response = $this->mainSession->sendRequest('GET', $url, []);
        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody(), true);
        $this->assertIsArray($data['data']);
        $totalNodes = $this->countNodesInTree($data['data']);
        $this->assertLessThanOrEqual(4, $totalNodes);
        $this->assertGreaterThan(0, count($data['data']));
    }

    public function testNodeThresholdLeafLimitsChildren(): void
    {
        TestHierarchyModel::config()->set('node_threshold_leaf', 3);
        TestHierarchyModel::config()->set('node_threshold_total', 100);
        $root = $this->objFromFixture(TestHierarchyModel::class, 'root');
        $url = '/admin/test-hierarchy/jsonview/' . $root->ID;
        $response = $this->mainSession->sendRequest('GET', $url, []);
        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody(), true);
        $this->assertIsArray($data['data']);
        $this->assertCount(3, $data['data'], 'Root has 3 children');
        $child3 = null;
        foreach ($data['data'] as $node) {
            if ($node['title'] === 'Child 3') {
                $child3 = $node;
            }
        }
        $this->assertNotNull($child3);
        $this->assertArrayHasKey('limited', $child3);
        $this->assertFalse($child3['limited'], 'Child 3 should not be limited (1 child <= 3)');
        $this->assertArrayHasKey('count', $child3);
        $this->assertEquals(1, $child3['count']);
        $this->assertNotEmpty($child3['children'], 'Non-limited nodes should have children array populated');
        $this->assertArrayHasKey('marked', $child3);
        $this->assertArrayHasKey('expanded', $child3);
        $this->assertArrayHasKey('opened', $child3);
        $this->assertArrayHasKey('depth', $child3);
    }

    public function testPartialTreeOpened(): void
    {
        TestHierarchyModel::config()->set('node_threshold_total', 3);
        $url = '/admin/test-hierarchy/jsonview';
        $response = $this->mainSession->sendRequest('GET', $url, []);
        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody(), true);
        $this->assertIsArray($data['data']);
        $this->assertGreaterThan(0, count($data['data']));
        foreach ($data['data'] as $node) {
            $this->assertArrayHasKey('opened', $node);
            $this->assertArrayHasKey('expanded', $node);
            $this->assertArrayHasKey('marked', $node);
            $this->assertTrue($node['marked']);
        }
    }

    public function testNodeThresholdLeafExactlyAtThreshold(): void
    {
        TestHierarchyModel::config()->set('node_threshold_leaf', 3);
        TestHierarchyModel::config()->set('node_threshold_total', 100);
        $url = '/admin/test-hierarchy/jsonview';
        $response = $this->mainSession->sendRequest('GET', $url, []);
        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody(), true);
        $this->assertIsArray($data['data']);
        $root = $this->findNodeByTitle($data['data'], 'Root');
        $this->assertNotNull($root);
        $this->assertArrayHasKey('limited', $root);
        $this->assertFalse(
            $root['limited'],
            'Root should NOT be limited (3 children = threshold of 3, limited only when count > threshold)'
        );
        $this->assertArrayHasKey('count', $root);
        $this->assertEquals(3, $root['count']);
        $this->assertNotEmpty($root['children']);
    }

    public function testNodeThresholdLeafOneOverThreshold(): void
    {
        TestHierarchyModel::config()->set('node_threshold_leaf', 2);
        TestHierarchyModel::config()->set('node_threshold_total', 100);
        $url = '/admin/test-hierarchy/jsonview';
        $response = $this->mainSession->sendRequest('GET', $url, []);
        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody(), true);
        $this->assertIsArray($data['data']);
        $root = $this->findNodeByTitle($data['data'], 'Root');
        $this->assertNotNull($root);
        $this->assertArrayHasKey('limited', $root);
        $this->assertTrue(
            $root['limited'],
            'Root should be limited (3 children > threshold of 2)'
        );
        $this->assertArrayHasKey('count', $root);
        $this->assertEquals(0, $root['count'], 'Limited nodes should return count=0');
        $this->assertEmpty($root['children'], 'Limited nodes should have empty children');
    }

    public function testNodeThresholdLeafMultipleNodesLimited(): void
    {
        TestHierarchyModel::config()->set('node_threshold_leaf', 1);
        TestHierarchyModel::config()->set('node_threshold_total', 100);
        $url = '/admin/test-hierarchy/jsonview';
        $response = $this->mainSession->sendRequest('GET', $url, []);
        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody(), true);
        $this->assertIsArray($data['data']);
        $root = $this->findNodeByTitle($data['data'], 'Root');
        $this->assertNotNull($root);
        $this->assertTrue($root['limited'], 'Root (3 children) should be limited when threshold is 1');
        $this->assertEmpty($root['children']);
    }

    public function testIntegrationLimitedNodeExpansion(): void
    {
        TestHierarchyModel::config()->set('node_threshold_leaf', 2);
        TestHierarchyModel::config()->set('node_threshold_total', 100);
        $url = '/admin/test-hierarchy/jsonview';
        $response = $this->mainSession->sendRequest('GET', $url, []);
        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody(), true);
        $root = $this->findNodeByTitle($data['data'], 'Root');
        $this->assertNotNull($root);
        $this->assertTrue($root['limited'], 'Root should be limited (3 children > threshold of 2)');
        $this->assertEmpty($root['children']);
        $root_obj = $this->objFromFixture(TestHierarchyModel::class, 'root');
        $url = '/admin/test-hierarchy/jsonview/' . $root_obj->ID;
        $response = $this->mainSession->sendRequest('GET', $url, []);
        $this->assertSame(200, $response->getStatusCode());
        $subtreeData = json_decode($response->getBody(), true);
        $this->assertIsArray($subtreeData['data']);
        $this->assertGreaterThanOrEqual(3, count($subtreeData['data']), 'Subtree should return all 3 children of Root: ' . json_encode($subtreeData['data']));
    }

    public function testIntegrationUnexpandedNodeExpansion(): void
    {
        TestHierarchyModel::config()->set('node_threshold_total', 4);
        TestHierarchyModel::config()->set('node_threshold_leaf', 100);
        $url = '/admin/test-hierarchy/jsonview';
        $response = $this->mainSession->sendRequest('GET', $url, []);
        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody(), true);
        $this->assertIsArray($data['data']);
        $child1 = $this->findNodeByTitle($data['data'], 'Child 1');
        if ($child1) {
            $this->assertFalse($child1['expanded'], 'Child 1 should not be expanded when threshold_total is low');
            $this->assertGreaterThan(0, $child1['count'], 'Child 1 should have children count > 0');
            $this->assertEmpty($child1['children'], 'Child 1 children should not be loaded in initial response');
            $child1_obj = $this->objFromFixture(TestHierarchyModel::class, 'child1');
            $url = '/admin/test-hierarchy/jsonview/' . $child1_obj->ID;
            $response = $this->mainSession->sendRequest('GET', $url, []);
            $this->assertSame(200, $response->getStatusCode());
            $subtreeData = json_decode($response->getBody(), true);
            $this->assertGreaterThanOrEqual(2, count($subtreeData['data']), 'Subtree should return all 2 children of Child 1');
            $subtreeTitles = array_column($subtreeData['data'], 'title');
            $this->assertContains('Grandchild 1', $subtreeTitles);
            $this->assertContains('Grandchild 2', $subtreeTitles);
        }
    }

    public function testIntegrationBothThresholdsWithNestedStructure(): void
    {
        TestHierarchyModel::config()->set('node_threshold_total', 5);
        TestHierarchyModel::config()->set('node_threshold_leaf', 2);
        $url = '/admin/test-hierarchy/jsonview';
        $response = $this->mainSession->sendRequest('GET', $url, []);
        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody(), true);
        $this->assertIsArray($data['data']);
        $totalNodes = $this->countNodesInTree($data['data']);
        $this->assertLessThanOrEqual(7, $totalNodes);
        $root = $this->findNodeByTitle($data['data'], 'Root');
        $this->assertNotNull($root);
        if ($root['count'] > 2) {
            $this->assertTrue($root['limited'], 'Root should be limited if has > 2 children');
        }
    }

    public function testIntegrationMultipleSubtreeLoads(): void
    {
        TestHierarchyModel::config()->set('node_threshold_total', 3);
        TestHierarchyModel::config()->set('node_threshold_leaf', 100);
        $url = '/admin/test-hierarchy/jsonview';
        $response = $this->mainSession->sendRequest('GET', $url, []);
        $this->assertSame(200, $response->getStatusCode());
        $data = json_decode($response->getBody(), true);
        $this->assertIsArray($data['data']);
        $initialTotalNodes = $this->countNodesInTree($data['data']);
        $child1 = $this->objFromFixture(TestHierarchyModel::class, 'child1');
        $url1 = '/admin/test-hierarchy/jsonview/' . $child1->ID;
        $response1 = $this->mainSession->sendRequest('GET', $url1, []);
        $this->assertSame(200, $response1->getStatusCode());
        $subtreeData1 = json_decode($response1->getBody(), true);
        $this->assertGreaterThanOrEqual(2, count($subtreeData1['data']));
        $child2 = $this->objFromFixture(TestHierarchyModel::class, 'child2');
        $url2 = '/admin/test-hierarchy/jsonview/' . $child2->ID;
        $response2 = $this->mainSession->sendRequest('GET', $url2, []);
        $this->assertSame(200, $response2->getStatusCode());
        $subtreeData2 = json_decode($response2->getBody(), true);
        $this->assertGreaterThanOrEqual(1, count($subtreeData2['data']));
    }

    /**
     * Count total nodes in a tree structure
     */
    private function countNodesInTree(array $nodes): int
    {
        $count = 0;
        foreach ($nodes as $node) {
            $count++;
            if (!empty($node['children'])) {
                $count += $this->countNodesInTree($node['children']);
            }
        }
        return $count;
    }

    /**
     * Find a node by its title in a tree structure
     */
    private function findNodeByTitle(array $nodes, string $title): ?array
    {
        foreach ($nodes as $node) {
            if (isset($node['title']) && $node['title'] === $title) {
                return $node;
            }
            if (!empty($node['children']) && is_array($node['children'])) {
                $found = $this->findNodeByTitle($node['children'], $title);
                if ($found !== null) {
                    return $found;
                }
            }
        }
        return null;
    }
}
