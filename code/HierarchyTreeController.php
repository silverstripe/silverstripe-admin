<?php

namespace SilverStripe\Admin;

use stdClass;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\Hierarchy\Hierarchy;
use SilverStripe\Security\Permission;
use SilverStripe\ORM\DataList;

/**
 * Controller for serving JSON tree data for any DataObject with the Hierarchy extension.
 *
 * This provides a generic endpoint for fetching hierarchical data as JSON,
 * which can be consumed by React components for rendering tree views.
 *
 * You must specify the following on your subclass:
 * - private static string $url_segment = 'yoursegment';
 * - private static string $model_class = SomeDataObject::class;
 */
abstract class HierarchyTreeController extends LeftAndMain
{
    use HierarchyTreeTrait;

    private const JSON_FLAGS = JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT;

    private static ?string $url_segment = null;

    private static ?string $model_class = null;

    private static bool $enable_duplicate = true;

    private static bool $enable_duplicate_with_children = true;

    private static array $allowed_actions = [
        'jsonview',
        'savejsonnode',
        'updatejsonnodes',
        'duplicate',
        'duplicateWithChildren',
    ];

    private static $url_handlers = [
        'GET jsonview/$RootID/$CurrentID' => 'jsonview',
        'POST duplicate/$ID' => 'duplicate',
        'POST duplicateWithChildren/$ID' => 'duplicateWithChildren',
    ];

    public function getApiEndpoint(): string
    {
        return $this->Link('jsonview');
    }

    public function getDuplicateEndpoint(): ?string
    {
        return $this->Link('duplicate/%s');
    }

    public function getDuplicateWithChildrenEndpoint(): ?string
    {
        return $this->Link('duplicateWithChildren/%s');
    }

    public function getSaveNodeEndpoint(): string
    {
        return $this->Link('savejsonnode');
    }

    public function getUpdateNodesEndpoint(): string
    {
        return $this->Link('updatejsonnodes');
    }

    /**
     * Returns JSON tree data for a given model class.
     *
     * The model class must have the Hierarchy extension applied.
     * Request parameters:
     * - ModelClass: The fully qualified class name of the model (URL encoded)
     * - ID: Optional current record ID to expose in the tree
     * - rootID: Optional root node ID to start from
     *
     * Config values on the DataObject:
     * - node_threshold_total: Controls when to stop breadth-first tree marking. When total marked
     *   nodes exceeds this value, marking stops and the last batch of children are marked with
     *   opened=false to prevent expansion.
     * - node_threshold_leaf: Controls when a node has "too many children". If a node's child count
     *   exceeds this threshold, it's marked as limited=true with count=0 and returns an empty
     *   children array, requiring a subsequent request to /jsonview/{nodeID} to load them.
     *
     * Both work together to enable progressive/lazy loading of large hierarchical datasets.
     */
    public function jsonview(HTTPRequest $request): HTTPResponse
    {
        $modelClass = $this->getModelClass();
        if (!is_a($modelClass, DataObject::class, true)) {
            $this->jsonError(400, 'Invalid model class');
        }
        $singleton = DataObject::singleton($modelClass);
        if (!$singleton->hasExtension(Hierarchy::class)) {
            $this->jsonError(400, 'Model class must have Hierarchy extension');
        }
        if (!$singleton->canView()) {
            $this->jsonError(403, 'You do not have permission to view this content');
        }
        // Set current record ID if provided
        $currentID = $request->param('CurrentID');
        if ($currentID && is_numeric($currentID)) {
            $this->setCurrentRecordID((int) $currentID);
        }
        $rootID = $request->param('RootID');
        $isSubtreeRequest = (int) $rootID !== 0;
        // Prepopulate tree data cache
        $options = $this->getTreePrepopulateOptions($modelClass);
        DataObject::singleton($modelClass)->prepopulateTreeDataCache(null, $options);
        // Get the marked set - disable limiting for subtree requests
        $markedSet = $this->getMarkedSet($modelClass, $rootID, null, null, null, null, !$isSubtreeRequest);
        // Manually traverse tree to include all MarkedSet metadata
        $treeData = $markedSet->getRootTree();
        $treeData = $this->transformSubtree($treeData);
        // Return the children of the root node (whether singleton or specific node), not the root itself
        $data = isset($treeData['children']) ? $treeData['children'] : [];
        $obj = new stdClass();
        $obj->currentRecordID = $this->currentRecordID();
        $obj->data = $data;
        $this->extend('updateJsonView', $obj, $modelClass);
        return HTTPResponse::create(
            json_encode($obj, HierarchyTreeController::JSON_FLAGS),
            200,
        )->addHeader('Content-Type', 'application/json');
    }

