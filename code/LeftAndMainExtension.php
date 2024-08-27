<?php

namespace SilverStripe\Admin;

use SilverStripe\Core\Extension;
use SilverStripe\Dev\Deprecation;

/**
 * Plug-ins for additional functionality in your LeftAndMain classes.
 *
 * @template T of LeftAndMain
 * @extends Extension<T>
 * @deprecated 2.3.0 Subclass SilverStripe\Core\Extension\Extension instead
 */
abstract class LeftAndMainExtension extends Extension
{
    public function __construct()
    {
        // Wrapping with Deprecation::withNoReplacement() to avoid triggering deprecation notices
        // as we are unable to update existing subclasses of this class until a new major
        // unless we add in the pointless empty methods that are in this class
        Deprecation::withNoReplacement(function () {
            $class = Extension::class;
            Deprecation::notice('2.3.0', "Subclass $class instead", Deprecation::SCOPE_CLASS);
        });
        parent::__construct();
    }

    protected function onInit()
    {
    }

    protected function accessedCMS()
    {
    }

    protected function augmentNewSiteTreeItem(&$item)
    {
    }
}
