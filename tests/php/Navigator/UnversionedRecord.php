<?php

namespace SilverStripe\Admin\Tests\Navigator;

use SilverStripe\Dev\TestOnly;
use SilverStripe\ORM\CMSPreviewable;
use SilverStripe\ORM\DataObject;

class UnversionedRecord extends DataObject implements TestOnly, CMSPreviewable
{
    private static $table_name = 'SilverStripeNavigatorTest_Unversioned_Record';

    private static $show_stage_link = true;

    private static $show_live_link = true;

    private static $show_unversioned_preview_link = true;

    public $previewLinkTestProperty = null;

    public function PreviewLink($action = null)
    {
        return $this->previewLinkTestProperty;
    }

    public function getMimeType()
    {
        return 'text/html';
    }

    public function getCMSEditLink(): ?string
    {
        return null;
    }
}
