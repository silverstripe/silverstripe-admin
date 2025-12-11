<?php

namespace SilverStripe\Admin;

use InvalidArgumentException;
use RuntimeException;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\Config\Config;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\DB;
use SilverStripe\ORM\Hierarchy\Hierarchy;
use SilverStripe\ORM\Hierarchy\MarkedSet;
use SilverStripe\Security\InheritedPermissions;
use SilverStripe\Security\PermissionCheckable;
use SilverStripe\Security\Security;
use SilverStripe\Security\SecurityToken;

/**
 * Provides shared tree-building functionality for any controller that manages
 * DataObjects with the Hierarchy extension.
 *
 * This trait is only intended to be used by LeftAndMain subclasses.
 *
 * This trait exists to share code between HierarchyTreeController and CMSMain which still
 * uses treeview() functionality.
 *
 * This trait should be removed and its code moved to HierarchyTreeController once CMSMain no
 * longer uses treeview() in a future major release
 */
trait HierarchyTreeTrait
{
    /**
     * Get the options used for the call to Hierarchy::prepopulateTreeDataCache()
     */
    private function getTreePrepopulateOptions(string $modelClass): array
    {
        /** @var DataObject&Hierarchy $obj */
        $obj = DataObject::singleton($modelClass);
        if (!$obj->hasExtension(Hierarchy::class)) {
            throw new InvalidArgumentException("Model class $modelClass must have Hierarchy extension");
        }
        $baseClass = $obj->getHierarchyBaseClass();
        return [
            'childrenMethod' => $baseClass::config()->get('tree_children_method'),
            'numChildrenMethod' => 'numChildren',
        ];
    }

    /**
     * Get a MarkedSet for the given model class and optional parameters.
     *
     * @param string $className The class of the root object
     * @param string|int|null $rootID The ID of the root object. If null, a complete tree will be shown
     * @param string|null $childrenMethod The method to call to get the children of the tree
     * @param string|null $numChildrenMethod The method to call to count children
     * @param callable|null $filterFunction Filter function for marking
     * @param int|null $nodeCountThreshold Minimum threshold for number of nodes to mark
     * @param bool $enableLimiting Whether to apply node limiting. Set to false for subtree requests.
     */
    private function getMarkedSet(
        $className,
        $rootID = null,
        $childrenMethod = null,
        $numChildrenMethod = null,
        $filterFunction = null,
        $nodeCountThreshold = null,
        $enableLimiting = true
    ): MarkedSet {
        // This check is required to ensure that methods called on $this are available
        if (!is_a(self::class, LeftAndMain::class, true)) {
            throw new RuntimeException('HierarchyTreeTrait can only be used in LeftAndMain subclasses');
        }
        $nodeCountThreshold = $nodeCountThreshold ?? Config::inst()->get($className, 'node_threshold_total');
        // Build set from node and begin marking
        $record = $rootID ? $this->getRecord($rootID) : null;
        $rootNode = $record ?: DataObject::singleton($className);
        $markedSet = MarkedSet::create($rootNode, $childrenMethod, $numChildrenMethod, $nodeCountThreshold);
        // Set filter function
        if ($filterFunction) {
            $markedSet->setMarkingFilterFunction($filterFunction);
        }
        // Disable limiting for subtree requests
        if (!$enableLimiting) {
            $markedSet->setLimitingEnabled(false);
        }
        // Mark tree from this node
        $markedSet->markPartialTree();
        // Ensure current record is exposed
        $currentRecord = $this->currentRecord();
        if ($currentRecord) {
            $markedSet->markToExpose($currentRecord);
        }
        // Pre-cache permissions if using a permission checker
        $modelClass = $this->getModelClass();
        if (is_a($modelClass, PermissionCheckable::class, true)) {
            $checker = DataObject::singleton($modelClass)->getPermissionChecker();
            if ($checker instanceof InheritedPermissions) {
                $checker->prePopulatePermissionCache(
                    InheritedPermissions::EDIT,
                    $markedSet->markedNodeIDs()
                );
            }
        }
        return $markedSet;
    }

