<?php

namespace SilverStripe\Admin\Webpack;

interface WebpackInterface
{

    public function isActive();

    public function loadCSS($path);

    public function loadJavascript();
}