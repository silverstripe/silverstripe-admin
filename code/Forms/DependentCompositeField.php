<?php

namespace SilverStripe\Admin\Forms;

use InvalidArgumentException;
use LogicException;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Control\NullHTTPRequest;
use SilverStripe\Core\ArrayLib;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Core\Validation\FieldValidation\CompositeFieldValidator;
use SilverStripe\Forms\ChildFieldManager;
use SilverStripe\Forms\CompositeField;
use SilverStripe\Forms\ConfirmedPasswordField;
use SilverStripe\Forms\FieldSetTrait;
use SilverStripe\Forms\FormField;
use SilverStripe\Forms\MoneyField;

/**
 * A composite field that displays and updates children fields based on the values of other children
 *
 * @internal For now this only works with react children, and in react forms. Use of this field outside
 * of supported modules should be avoided as we may need to change how it works to get it working in
 * non-react forms
 */
class DependentCompositeField extends FormField implements ChildFieldManager
{
    use FieldSetTrait;

    /**
     * FormField classes that cannot be used as children of this field.
     *
     * Basically this is any composite-like field which handles its own children,
     * since the onchange handler would be on the child field but we only know about
     * the parent field name.
     */
    private static array $disallowed_field_types = [
        CompositeField::class,
        ConfirmedPasswordField::class,
        DependentCompositeField::class,
        MoneyField::class,
    ];

    private static array $field_validators = [
        CompositeFieldValidator::class,
    ];

    private static array $allowed_actions = [
        'getUpdatedChildrenSchema',
    ];

    protected $schemaDataType = FormField::SCHEMA_DATA_TYPE_STRUCTURAL_CUSTOM;

    protected $schemaComponent = 'DependentCompositeField';

    /**
     * @var array<FormField>
     */
    private array $children = [];

    /**
     * Per-request caching of the results of getChildren() for this instance of the form field.
     * Prevents dependency callbacks from being called unnecessarily.
     */
    private bool $childrenAreCached = false;

    /**
     * Map of field names to callbacks.
     * @see DependentCompositeField::setDependencyCallbacks() for details.
     */
    private array $dependencyCallbacks = [];

    /**
     * @see DependentCompositeField::setSessionPrefix()
     */
    private string $sessionPrefix;

    /**
     * @param string $name Name of the form field
     * @param string $sessionPrefix Unique prefix to separate this from other DependentCompositeFields in session data
     * @param array<FormField> $children FormField instances representing the initial state of this field.
     * All fields referenced in the dependency map must be included.
     * Child fields must not be any of the types in disallowed_field_types.
     * @param array<string,array> $dependencyCallbacks Associative array of callbacks to manage changes to dependant fields.
     * @see DependentCompositeField::setDependencyCallbacks()
     */
    public function __construct(string $name, string $sessionPrefix, array $children, array $dependencyCallbacks = [])
    {
        parent::__construct($name, false);
        $this->setSessionPrefix($sessionPrefix);
        $this->setChildren($children);
        if (!empty($dependencyCallbacks)) {
            $this->setDependencyCallbacks($dependencyCallbacks);
        }
    }

    /**
     * Get the associative array of dependency callbacks.
     * @see DependentCompositeField::setDependencyCallbacks() for details.
     */
    public function getDependencyCallbacks(): array
    {
        return $this->dependencyCallbacks;
    }

    /**
     * Set the dependency callbacks.
     *
     * Both the dependant field and all of its dependencies must be present in this field - use hidden fields when
     * adding the fields in the constructor if you don't want the field displayed initially.
     *
     * @param array<string,array> $dependencyCallbacks Associative array with dependant field names as keys
     * and an associative array of dependency data as the values. The dependency data has two keys:
     * "callback" which has a callable value (see addDependencyCallback() for the callable signature).
     * "fields" which has an indexed array of field names. When any of these fields' values are update this will cause the callback to be called.
     * @see DependentCompositeField::addDependencyCallback() for additional details.
     */
    public function setDependencyCallbacks(array $dependencyCallbacks): static
    {
        $this->dependencyCallbacks = [];
        foreach ($dependencyCallbacks as $dependantFieldName => $dependencyData) {
            $callback = $dependencyData['callback'] ?? null;
            if (!is_callable($callback)) {
                throw new InvalidArgumentException('Callback must be callable for dependant ' . $dependantFieldName);
            }
            $this->addDependencyCallback($dependantFieldName, $dependencyData['fields'] ?? [], $callback);
        }
        return $this;
    }