    /**
     * Transform a subtree array to JSON format, preserving all metadata
     *
     * @param array $data Subtree data from MarkedSet::getSubtree()
     * @return array Transformed tree data for JSON response
     */
    protected function transformSubtree(array $data): array
    {
        $node = $data['node'];
        $output = [
            'id' => $node->ID,
            'parentID' => $node->ParentID,
            'title' => $node->getTreeTitle(),
            'marked' => $data['marked'],
            'expanded' => $data['expanded'],
            'opened' => $data['opened'],
            'limited' => $data['limited'],
            'count' => $data['count'],
            'depth' => $data['depth'],
            'statusFlags' => $node->getStatusFlags(),
            'children' => [],
        ];
        foreach ($data['children'] as $child) {
            $output['children'][] = $this->transformSubtree($child);
        }
        return $output;
    }

    /**
     * Determines if the current user can organise the tree (move/reorder nodes).
     * Can be overridden by subclasses for more specific permission checks.
     */
    public function canOrganiseTree(): bool
    {
        return (bool) Permission::check('ADMIN');
    }

    /**
     * Determines if the current user can create top-level nodes.
     * Can be overridden by subclasses for more specific permission checks.
     */
    public function canCreateTopLevel(): bool
    {
        return (bool) Permission::check('ADMIN');
    }

    /**
     * Save a tree node and return JSON response.
     * This is the public interface for JSON-based tree operations.
     *
     * @param HTTPRequest $request The request containing ID, ParentID, and SiblingIDs
     * @return HTTPResponse JSON response
     */
    public function savejsonnode(HTTPRequest $request): HTTPResponse
    {
        // Try to get JSON from post body first, fall back to form data
        $body = $request->getBody();
        $data = $body ? json_decode($body, true) : null;
        if (!is_array($data)) {
            // Fall back to form data (for FunctionalTest POST requests)
            $data = [
                'ID' => $request->postVar('ID'),
                'ParentID' => $request->postVar('ParentID'),
                'SiblingIDs' => $request->postVar('SiblingIDs'),
            ];
        }
        $statusUpdates = $this->saveTreeNodeInternal($request, $data, false);
        return $this->getResponse()
            ->addHeader('Content-Type', 'application/json')
            ->setBody(json_encode($statusUpdates));
    }

    /**
     * Update tree nodes and return JSON response.
     * This is the public interface for JSON-based tree update operations.
     *
     * @param HTTPRequest $request The request containing comma-separated IDs
     * @return HTTPResponse JSON response
     */
    public function updatejsonnodes(HTTPRequest $request): HTTPResponse
    {
        $data = $this->updateTreeNodesInternal($request, false);
        return $this->getResponse()
            ->addHeader('Content-Type', 'application/json')
            ->setBody(json_encode($data));
    }

    /**
     * Duplicate a single node without children
     *
     * @param HTTPRequest $request
     * @return HTTPResponse
     */
    public function duplicate(HTTPRequest $request): HTTPResponse
    {
        if (!$this->config()->get('enable_duplicate')) {
            $this->jsonError(403, 'Duplicate functionality is not enabled for this model');
        }
        $id = $request->param('ID');
        if (!$id || !is_numeric($id)) {
            $this->jsonError(400, 'Invalid node ID');
        }
        $node = DataList::create($this->getModelClass())->byID((int) $id);
        if (!$node) {
            $this->jsonError(404, 'Node not found');
        }
        if (!$node->canEdit()) {
            $this->jsonError(403, 'You do not have permission to duplicate this node');
        }
        $newNode = $node->duplicate(true);
        return HTTPResponse::create(
            json_encode([
                'success' => true,
                'message' => 'Node duplicated successfully',
                'newNodeID' => $newNode->ID,
            ], HierarchyTreeController::JSON_FLAGS),
            200,
        )->addHeader('Content-Type', 'application/json');
    }

    /**
     * Duplicate a node with all its children
     *
     * @param HTTPRequest $request
     * @return HTTPResponse
     */
    public function duplicateWithChildren(HTTPRequest $request): HTTPResponse
    {
        if (!$this->config()->get('enable_duplicate_with_children')) {
            $this->jsonError(403, 'Duplicate with children functionality is not enabled for this model');
        }
        $id = $request->param('ID');
        if (!$id || !is_numeric($id)) {
            $this->jsonError(400, 'Invalid node ID');
        }
        $node = $this->getModelClass()::get_by_id((int) $id);
        if (!$node) {
            $this->jsonError(404, 'Node not found');
        }
        if (!$node->canEdit()) {
            $this->jsonError(403, 'You do not have permission to duplicate this node');
        }
        $newNode = $node->duplicateWithChildren();
        return HTTPResponse::create(
            json_encode([
                'success' => true,
                'message' => 'Node with children duplicated successfully',
                'newNodeID' => $newNode->ID,
            ], HierarchyTreeController::JSON_FLAGS),
            200,
        )->addHeader('Content-Type', 'application/json');
    }
}
