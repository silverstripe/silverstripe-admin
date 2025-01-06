<?php

namespace SilverStripe\Admin;

use LogicException;
use SilverStripe\Admin\Forms\EditorEmailLinkFormFactory;
use SilverStripe\Admin\Forms\EditorExternalLinkFormFactory;
use SilverStripe\Admin\Forms\LinkFormFactory;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Forms\Form;

/**
 * Parent controller for all CMS-global modals
 */
class ModalController extends FormSchemaController
{
    private static ?string $url_segment = 'modals';

    private static string $required_permission_codes = 'CMS_ACCESS';

    private static array $allowed_actions = [
        'linkModalForm',
        'linkModalFormSchema',
    ];

    private static array $url_handlers = [
        'linkModalForm/$ModalName/$ItemID' => 'linkModalForm',
        'GET linkModalFormSchema/$ModalName/$ItemID' => 'linkModalFormSchema',
    ];

    /**
     * Associative array of modal form names to form factory classes.
     * Used primarily to register modal form factories for use in the WYSIWYG link plugin.
     * Form factories must subclass LinkFormFactory
     */
    private static array $link_modal_form_factories = [
        'EditorExternalLink' => EditorExternalLinkFormFactory::class,
        'EditorEmailLink' => EditorEmailLinkFormFactory::class,
    ];

    /**
     * Get a link modal form built from a factory.
     * Intended to be used in conjunction with linkModalFormSchema()
     */
    public function linkModalForm(HTTPRequest $request): Form
    {
        $modalName = $request->param('ModalName');
        $itemID = $request->param('ItemID');
        if ($modalName === null || $itemID === null) {
            $this->jsonError(400, 'Missing request params');
        }
        $modalForms = static::config()->get('link_modal_form_factories');
        if (!array_key_exists($modalName, $modalForms)) {
            $this->httpError(400);
        }
        // Show link text field if requested
        $showLinkText = $this->getRequest()->getVar('requireLinkText');
        $class = $modalForms[$modalName];
        if (!is_a($class, LinkFormFactory::class, true)) {
            throw new LogicException("Factory for '$modalName' must be a subclass of " . LinkFormFactory::class);
        }

        // Build the form
        /** @var LinkFormFactory $factory */
        $factory = Injector::inst()->get($class);
        $form = $factory->getForm(
            $this,
            'linkModalForm/'.$modalName,
            [
                'RequireLinkText' => isset($showLinkText),
                'ItemID' => $itemID,
            ]
        );
        // Set url handler that handles ItemID param correctly
        $form->setRequestHandler(
            LeftAndMainFormRequestHandler::create($form, [$itemID])
        );
        return $form;
    }

    /**
     * Gets a JSON schema representing a link modal form.
     * Links to this must include the ID of the current record or 0
     * e.g ModalController::singleton()->Link('linkModalFormSchema/myModalForm/:pageid')
     */
    public function linkModalFormSchema(HTTPRequest $request): HTTPResponse
    {
        $form = $this->linkModalForm($request);
        $schemaID = $request->getURL();
        return $this->getSchemaResponse($schemaID, $form);
    }
}
