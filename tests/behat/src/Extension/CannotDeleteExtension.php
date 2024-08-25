<?php

namespace SilverStripe\Admin\Tests\Behat\Context\Extension;

use SilverStripe\Core\Extension;
use SilverStripe\Dev\TestOnly;

class CannotDeleteExtension extends Extension implements TestOnly
{
    protected function canDelete()
    {
        return false;
    }
}
