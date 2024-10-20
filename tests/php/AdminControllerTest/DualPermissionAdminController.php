<?php

namespace SilverStripe\Admin\Tests\LeftAndMainTest;

use SilverStripe\Admin\AdminController;
use SilverStripe\Dev\TestOnly;

class DualPermissionAdminController extends AdminController implements TestOnly
{
    private static string|array $required_permission_codes = [
        'PERMISSION1',
        'PERMISSION2',
    ];
}
