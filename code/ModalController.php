<?php

namespace SilverStripe\Admin;

use SilverStripe\Admin\Forms\EditorEmailLinkFormFactory;
use SilverStripe\Admin\Forms\EditorExternalLinkFormFactory;
use SilverStripe\Forms\Form;

/**
 * Parent controller for all CMS-global modals
 */
class ModalController extends FormSchemaController
{
    private static ?string $url_segment = 'modals';

    private static $allowed_actions = [
        'EditorExternalLink',
        'EditorEmailLink',
    ];

    private static string $required_permission_codes = 'CMS_ACCESS';

    /**
     * Builds and returns the external link form
     */
    public function EditorExternalLink(): Form
    {
        // Show link text field if requested
        $showLinkText = $this->getRequest()->getVar('requireLinkText');
        $factory = EditorExternalLinkFormFactory::singleton();
        return $factory->getForm(
            $this,
            __FUNCTION__,
            [ 'RequireLinkText' => isset($showLinkText) ]
        );
    }

    /**
     * Builds and returns the external link form
     */
    public function EditorEmailLink(): Form
    {
        // Show link text field if requested
        $showLinkText = $this->getRequest()->getVar('requireLinkText');
        $factory = EditorEmailLinkFormFactory::singleton();
        return $factory->getForm(
            $this,
            __FUNCTION__,
            [ 'RequireLinkText' => isset($showLinkText) ]
        );
    }
}
