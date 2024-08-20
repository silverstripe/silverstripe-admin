<?php

namespace SilverStripe\Admin\Tests\CMSProfileControllerTest;

use SilverStripe\Core\Extension;

class TestExtension extends Extension
{
    protected function canEdit($member = null)
    {
        return false;
    }
}