    /**
     * Add a dependency callback for a dependant field. Overrides any previous callback and dependencies for this dependant.
     *
     * Both the dependant field and all of its dependencies must be present in this field - use hidden fields when
     * adding the fields in the constructor if you don't want the field displayed initially.
     *
     * When any of the fields named in $dependencyFieldNames has its value updated, the callback will be called
     * to update the dependant form field.
     *
     * @param callable(array<string,FormField>$dependencyFields,FormField $originalField):?FormField $callback
     * A callback to update the dependant form field based on the changes in the dependency fields.
     * Can either return a new FormField instance (e.g. to change the type of form field entirely) or return null if
     * updating the existing form field (e.g. to update the source in a DropdownField).
     * The name of any returned field must match the name of the original field.
     * If the value should be carried over from the original field to the new one, this must be done in the callback.
     * Returned fields must not be any of the types in disallowed_field_types.
     */
    public function addDependencyCallback(string $dependantFieldName, array $dependencyFieldNames, callable $callback): static
    {
        if (empty($dependantFieldName)) {
            throw new InvalidArgumentException('Must provide a dependant field name');
        }
        if (empty($dependencyFieldNames)) {
            throw new InvalidArgumentException('Must provide an array of dependency field names for dependant ' . $dependantFieldName);
        }
        if (!array_key_exists($dependantFieldName, $this->children)) {
            throw new InvalidArgumentException("No field named {$dependantFieldName} for dependant field");
        }
        foreach ($dependencyFieldNames as $dependencyFieldName) {
            if ($dependantFieldName === $dependencyFieldName) {
                throw new InvalidArgumentException("Field {$dependantFieldName} must not depend on itself");
            }
            if (!array_key_exists($dependencyFieldName, $this->children)) {
                throw new InvalidArgumentException("No field named {$dependencyFieldName} for dependency field");
            }
            // Dependants must be after their dependencies or updates don't work the way we expect.
            // This also helps to protect against cyclical dependencies.
            $childFieldOrder = array_keys($this->children);
            if (array_search($dependantFieldName, $childFieldOrder) < array_search($dependencyFieldName, $childFieldOrder)) {
                throw new InvalidArgumentException("Dependant field {$dependantFieldName} must be after its dependency {$dependencyFieldName}");
            }
        }
        $this->dependencyCallbacks[$dependantFieldName] = [
            'fields' => $dependencyFieldNames,
            'callback' => $callback,
        ];
        $this->childrenAreCached = false;
        return $this;
    }

    /**
     * @inheritDoc
     */
    public function getValueForValidation(): mixed
    {
        return $this->getChildren();
    }

    /**
     * This action is called from the react component to get the updated form schema and state
     * of all child fields after updating a field value.
     */
    public function getUpdatedChildrenSchema(HTTPRequest $request): HTTPResponse
    {
        // Validate request has all the data we need
        $response = HTTPResponse::create();
        $response->addHeader('Content-Type', 'application/json');
        $values = $request->requestVar('origValues');
        if (!ArrayLib::is_associative($values)) {
            $response->setStatusCode(400);
            $response->setBody(json_encode(['message' => 'Invalid or missing origValues']));
            return $response;
        }
        $updatedField = $request->requestVar('fieldName');
        if (empty($updatedField) || !is_string($updatedField) || !array_key_exists($updatedField, $this->children)) {
            $response->setStatusCode(400);
            $response->setBody(json_encode(['message' => 'Invalid or missing fieldName']));
            return $response;
        }
        // No validation needed for newValue - could be anything or even null.
        $newValue = $request->requestVar('newValue');

        // Store the original values and value change into the session.
        // This allows getChildren() to update correctly both immediately and also during child field AJAX requests,
        // e.g. for TreeDropdownField's 'tree' request.
        $request->getSession()->set($this->getSessionName(), ['origValues' => $values, 'fieldName' => $updatedField, 'newValue' => $newValue]);
        $this->childrenAreCached = false;

        $schema = [];
        $state = [];
        foreach ($this->getChildren() as $childField) {
            $schema[] = $childField->getSchemaData();
            $state[] = $childField->getSchemaState();
        }
        $response->setBody(json_encode([
            'schema' => $schema,
            'state' => ['fields' => $state],
        ]));
        return $response;
    }

    /**
     * @inheritDoc
     */
    public function getSchemaDataDefaults(): array
    {
        $defaults = parent::getSchemaDataDefaults();
        $children = $this->getChildren();
        foreach ($children as $child) {
            $childSchema[] = $child->getSchemaData();
        }
        $defaults['children'] = $childSchema;

        $defaults['data']['tag'] = $this->getTag();
        $defaults['data']['legend'] = $this->getLegend();
        $defaults['data']['updateChildrenURL'] = $this->Link('getUpdatedChildrenSchema');

        // Scaffolded children will supposedly inherit this data (see CompositeField::getSchemaDataDefaults())
        $defaults['data']['inherited'] = [
            'data' => [
                'fieldholder' => 'small'
            ],
        ];
        return $defaults;
    }

