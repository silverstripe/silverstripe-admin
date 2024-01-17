<?php

namespace SilverStripe\Admin;

use SilverStripe\Control\Controller;
use SilverStripe\Control\Director;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\RequestHandler;
use SilverStripe\Core\Extension;

/**
 * @extends Extension<RequestHandler>
 */
class AdminErrorExtension extends Extension
{
    /**
     * Used by {@see RequestHandler::httpError}
     */
    public function onBeforeHTTPError($statusCode, HTTPRequest $request, $errorMessage = null)
    {
        $controller = $this->getAdminController();
        if (!$controller || Director::is_ajax($request) || $errorMessage === null) {
            return;
        }
        $controller->setHttpErrorMessage($errorMessage);
    }

    private function getAdminController(): ?Controller
    {
        if ($this->owner instanceof LeftAndMain) {
            return $this->owner;
        }
        if (Controller::has_curr() && (Controller::curr() instanceof LeftAndMain)) {
            return Controller::curr();
        }
        return null;
    }
}