    /**
     * Internal method to handle tree node save logic for both HTML and JSON responses.
     *
     * @param HTTPRequest $request The request containing ID, ParentID, and SiblingIDs
     * @param array $data The data to save
     * @param bool $returnHtml Whether to include HTML in the response (legacy)
     * @return array Array of status updates with node data
     * @throws HTTPResponse_Exception
     */
    private function saveTreeNodeInternal(HTTPRequest $request, array $data, bool $returnHtml): array
    {
        if (!SecurityToken::inst()->checkRequest($request)) {
            $this->httpError(400);
        }
        if (!$this->canOrganiseTree()) {
            $this->httpError(
                403,
                _t(
                    // TODO Change _t key to admin
                    'SilverStripe\\CMS\\Controllers\\CMSMain.CANT_REORGANISE2',
                    "You do not have permission to rearange the tree. Your change was not saved.",
                )
            );
        }

        $className = $this->getModelClass();

        $id = $data['ID'] ?? null;
        $parentID = $data['ParentID'] ?? null;
        $siblingIDs = $data['SiblingIDs'] ?? null;

        if (!is_numeric($id) || !is_numeric($parentID)) {
            $this->httpError(400);
        }

        // Check record exists in the DB
        /** @var DataObject&Hierarchy $node */
        $node = DataObject::get($className)->setUseCache(true)->byID($id);
        if (!$node) {
            $this->httpError(
                500,
                _t(
                    // TODO Change _t key to admin
                    'SilverStripe\\CMS\\Controllers\\CMSMain.PLEASESAVE2',
                    "Please Save Record: This record could not be updated because it hasn't been saved yet."
                )
            );
        }

        // Check top level permissions
        $isRoot = $node->ParentID == 0;
        if (($parentID == '0' || $isRoot) && !$this->canCreateTopLevel()) {
            $this->httpError(
                403,
                _t(
                    // TODO Change _t key to admin
                    'SilverStripe\\CMS\\Controllers\\CMSMain.CANT_REORGANISE_TOPLEVEL',
                    'You do not have permission to alter Top level records. Your change was not saved.'
                )
            );
        }

        $statusUpdates = ['modified' => []];

        if (!$node->canEdit()) {
            // TODO wrong return type
            return Security::permissionFailure($this);
        }

        // Update hierarchy (only if ParentID changed)
        $parentChanged = $node->ParentID != $parentID;
        if ($parentChanged) {
            $node->ParentID = (int) $parentID;
            $node->write();

            if ($returnHtml && method_exists($this, 'getRecordTreeMarkup')) {
                $statusUpdates['modified'][$node->ID] = [
                    'TreeTitle' => $this->getRecordTreeMarkup($node),
                ];
            }
            $this->getResponse()->addHeader(
                'X-Status',
                rawurlencode(_t(
                    'SilverStripe\\CMS\\Controllers\\CMSMain.REORGANISATIONSUCCESSFUL2',
                    'Reorganised the tree successfully.'
                ) ?? '')
            );
        }

        // Update sorting
        $sortField = $node->getSortField();
        $sortChanged = $sortField && is_array($siblingIDs);
        if ($sortChanged) {
            $counter = 0;
            foreach ($siblingIDs as $id) {
                if ($id == $node->ID) {
                    $node->$sortField = ++$counter;
                    $node->write();
                    if ($returnHtml && method_exists($this, 'getRecordTreeMarkup')) {
                        $statusUpdates['modified'][$node->ID] = [
                            'TreeTitle' => $this->getRecordTreeMarkup($node),
                        ];
                    }
                } elseif (is_numeric($id)) {
                    // Nodes that weren't "actually moved" shouldn't be registered as
                    // having been edited; do a direct SQL update instead
                    ++$counter;
                    $table = DataObject::getSchema()->baseDataTable($className);
                    DB::prepared_query(
                        "UPDATE \"$table\" SET \"$sortField\" = ? WHERE \"ID\" = ?",
                        [$counter, $id]
                    );
                }
            }

            $this->getResponse()->addHeader(
                'X-Status',
                rawurlencode(_t(
                    'SilverStripe\\CMS\\Controllers\\CMSMain.REORGANISATIONSUCCESSFUL2',
                    'Reorganised the tree successfully.'
                ) ?? '')
            );
        }

        $node->invokeWithExtensions('updateSaveTreeNodeStatusUpdates', $statusUpdates, $parentChanged, $sortChanged);

        return $statusUpdates;
    }

    /**
     * Internal method to handle tree node updates for both HTML and JSON responses.
     *
     * @param HTTPRequest $request The request containing comma-separated IDs
     * @param bool $returnHtml Whether to include HTML in the response (legacy)
     * @return array Array of node data with ParentID, NextID, PrevID
     */
    private function updateTreeNodesInternal(HTTPRequest $request, bool $returnHtml = true): array
    {
        $data = [];
        $ids = explode(',', $request->getVar('ids') ?? '');
        foreach ($ids as $id) {
            if ($id === "") {
                continue; // $id may be a blank string, which is invalid and should be skipped over
            }

            /** @var DataObject&Hierarchy $record */
            $record = $this->getRecord($id);
            if (!$record) {
                continue; // In case a record is no longer available
            }

            // Create marking set with sole marked root
            $markingSet = MarkedSet::create($record);
            $markingSet->setMarkingFilterFunction(function () {
                return false;
            });
            $markingSet->markUnexpanded($record);

            // Find the next & previous nodes, for proper positioning (Sort isn't good enough - it's not a raw offset)
            $prev = null;

            $className = $this->getModelClass();
            $sortField = $record->getSortField();
            $list = DataObject::get($className)->filter('ParentID', $record->ParentID);
            if ($sortField) {
                $list = $list->filter($sortField . ':GreaterThan', $record->$sortField);
            }
            $next = $list->first();

            if (!$next) {
                $list = DataObject::get($className)->filter('ParentID', $record->ParentID);
                if ($sortField) {
                    $list = $list->filter($sortField . ':LessThan', $record->$sortField);
                }
                $prev = $list->reverse()->first();
            }

            // Render using single node template if HTML response is requested
            $html = '';
            if ($returnHtml && method_exists($this, 'getTreeNodeCustomisations')) {
                $html = $markingSet->renderChildren(
                    ['SilverStripe\\CMS\\Controllers\\CMSMain_TreeNode', 'type' => 'Includes'],
                    $this->getTreeNodeCustomisations()
                );
            }

            $data[$id] = [
                'ParentID' => $record->ParentID,
                'NextID' => $next ? $next->ID : null,
                'PrevID' => $prev ? $prev->ID : null
            ];
            if ($returnHtml) {
                $data[$id]['html'] = $html;
            }
        }
        return $data;
    }
}
