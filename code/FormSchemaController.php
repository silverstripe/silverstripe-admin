<?php

namespace SilverStripe\Admin;

use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\Validation\ValidationResult;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\HTMLEditor\HTMLEditorConfig;
use SilverStripe\Forms\HTMLEditor\TinyMCEConfig;
use SilverStripe\Forms\Schema\FormSchema;
use SilverStripe\Security\Security;

/**
 * The base class for controllers in the CMS that need access to form schema functionality.
 */
abstract class FormSchemaController extends AdminController
{
    /**
     * Form schema header identifier
     */
    public const SCHEMA_HEADER = 'X-Formschema-Request';

    private static array $allowed_actions = [
        'schema',
    ];

    private static array $url_handlers = [
        'GET schema/$FormName/$ItemID/$OtherItemID' => 'schema',
    ];

    private static array $dependencies = [
        'FormSchema' => '%$' . FormSchema::class,
    ];

    /**
     * Current form schema helper
     */
    private ?FormSchema $schema = null;

    protected function init()
    {
        $this->beforeExtending('onInit', function () {
            $this->prepareTinyMce();
        });
        parent::init();
    }

    /**
     * Get the form schema helper for this controller
     */
    public function getFormSchema(): FormSchema
    {
        if (!$this->schema) {
            $this->schema = FormSchema::singleton();
        }
        return $this->schema;
    }

    /**
     * Set the form schema helper for this controller
     */
    public function setFormSchema(FormSchema $schema): static
    {
        $this->schema = $schema;
        return $this;
    }

    /**
     * Gets a JSON schema representing a form.
     */
    public function schema(HTTPRequest $request): HTTPResponse
    {
        $formName = $request->param('FormName');
        $itemID = $request->param('ItemID');

        if (!$formName) {
            $this->jsonError(400, 'Missing request params');
        }

        // Most usages of this method (e.g. AssetAdmin) have two methods - one method is
        // named the same as the form, and does not accept a parameter - the other prefixed
        // with "get" and accepts an $itemID parameter.
        // Some usages exclude the getter method, so we need to check for both.
        $formMethod = "get{$formName}";
        if (!$this->hasMethod($formMethod)) {
            $formMethod = $formName;
            if (!$this->hasMethod($formMethod)) {
                $this->jsonError(404, 'Form not found');
            }
        }

        if (!$this->hasAction($formName)) {
            $this->jsonError(401, 'Form not accessible');
        }

        if ($itemID) {
            $form = $this->{$formMethod}($itemID);
        } else {
            $form = $this->{$formMethod}();
        }
        $schemaID = $request->getURL();
        return $this->getSchemaResponse($schemaID, $form);
    }

    /**
     * Generate schema for the given form based on the X-Formschema-Request header value
     *
     * @param string $schemaID ID for this schema. Required.
     * @param Form|null $form Required for 'state' or 'schema' response
     * @param ValidationResult $errors Required for 'error' response
     * @param array $extraData Any extra data to be merged with the schema response
     */
    public function getSchemaResponse(string $schemaID, ?Form $form = null, ValidationResult $errors = null, array $extraData = []): HTTPResponse
    {
        $parts = $this->getRequest()->getHeader(static::SCHEMA_HEADER);
        $data = $this
            ->getFormSchema()
            ->getMultipartSchema($parts, $schemaID, $form, $errors);

        if ($extraData) {
            $data = array_merge($data, $extraData);
        }

        $response = new HTTPResponse(json_encode($data));
        $response->addHeader('Content-Type', 'application/json');
        return $response;
    }

    /**
     * Check if the current request has a X-Formschema-Request header set.
     * Used by conditional logic that responds to validation results
     */
    protected function getSchemaRequested(): bool
    {
        $parts = $this->getRequest()->getHeader(static::SCHEMA_HEADER);
        return !empty($parts);
    }

    private function prepareTinyMce(): void
    {
        // Set the members html editor config
        if (Security::getCurrentUser()) {
            HTMLEditorConfig::set_active_identifier(Security::getCurrentUser()->getHtmlEditorConfigForCMS());
        }

        // Set default values in the config if missing.  These things can't be defined in the config
        // file because insufficient information exists when that is being processed
        $htmlEditorConfig = HTMLEditorConfig::get_active();
        $htmlEditorConfig->setOption('language', TinyMCEConfig::get_tinymce_lang());
        $langUrl = TinyMCEConfig::get_tinymce_lang_url();
        if ($langUrl) {
            $htmlEditorConfig->setOption('language_url', $langUrl);
        }
    }
}
