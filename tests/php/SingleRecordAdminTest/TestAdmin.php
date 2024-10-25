<?php

namespace SilverStripe\Admin\Tests\SingleRecordAdminTest;

use SilverStripe\Admin\SingleRecordAdmin;
use SilverStripe\Dev\TestOnly;

class TestAdmin extends SingleRecordAdmin implements TestOnly
{
    private static string $model_class = TestRecord::class;
}
