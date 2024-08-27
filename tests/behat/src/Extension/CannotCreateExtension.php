<?php

namespace SilverStripe\Admin\Tests\Behat\Context\Extension;

use SilverStripe\Core\Extension;
use SilverStripe\Dev\TestOnly;

class CannotCreateExtension extends Extension implements TestOnly
{
    protected function canCreate()
    {
        return false;
    }
}
