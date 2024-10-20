<?php

namespace SilverStripe\Admin\Tests\LeftAndMainTest;

use SilverStripe\Admin\AdminController;
use SilverStripe\Dev\TestOnly;

class TestAdminController extends AdminController implements TestOnly
{
    // no-op - we just want a non-abstract controller.
}
