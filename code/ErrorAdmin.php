<?php

namespace SilverStripe\Admin;

use SilverStripe\Control\Controller;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\ORM\ArrayList;
use SilverStripe\View\ArrayData;

class ErrorAdmin extends LeftAndMain
{

    private static $menu_title = 'Error';

    private static $url_handlers = [
        '$*' => 'index'
    ];

    /**
     * @param HTTPRequest $request
     * @return HTTPResponse
     */
    public function index($request)
    {
        return $this->getResponseNegotiator()->respond($request);
    }

    public function Link($action = null)
    {
        $link = AdminRootController::admin_url();
        $this->extend('updateLink', $link);
        return $link;
    }
    
}
