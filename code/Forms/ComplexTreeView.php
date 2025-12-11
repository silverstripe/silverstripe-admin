<?php

namespace SilverStripe\Admin\Forms;

use SilverStripe\Model\ModelData;

/**
 * A schema provider for the ComplexTreeView React component.
 *
 * This class provides schema data that can be consumed by the ComplexTreeViewEntwine.js
 * adapter to mount the React ComplexTreeView component. It is NOT a FormField - it exists
 * outside the form system and is rendered directly via templates.
 *
 * Usage in a controller:
 *   public function getTreeViewSchema(): array
 *   {
 *       $treeView = ComplexTreeView::create()
 *           ->setApiEndpoint($this->Link('tree/jsonview'))
 *           ->setCurrentRecordID($this->currentRecordID());
 *       return $treeView->getSchemaData();
 *   }
 *
 * Usage in a template:
 *   <div class="complex-tree-view__container"
 *        data-schema='TreeViewSchemaJson'>
 *   </div>
 */
class ComplexTreeView extends ModelData
{
    protected string $schemaComponent = 'ComplexTreeView';

    private ?string $apiEndpoint = null;

    private ?string $duplicateEndpoint = null;

    private ?string $duplicateWithChildrenEndpoint = null;

    private ?string $addChildEndpoint = null;

    private ?string $saveNodeEndpoint = null;

    private ?string $updateNodesEndpoint = null;

    private ?string $editUrlPattern = null;

    private ?string $listUrlPattern = null;

    private int $currentRecordID = 0;

    private array $labels = [];

    private bool $enableContextMenu = true;

    private bool $enableAddChild = true;

    private bool $enableDefaultNavigationHandlers = true;

    private ?string $treeLabel = null;

    public function setApiEndpoint(string $endpoint): static
    {
        $this->apiEndpoint = $endpoint;
        return $this;
    }

    public function getApiEndpoint(): ?string
    {
        return $this->apiEndpoint;
    }

    public function setDuplicateEndpoint(string $endpoint): static
    {
        $this->duplicateEndpoint = $endpoint;
        return $this;
    }

    public function getDuplicateEndpoint(): ?string
    {
        return $this->duplicateEndpoint;
    }

    public function setDuplicateWithChildrenEndpoint(string $endpoint): static
    {
        $this->duplicateWithChildrenEndpoint = $endpoint;
        return $this;
    }

    public function getDuplicateWithChildrenEndpoint(): ?string
    {
        return $this->duplicateWithChildrenEndpoint;
    }

    public function setAddChildEndpoint(string $endpoint): static
    {
        $this->addChildEndpoint = $endpoint;
        return $this;
    }

    public function getAddChildEndpoint(): ?string
    {
        return $this->addChildEndpoint;
    }

    public function setSaveNodeEndpoint(string $endpoint): static
    {
        $this->saveNodeEndpoint = $endpoint;
        return $this;
    }

    public function getSaveNodeEndpoint(): ?string
    {
        return $this->saveNodeEndpoint;
    }

    public function setUpdateNodesEndpoint(string $endpoint): static
    {
        $this->updateNodesEndpoint = $endpoint;
        return $this;
    }

    public function getUpdateNodesEndpoint(): ?string
    {
        return $this->updateNodesEndpoint;
    }

    public function setEditUrlPattern(string $pattern): static
    {
        $this->editUrlPattern = $pattern;
        return $this;
    }

    public function getEditUrlPattern(): ?string
    {
        return $this->editUrlPattern;
    }

    public function setListUrlPattern(string $pattern): static
    {
        $this->listUrlPattern = $pattern;
        return $this;
    }

    public function getListUrlPattern(): ?string
    {
        return $this->listUrlPattern;
    }

    public function setCurrentRecordID(int $id): static
    {
        $this->currentRecordID = $id;
        return $this;
    }

    public function getCurrentRecordID(): int
    {
        return $this->currentRecordID;
    }

    public function setLabels(array $labels): static
    {
        $this->labels = $labels;
        return $this;
    }

    public function getLabels(): array
    {
        return $this->labels;
    }

    public function setEnableContextMenu(bool $enabled): static
    {
        $this->enableContextMenu = $enabled;
        return $this;
    }

    public function getEnableContextMenu(): bool
    {
        return $this->enableContextMenu;
    }

    public function setEnableAddChild(bool $enabled): static
    {
        $this->enableAddChild = $enabled;
        return $this;
    }

    public function getEnableAddChild(): bool
    {
        return $this->enableAddChild;
    }

    public function setEnableDefaultNavigationHandlers(bool $enabled): static
    {
        $this->enableDefaultNavigationHandlers = $enabled;
        return $this;
    }

    public function getEnableDefaultNavigationHandlers(): bool
    {
        return $this->enableDefaultNavigationHandlers;
    }

    public function setTreeLabel(string $label): static
    {
        $this->treeLabel = $label;
        return $this;
    }

    public function getTreeLabel(): ?string
    {
        return $this->treeLabel;
    }

    /**
     * Get the schema data array for the React component.
     */
    public function getSchemaData(): array
    {
        $data = [
            'component' => $this->schemaComponent,
            'data' => [
                'currentRecordID' => $this->currentRecordID,
            ],
        ];
        if ($this->apiEndpoint) {
            $data['data']['apiEndpoint'] = $this->apiEndpoint;
        }
        if ($this->duplicateEndpoint) {
            $data['data']['duplicateEndpoint'] = $this->duplicateEndpoint;
        }
        if ($this->duplicateWithChildrenEndpoint) {
            $data['data']['duplicateWithChildrenEndpoint'] = $this->duplicateWithChildrenEndpoint;
        }
        if ($this->addChildEndpoint) {
            $data['data']['addChildEndpoint'] = $this->addChildEndpoint;
        }
        if ($this->saveNodeEndpoint) {
            $data['data']['saveNodeEndpoint'] = $this->saveNodeEndpoint;
        }
        if ($this->updateNodesEndpoint) {
            $data['data']['updateNodesEndpoint'] = $this->updateNodesEndpoint;
        }
        if ($this->editUrlPattern) {
            $data['data']['editUrlPattern'] = $this->editUrlPattern;
        }
        if ($this->listUrlPattern) {
            $data['data']['listUrlPattern'] = $this->listUrlPattern;
        }
        if (!empty($this->labels)) {
            $data['data']['labels'] = $this->labels;
        }
        $data['data']['enableContextMenu'] = $this->enableContextMenu;
        $data['data']['enableAddChild'] = $this->enableAddChild;
        $data['data']['enableDefaultNavigationHandlers'] = $this->enableDefaultNavigationHandlers;
        if ($this->treeLabel) {
            $data['data']['treeLabel'] = $this->treeLabel;
        }
        $this->extend('updateSchemaData', $data);
        return $data;
    }

    /**
     * Get the schema data as JSON for use in templates.
     */
    public function getSchemaJson(): string
    {
        return json_encode($this->getSchemaData(), JSON_UNESCAPED_SLASHES);
    }
}