    /**
     * @inheritDoc
     */
    public function setForm($form)
    {
        parent::setForm($form);
        foreach ($this->getChildren() as $field) {
            $field->setForm($form);
        }
        return $this;
    }

    /**
     * @inheritDoc
     */
    public function setDisabled($disabled)
    {
        parent::setDisabled($disabled);
        foreach ($this->getChildren() as $child) {
            $child->setDisabled($disabled);
        }
        return $this;
    }

    /**
     * @inheritDoc
     */
    public function setReadonly($readonly)
    {
        parent::setReadonly($readonly);
        foreach ($this->getChildren() as $child) {
            $child->setReadonly($readonly);
        }
        return $this;
    }

    /**
     * @inheritDoc
     */
    public function performDisabledTransformation()
    {
        $returnField = clone $this;
        $returnField->setDisabled(true);
        return $returnField;
    }

    /**
     * @inheritDoc
     */
    public function performReadOnlyTransformation()
    {
        $returnField = clone $this;
        $returnField->setReadonly(true);
        return $returnField;
    }

    /**
     * Get the unique name prefix for storing data for this field in the session.
     * Note that the full name used includes additional information, such as the name of this field
     * and the names of the child fields.
     */
    public function getSessionPrefix(): string
    {
        return $this->sessionPrefix;
    }

    /**
     * Set the unique name prefix for storing data for this field in the session.
     * Note that the full name used includes additional information, such as the name of this field
     * and the names of the child fields.
     */
    public function setSessionPrefix(string $sessionPrefix): static
    {
        $this->sessionPrefix = $sessionPrefix;
        return $this;
    }

    public function __clone(): void
    {
        $newChildren = [];
        // Note: Explicitly don't call getChildren() here - we want the original children
        // if no transformations have happened yet
        foreach ($this->children as $child) {
            $newChildren[] = clone $child;
        }
        $this->setChildren($newChildren);
    }

    /**
     * @inheritDoc
     */
    public function isManagedField(string $fieldName): bool
    {
        return array_key_exists($fieldName, $this->children);
    }

    /**
     * @inheritDoc
     */
    public function getManagedFieldByName(string $fieldName): ?FormField
    {
        return $this->getChildren()[$fieldName] ?? null;
    }

    /**
     * @inheritDoc
     */
    public function getManagedFields(): iterable
    {
        return $this->getChildren();
    }

    /**
     * @inheritDoc
     */
    public function hasData()
    {
        // This field doesn't have its own data - it exposes its child fields
        // for data fetching/setting via the ChildFieldManager methods.
        return false;
    }

    /**
     * Set the child fields prior to being updated by dependency callbacks.
     * This represents their initial state.
     *
     * This is private to avoid mismatches between the child fields and the dependency callbacks.
     * If you want to set children after instantiation, you will need to instantiate a new field instead.
     */
    private function setChildren(array $children): static
    {
        if (empty($children)) {
            throw new InvalidArgumentException('$children must not be empty as this cannot be set after instantiation.');
        }
        $this->children = [];
        $disallowedFieldTypes = static::config()->get('disallowed_field_types') ?? [];
        foreach ($children as $child) {
            $childName = $child->getName();
            foreach ($disallowedFieldTypes as $disallowedClassName) {
                if (is_a($child, $disallowedClassName)) {
                    throw new InvalidArgumentException(
                        "The child field named {$childName} must not be an instance of {$disallowedClassName}"
                    );
                }
            }
            if (array_key_exists($childName, $this->children)) {
                throw new InvalidArgumentException("The child field named {$childName} appeared twice.");
            }
            $child->setForm($this->getForm());
            $this->children[$childName] = $child;
        }
        return $this;
    }

