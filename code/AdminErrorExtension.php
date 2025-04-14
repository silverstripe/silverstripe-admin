<?php

namespace SilverStripe\Admin;

use SilverStripe\Control\Controller;
use SilverStripe\Control\Director;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\RequestHandler;
use SilverStripe\Core\Extension;
use SilverStripe\Admin\AdminController;

/**
 * @extends Extension<RequestHandler>
 */
class AdminErrorExtension extends Extension
{
    /**
     * Used by {@see RequestHandler::httpError}
     */
    protected function onBeforeHTTPError($statusCode, HTTPRequest $request, $errorMessage = null)
    {
        $controller = $this->getAdminController();
        if (!$controller || Director::is_ajax($request) || $errorMessage === null) {
            return;
        }
        $controller->setHttpErrorMessage($errorMessage);
    }

    private function getAdminController(): ?Controller
    {
        if ($this->owner instanceof AdminController) {
            return $this->owner;
        }
        $controller = Controller::curr();
        if ($controller instanceof AdminController) {
            return $controller;
        }
        return null;
    }
}
