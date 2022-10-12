<?php

namespace SilverStripe\Admin\Tests\CMSEditLinkExtensionTest;

use SilverStripe\Admin\ModelAdmin;
use SilverStripe\Dev\TestOnly;

class CMSEditModelAdmin extends ModelAdmin implements TestOnly
{
    private static $url_segment = 'cms-edit-test';

    private static $managed_models = [
        'belongsHere' => ManagedDataObject::class,
    ];
}
