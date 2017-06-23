<?php

namespace SilverStripe\Admin\Webpack;

use SilverStripe\Core\Manifest\ModuleLoader;
use SilverStripe\Control\Director;
use SilverStripe\View\Requirements;
use Exception;

/**
 * Class Webpack
 * @package SilverStripe\Admin\Webpack
 */
class Webpack
{
    /**
     * @var
     */
    protected $port;

    protected $module;
    /**
     * Webpack constructor.
     * @param $moduleName
     * @throws Exception
     */
    public function __construct($moduleName)
    {
        $module = ModuleLoader::getModule($moduleName);
        if (!$module) {
            throw new Exception('Invalid module name for Webpack: ' . $moduleName);
        }

        if (!isset($parsed['webpack-dev-server']) || !isset($parsed['webpack-dev-server']['port'])) {
            throw new Exception("
                package.json file in $moduleName must have a webpack-dev-server.port setting.
            ");
        }
        $this->module = $module;
        $this->port = $parsed['webpack-dev-server']['port'];
    }

    /**
     * @return bool
     */
    public function isActive()
    {
        return Director::isDev() && !!@fsockopen('localhost', $this->port, $errno, $errstr, 1);
    }

    /**
     * @param $path
     */
    public function loadCSS($path)
    {
        if ($this->isActive()) {
            return;
        }

        Requirements::css(
            $this->module->getResourcePath($path)
        );
    }

    /**
     * @param $path
     */
    public function loadJavascript($path)
    {
        if ($this->isActive()) {
            $path = sprintf(
                '%:%s/%s',
                'http://localhost',
                $this->port,
                $this->module->getResourcePath($path)
            );
        }

        Requirements::javascript($this->module->getResourcePath($path));
    }
}