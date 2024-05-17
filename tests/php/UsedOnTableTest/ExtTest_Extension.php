<?php

namespace SilverStripe\Admin\Tests\UsedOnTableTest;

use SilverStripe\Core\Extension;
use SilverStripe\Dev\TestOnly;
use SilverStripe\ORM\DataObject;

class ExtTest_Extension extends Extension implements TestOnly
{

    protected function updateUsageExcludedClasses(array &$excludedClasses)
    {
        $excludedClasses[] = ExtTest_Middle::class;
    }

    protected function updateUsageAncestorDataObjects(array &$ancestorDataObjects, DataObject $dataObject)
    {
        if (!($dataObject instanceof ExtTest_Outer)) {
            return;
        }
        $middleParent = $dataObject->MiddleObj();
        $innerGrandParent = $middleParent->InnerObj();
        // Add GrandParent InnerObj to ancestors, but not Parent MiddleObj
        $ancestorDataObjects[] = $innerGrandParent;
    }
}
