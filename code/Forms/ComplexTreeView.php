<?php

namespace SilverStripe\Admin\Forms;

use SilverStripe\Forms\DatalessField;

/**
 * A tree view component using react-complex-tree.
 */
class ComplexTreeView extends DatalessField
{
    protected $schemaComponent = 'ComplexTreeView';

    private string $apiEndpoint = '/admin/pages/tree/jsonview';

    protected string $duplicateEndpoint = '';

    protected string $duplicateWithChildrenEndpoint = '';

    protected string $addChildEndpoint = '';

    public function __construct()
    {
        return parent::__construct('ComplexTreeView');
    }

    public function setApiEndpoint(string $endpoint): static
    {
        $this->apiEndpoint = $endpoint;
        return $this;
    }

    public function getApiEndpoint(): string
    {
        return $this->apiEndpoint;
    }

    public function setDuplicateEndpoint(string $url): static
    {
        $this->duplicateEndpoint = $url;
        return $this;
    }

    public function getDuplicateEndpoint(): string
    {
        return $this->duplicateEndpoint;
    }

    public function setDuplicateWithChildrenEndpoint(string $url): static
    {
        $this->duplicateWithChildrenEndpoint = $url;
        return $this;
    }

    public function getDuplicateWithChildrenEndpoint(): string
    {
        return $this->duplicateWithChildrenEndpoint;
    }

    public function setAddChildEndpoint(string $url): static
    {
        $this->addChildEndpoint = $url;
        return $this;
    }

    public function getAddChildEndpoint(): string
    {
        return $this->addChildEndpoint;
    }

    public function getSchemaDataDefaults()
    {
        $data = parent::getSchemaDataDefaults();
        $data['data'] = array_merge($data['data'], [
            'apiEndpoint' => $this->getApiEndpoint(),
            'duplicateEndpoint' => $this->getDuplicateEndpoint(),
            'duplicateWithChildrenEndpoint' => $this->getDuplicateWithChildrenEndpoint(),
            'addChildEndpoint' => $this->getAddChildEndpoint(),
        ]);
        return $data;
    }

    public function getAttributes()
    {
        $attributes = parent::getAttributes();
        return $attributes;
    }
}
