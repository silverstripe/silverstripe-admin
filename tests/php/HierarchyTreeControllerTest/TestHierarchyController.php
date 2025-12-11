<?php

namespace SilverStripe\Admin\Tests\HierarchyTreeControllerTest;

use SilverStripe\Admin\HierarchyTreeController;
use SilverStripe\Dev\TestOnly;

class TestHierarchyController extends HierarchyTreeController implements TestOnly
{
    private static string $url_segment = 'test-hierarchy';

    private static string $model_class = TestHierarchyModel::class;

    private static bool $enable_duplicate = true;

    private static bool $enable_duplicate_with_children = true;

    public function getApiEndpoint(): string
    {
        return $this->Link('jsonview');
    }

    public function getDuplicateEndpoint(): ?string
    {
        if (!$this->config()->get('enable_duplicate')) {
            return null;
        }
        return $this->Link('duplicate');
    }

    public function getDuplicateWithChildrenEndpoint(): ?string
    {
        if (!$this->config()->get('enable_duplicate_with_children')) {
            return null;
        }
        return $this->Link('duplicateWithChildren');
    }
}
