<?php

namespace SilverStripe\Admin\Webpack;

use SilverStripe\Core\Manifest\Module;

class ModulePackageJSONLoader
{
    protected $data;

    public function __construct(Module $module)
    {
        if (!$module->hasResource('package.json')) {
            throw new Exception("
                Cannot run Webpack on module $moduleName with no package.json in the module root.
            ");
        }
        $packageJSON = @file_get_contents(
            BASE_PATH . '/' . $module->getResourcePath('package.json')
        );

        $parsed = json_decode($packageJSON, true);

        if (!$parsed) {
            throw new Exception('Invalid package.json file in ' . $moduleName);
        }

        $this->data = $parsed;
    }

    public function get
}