<?php

namespace SilverStripe\Admin\Webpack;

use SilverStripe\View\TemplateGlobalProvider;
use SilverStripe\Control\Director;

class TemplateProvider implements TemplateGlobalProvider
{
    public static function get_template_global_variables()
    {
        return [
            'WebpackDevServer' => 'isWebpackDevServer',
            'WebpackDevServerPort' => 'getWebpackDevServerPort',
            'ThemeAsset' => 'getThemeAsset',
        ];
    }

    /**
     * @return bool
     */
    public static function isWebpackDevServer()
    {
        if (Director::isDev()) {
            return !!@fsockopen('localhost', self::getWebpackDevServerPort(), $errno, $errstr, 1);
        }

        return false;
    }

    public static function WebpackCSS()
    {

    }
}