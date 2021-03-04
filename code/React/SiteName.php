<?php
namespace SilverStripe\Admin\React;

use SilverStripe\Admin\LeftAndMain;
use SilverStripe\Control\Director;
use SilverStripe\SiteConfig\SiteConfig;
use SilverStripe\View\ViewableData;


class SiteName extends ViewableData
{
    use BootstrapComponent;

    public function getProps(): array
    {
        $config = SiteConfig::current_site_config();
        return [
            'title' => $config->Title ?? LeftAndMain::config()->get('application_name'),
            'baseHref' => Director::absoluteBaseURL()
        ];
    }

    public function getComponent(): string
    {
        return 'CmsSiteName';
    }
}
