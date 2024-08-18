<?php

namespace SilverStripe\Admin\Tests\Behat\Context\Extension;

use SilverStripe\Core\Extension;
use SilverStripe\Dev\TestOnly;

class CannotEditExtension extends Extension implements TestOnly
{
    protected function canEdit()
    {
        return false;
    }
}
