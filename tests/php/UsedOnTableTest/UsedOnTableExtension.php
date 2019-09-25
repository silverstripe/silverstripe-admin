<?php

namespace SilverStripe\Admin\Tests\UsedOnTableTest;

use SilverStripe\Assets\Shortcodes\FileLink;
use SilverStripe\Core\Extension;
use SilverStripe\ORM\ArrayList;
use SilverStripe\ORM\DataObject;

class UsedOnTableExtension extends Extension
{
    public function updateUsage(ArrayList &$usage, DataObject &$record)
    {
        $usage = $usage->exclude([
            'ClassName' => [
                FileLink::class,
            ]
        ]);
    }
}