    /**
     * Get the child fields after being updated by dependency callbacks.
     * This value is cached after the first call to prevent unnecessary repeated calls to potentially
     * computationally expensive callbacks.
     *
     * Avoid calling this before the form has been set as caching doesn't kick in without the form.
     */
    private function getChildren(): array
    {
        $children = $this->children;
        if ($this->childrenAreCached) {
            return $children;
        }
        $values = [];
        // Update from session data if available.
        // This is needed so we can safely use dataValue() to get raw values from the correct old form fields
        // into the new ones as needed within the callbacks.
        // For example the value for SearchableDropdownField will be a weird associative array
        // instead of a raw ID value.
        $form = $this->getForm();
        $baseURL = $form?->FormAction();
        $request = $this->getRequestForSession();
        if ($baseURL && $request?->hasSession() && str_starts_with($request->getURL(), $baseURL)) {
            $session = $request->getSession();
            $sessionName = $this->getSessionName();
            $sessionData = $session->get($sessionName) ?? [];
            // If we stored state for the children fields in the session, update $children
            // so that we match the previous state.
            // This is needed to ensure we are calling setSubmittedValue() on the right field type to set the most recent value.
            if (!empty($sessionData)) {
                $values = $sessionData['origValues'];
                foreach ($children as $fieldName => $childField) {
                    if (array_key_exists($fieldName, $values)) {
                        $childField->setSubmittedValue($values[$fieldName]);
                    }
                }
                $this->updateDependantFields($children, $values);
                // After updating to the previous state, set value on the field that was most recently updated
                // This will allow us to update to the _current_ state.
                $children[$sessionData['fieldName']]->setSubmittedValue($sessionData['newValue']);
            }
        }
        // Update from the previous state to the current state
        $this->updateDependantFields($children);
        // If we have a valid form, cache these children for later.
        // If the form wasn't set yet, these children may not represent the most up to date
        // stored in the session which could cause problems - so we'll let that sort itself out
        // after the form has been set.
        if ($baseURL) {
            $this->children = $children;
            $this->childrenAreCached = true;
        }
        return $children;
    }

    /**
     * Update the $children array in place by calling the dependency callbacks.
     * Optionally sets values for fields after updating them.
     */
    private function updateDependantFields(array &$children, array $values = []): void
    {
        $callbacks = $this->getDependencyCallbacks();
        // Run callbacks in child field order so that updated fields can be reliably
        // passed into subsequent callbacks
        foreach ($children as $fieldName => $originalDependant) {
            if (!array_key_exists($fieldName, $callbacks)) {
                continue;
            }
            $dependencyData = $callbacks[$fieldName];
            $callback = $dependencyData['callback'];
            $dependencyFields = [];
            foreach ($dependencyData['fields'] as $dependencyFieldName) {
                $dependencyFields[$dependencyFieldName] = $children[$dependencyFieldName];
            }
            $newDependant = $this->getUpdatedDependantField($callback, $originalDependant, $dependencyFields);
            if ($newDependant) {
                if (!empty($values[$fieldName])) {
                    $newDependant->setSubmittedValue($originalDependant->dataValue());
                }
                $children[$fieldName] = $newDependant;
            }
        }
    }

    /**
     * Use the dependency callback to get an updated dependant field.
     * If the original field should be retained, returns null.
     */
    private function getUpdatedDependantField(callable $callback, FormField $originalDependant, array $dependencyFields): ?FormField
    {
        $newDependant = call_user_func($callback, $dependencyFields, $originalDependant);
        // If we got a new different formfield, we need to validate it and replace the old one.
        if ($newDependant && $newDependant !== $originalDependant) {
            $dependantFieldName = $originalDependant->getName();
            // Make sure we didn't change into a disallowed field type
            $disallowedFieldTypes = static::config()->get('disallowed_field_types') ?? [];
            foreach ($disallowedFieldTypes as $disallowedClassName) {
                if (is_a($newDependant, $disallowedClassName)) {
                    throw new LogicException(
                        "The child field named {$dependantFieldName} must not be an instance of {$disallowedClassName}."
                    );
                }
            }
            if (!is_a($newDependant, FormField::class)) {
                throw new LogicException("Return from callback for $dependantFieldName must be a subclass of FormField, or null if the same formfield is to be used");
            }
            if ($newDependant->getName() !== $dependantFieldName) {
                // We could just set it for them but if they're trying to do something specific it's better to
                // outright tell them this isn't allowed rather than silently not doing what they expected.
                throw new LogicException("Return from callback for $dependantFieldName must have the same name as the field it is replacing. Got {$newDependant->getName()} instead");
            }
            if ($this->isReadonly()) {
                $newDependant->setReadonly(true);
            }
            if ($this->isDisabled()) {
                $newDependant->setDisabled(true);
            }
            $newDependant->setForm($this->getForm());
            return $newDependant;
        }
        return null;
    }

    /**
     * Get the request for getting/fetching session data.
     * Note that for any other purpose, the regular getSession()
     * method should be used.
     */
    private function getRequestForSession(): ?HTTPRequest
    {
        $request = $this->getRequest();
        if (!$request || is_a($request, NullHTTPRequest::class)) {
            $request = $this->getForm()?->getRequestHandler()->getRequest();
        }
        if ((!$request || is_a($request, NullHTTPRequest::class)) && Injector::inst()->has(HTTPRequest::class)) {
            $request = Injector::inst()->get(HTTPRequest::class);
        }
        return $request;
    }

    /**
     * Get the name used to store data for this field in the session.
     */
    private function getSessionName(): string
    {
        $fieldNamePart = md5(implode('_', array_keys($this->children)));
        return $this->getSessionPrefix() . "_{$this->ID()}_{$fieldNamePart}";
    }
}
