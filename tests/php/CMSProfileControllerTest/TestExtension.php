<?php

namespace SilverStripe\Admin\Tests\CMSProfileControllerTest;

use SilverStripe\ORM\DataExtension;

class TestExtension extends DataExtension
{
    protected function canEdit($member = null)
    {
        return false;
    }
}
