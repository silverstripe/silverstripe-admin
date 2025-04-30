<?php

namespace SilverStripe\Admin;

use SilverStripe\Admin\Forms\EditorEmailLinkFormFactory;
use SilverStripe\Admin\Forms\EditorExternalLinkFormFactory;
use SilverStripe\Control\Controller;
use SilverStripe\Control\RequestHandler;
use SilverStripe\Dev\Deprecation;
use SilverStripe\Forms\Form;

/**
 * Parent controller for all CMS-global modals
 */
class ModalController extends RequestHandler
{
    private static $allowed_actions = [
        'EditorExternalLink',
        'EditorEmailLink',
    ];

    public function Link($action = null)
    {
        return Controller::join_links(
            $this->getController()->Link(),
            $this->getName(),
            $action,
            '/'
        );
    }

    /**
     * @var Controller
     * @deprecated 2.4.0 Will be removed without equivalent functionality to replace it in a future major release
     */
    protected $controller;

    /**
     * @var string
     * @deprecated 2.4.0 Will be removed without equivalent functionality to replace it in a future major release
     */
    protected $name;

    public function __construct($controller, $name)
    {
        parent::__construct();

        $this->controller = $controller;
        $this->name = $name;
    }

    public function getRequest()
    {
        return $this->controller->getRequest();
    }

    /**
     * @return Controller
     * @deprecated 2.4.0 Will be removed without equivalent functionality to replace it in a future major release
     */
    public function getController()
    {
        Deprecation::noticeWithNoReplacment('2.4.0');
        return $this->controller;
    }

    /**
     * Get urlsegment
     *
     * @return string
     * @deprecated 2.4.0 Will be removed without equivalent functionality to replace it in a future major release
     */
    public function getName()
    {
        Deprecation::noticeWithNoReplacment('2.4.0');
        return $this->name;
    }

    /**
     * Builds and returns the external link form
     *
     * @return Form
     * @deprecated 2.4.0 Will be replaced with linkModalForm() in a future major release
     */
    public function EditorExternalLink()
    {
        Deprecation::noticeWithNoReplacment('2.4.0', 'Will be replaced with linkModalForm() in a future major release');
        // Show link text field if requested
        $showLinkText = $this->controller->getRequest()->getVar('requireLinkText');
        $factory = EditorExternalLinkFormFactory::singleton();
        return $factory->getForm(
            $this->controller,
            "{$this->name}/EditorExternalLink",
            [ 'RequireLinkText' => isset($showLinkText) ]
        );
    }

    /**
     * Builds and returns the external link form
     *
     * @return Form
     * @deprecated 2.4.0 Will be replaced with linkModalForm() in a future major release
     */
    public function EditorEmailLink()
    {
        Deprecation::noticeWithNoReplacment('2.4.0', 'Will be replaced with linkModalForm() in a future major release');
        // Show link text field if requested
        $showLinkText = $this->controller->getRequest()->getVar('requireLinkText');
        $factory = EditorEmailLinkFormFactory::singleton();
        return $factory->getForm(
            $this->controller,
            "{$this->name}/EditorEmailLink",
            [ 'RequireLinkText' => isset($showLinkText) ]
        );
    }
}
