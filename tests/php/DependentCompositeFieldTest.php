<?php

namespace SilverStripe\Admin\Tests;

use InvalidArgumentException;
use LogicException;
use PHPUnit\Framework\Attributes\DataProvider;
use ReflectionMethod;
use ReflectionProperty;
use SilverStripe\Admin\Forms\DependentCompositeField;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\Session;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Dev\SapphireTest;
use SilverStripe\Forms\ConfirmedPasswordField;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormField;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\TextField;
use stdClass;

class DependentCompositeFieldTest extends SapphireTest
{
    protected $usesDatabase = false;

    public static function provideSetChildren(): array
    {
        return [
            'no children passed' => [
                'childFieldSpecs' => [],
                'expectedException' => '$children must not be empty as this cannot be set after instantiation.',
            ],
            'disallowed field type' => [
                'childFieldSpecs' => [[
                    'class' => ConfirmedPasswordField::class,
                    'name' => 'MyPasswordField',
                ]],
                'expectedException' => 'The child field named MyPasswordField must not be an instance of '
                    . ConfirmedPasswordField::class,
            ],
            'duplicated field name' => [
                'childFieldSpecs' => [
                    [
                        'class' => TextField::class,
                        'name' => 'FieldOne',
                    ],
                    [
                        'class' => LiteralField::class,
                        'name' => 'FieldTwo',
                    ],
                    [
                        'class' => HiddenField::class,
                        'name' => 'FieldOne',
                    ],
                ],
                'expectedException' => 'The child field named FieldOne appeared twice.',
            ],
            'golden path' => [
                'childFieldSpecs' => [
                    [
                        'class' => TextField::class,
                        'name' => 'FieldOne',
                    ],
                    [
                        'class' => LiteralField::class,
                        'name' => 'FieldTwo',
                    ],
                    [
                        'class' => HiddenField::class,
                        'name' => 'FieldThree',
                    ],
                ],
                'expectedException' => '',
            ],
        ];
    }

    #[DataProvider('provideSetChildren')]
    public function testSetChildren(array $childFieldSpecs, string $expectedException): void
    {
        $childFields = [];
        $childFieldNames = [];
        $childFieldClasses = [];
        foreach ($childFieldSpecs as $fieldSpec) {
            $childFields[] = new $fieldSpec['class']($fieldSpec['name'], '');
            $childFieldNames[] = $fieldSpec['name'];
            $childFieldClasses[$fieldSpec['name']] = $fieldSpec['class'];
        }
        if ($expectedException) {
            $this->expectException(InvalidArgumentException::class);
            $this->expectExceptionMessage($expectedException);
        }
        // setChildren is called by the constructor.
        // Easier to just pass these into the constructor than to use reflection to call the private method.
        $field = new DependentCompositeField('MyCompositeField', 'MySessionPrefix', $childFields);
        // Check the fields in the private $children property to avoid this test failing if getChildren() has some problem
        $reflectionChildren = new ReflectionProperty($field, 'children');
        $children = $reflectionChildren->getValue($field);
        $this->assertSame($childFieldNames, array_keys($children));
        foreach ($children as $fieldName => $childField) {
            $this->assertSame($fieldName, $childField->getName());
            $this->assertInstanceOf($childFieldClasses[$fieldName], $childField);
        }
    }

    public static function provideAddDependencyCallback(): array
    {
        return [
            'empty field name' => [
                'dependantFieldName' => '',
                'dependencyFieldNames' => ['FieldOne'],
                'expectedException' => 'Must provide a dependant field name',
            ],
            'empty dependency fields' => [
                'dependantFieldName' => 'FieldOne',
                'dependencyFieldNames' => [],
                'expectedException' => 'Must provide an array of dependency field names for dependant FieldOne',
            ],
            'missing dependant field' => [
                'dependantFieldName' => 'FieldZero',
                'dependencyFieldNames' => ['FieldOne'],
                'expectedException' => 'No field named FieldZero for dependant field',
            ],
            'missing dependency field' => [
                'dependantFieldName' => 'FieldOne',
                'dependencyFieldNames' => ['FieldZero'],
                'expectedException' => 'No field named FieldZero for dependency field',
            ],
            'field depends on itself' => [
                'dependantFieldName' => 'FieldOne',
                'dependencyFieldNames' => ['FieldOne'],
                'expectedException' => 'Field FieldOne must not depend on itself',
            ],
            'dependant comes before dependency' => [
                'dependantFieldName' => 'FieldOne',
                'dependencyFieldNames' => ['FieldTwo'],
                'expectedException' => 'Dependant field FieldOne must be after its dependency FieldTwo',
            ],
            'golden path' => [
                'dependantFieldName' => 'FieldTwo',
                'dependencyFieldNames' => ['FieldOne'],
                'expectedException' => '',
            ],
            'golden path with multiple dependencies' => [
                'dependantFieldName' => 'FieldThree',
                'dependencyFieldNames' => ['FieldOne', 'FieldTwo'],
                'expectedException' => '',
            ],
        ];
    }

    #[DataProvider('provideAddDependencyCallback')]
    public function testAddDependencyCallback(string $dependantFieldName, array $dependencyFieldNames, string $expectedException): void
    {
        $field = new DependentCompositeField('MyCompositeField', 'MySessionPrefix', [
            new TextField('FieldOne'),
            new LiteralField('FieldTwo', ''),
            new HiddenField('FieldThree'),
        ]);
        if ($expectedException) {
            $this->expectException(InvalidArgumentException::class);
            $this->expectExceptionMessage($expectedException);
        } else {
            // No assertions - if it didn't throw an exception, it passes.
            $this->expectNotToPerformAssertions();
        }
        $field->addDependencyCallback($dependantFieldName, $dependencyFieldNames, fn () => null);
    }

    public static function provideGetChildren(): array
    {
        $sessionData = [
            'origValues' => [
                'FieldOne' => null,
                'FieldTwo' => null,
            ],
            'fieldName' => 'FieldOne',
            'newValue' => '123',
        ];
        return [
            [
                'hasForm' => false,
                'hasFormAction' => false,
                'hasRequest' => false,
                'hasFormUrl' => false,
                'hasSession' => false,
                'sessionData' => [],
            ],
            [
                'hasForm' => true,
                'hasFormAction' => false,
                'hasRequest' => false,
                'hasFormUrl' => false,
                'hasSession' => false,
                'sessionData' => [],
            ],
            [
                'hasForm' => true,
                'hasFormAction' => false,
                'hasRequest' => true,
                'hasFormUrl' => false,
                'hasSession' => false,
                'sessionData' => [],
            ],
            [
                'hasForm' => true,
                'hasFormAction' => false,
                'hasRequest' => true,
                'hasFormUrl' => false,
                'hasSession' => true,
                'sessionData' => [],
            ],
            [
                'hasForm' => false,
                'hasFormAction' => false,
                'hasRequest' => true,
                'hasFormUrl' => false,
                'hasSession' => true,
                'sessionData' => $sessionData,
            ],
            [
                'hasForm' => true,
                'hasFormAction' => false,
                'hasRequest' => true,
                'hasFormUrl' => false,
                'hasSession' => true,
                'sessionData' => $sessionData,
            ],
            [
                'hasForm' => true,
                'hasFormAction' => true,
                'hasRequest' => true,
                'hasFormUrl' => false,
                'hasSession' => true,
                'sessionData' => [],
            ],
            [
                'hasForm' => true,
                'hasFormAction' => true,
                'hasRequest' => true,
                'hasFormUrl' => true,
                'hasSession' => true,
                'sessionData' => [],
            ],
            [
                'hasForm' => true,
                'hasFormAction' => true,
                'hasRequest' => true,
                'hasFormUrl' => false,
                'hasSession' => true,
                'sessionData' => $sessionData,
            ],
            [
                'hasForm' => true,
                'hasFormAction' => true,
                'hasRequest' => true,
                'hasFormUrl' => true,
                'hasSession' => true,
                'sessionData' => $sessionData,
            ],
        ];
    }

    #[DataProvider('provideGetChildren')]
    public function testGetChildren(bool $hasForm, bool $hasFormAction, bool $hasRequest, bool $hasFormUrl, bool $hasSession, array $sessionData): void
    {
        $numCalls = 0;
        $originalChildren = [
            'FieldOne' => (new TextField('FieldOne'))->setValue('awawa'),
            'FieldTwo' => new TextField('FieldTwo'),
        ];
        $useSessionData = $hasForm && $hasFormAction && $hasRequest && $hasFormUrl && $hasSession && !empty($sessionData);
        $baseNumCalls = $useSessionData ? 2 : 1;
        $field = new DependentCompositeField(
            'MyCompositeField',
            'MySessionPrefix',
            $originalChildren,
            [
                'FieldTwo' => [
                    'callback' => function () use (&$numCalls) {
                        $numCalls++;
                        return new HiddenField('FieldTwo');
                    },
                    'fields' => ['FieldOne'],
                ],
            ]
        );
        $this->prepareField($field, $hasForm, $hasFormAction, $hasRequest, $hasFormUrl, $hasSession, $sessionData, $numCalls);

        // Call getChildren()
        $reflectionGetChildren = new ReflectionMethod($field, 'getChildren');
        $children1 = $reflectionGetChildren->invoke($field);
        $this->assertSame($baseNumCalls, $numCalls, "Callbacks should be called $baseNumCalls times");
        $this->assertCount(2, $children1);
        $this->assertSame($originalChildren['FieldOne'], $children1['FieldOne']);
        $this->assertNotSame($originalChildren['FieldTwo'], $children1['FieldTwo']);
        $this->assertInstanceOf(HiddenField::class, $children1['FieldTwo']);
        if ($useSessionData) {
            $this->assertSame('123', $children1['FieldOne']->dataValue());
        } else {
            $this->assertSame('awawa', $children1['FieldOne']->dataValue());
        }

        // Call getChildren() a second time
        $children2 = $reflectionGetChildren->invoke($field);

        // We expect to use the cache if there's a form with an action.
        if ($hasForm && $hasFormAction) {
            $this->assertSame($baseNumCalls, $numCalls);
            // The entire set of fields should be identical
            $this->assertSame($children1, $children2);
        } else {
            $this->assertSame($baseNumCalls * 2, $numCalls);
            // Because we didn't use the cache, a new hidden field was created by the callback
            $this->assertNotSame($children1, $children2);
            $this->assertInstanceOf(HiddenField::class, $children2['FieldTwo']);
        }
        if ($useSessionData) {
            $this->assertSame('123', $children1['FieldOne']->dataValue());
        } else {
            $this->assertSame('awawa', $children1['FieldOne']->dataValue());
        }
    }

    /**
     * Test that calling addDependencyCallback() busts cache for getChildren()
     */
    public function testGetChildrenBustCache(): void
    {
        $numCalls = 0;
        $callback = function () use (&$numCalls) {
            $numCalls++;
            return new HiddenField('FieldTwo');
        };
        $field = new DependentCompositeField(
            'MyCompositeField',
            'MySessionPrefix',
            [
                'FieldOne' => (new TextField('FieldOne')),
                'FieldTwo' => new TextField('FieldTwo'),
            ],
            [
                'FieldTwo' => [
                    'callback' => $callback,
                    'fields' => ['FieldOne'],
                ],
            ]
        );
        $this->prepareField($field, numCalls: $numCalls);

        // Call getChildren()
        $reflectionGetChildren = new ReflectionMethod($field, 'getChildren');
        $reflectionGetChildren->invoke($field);
        $this->assertSame(1, $numCalls);

        // Call getChildren() a second time to validate cache was being used
        $reflectionGetChildren->invoke($field);
        $this->assertSame(1, $numCalls);

        $field->addDependencyCallback('FieldTwo', ['FieldOne'], $callback);

        // Call getChildren() again - cache should not be used
        $reflectionGetChildren->invoke($field);
        $this->assertSame(2, $numCalls);
    }

    /**
     * Validates:
     *   - Expected args are passed into callbacks
     *   - Callbacks are called in the correct order
     *   - Fields updated in previous callbacks are used in subsequent ones (instead of just the original field)
     *   - $children array gets updated in place as expected
     *   - Returning `null` from a callback is the same as returning the original field
     * Additional checks are done in testGetUpdatedDependantField()
     */
    public function testUpdateDependantFields(): void
    {
        $origFields = [
            'FieldOne' => new TextField('FieldOne'),
            'FieldTwo' => new TextField('FieldTwo'),
            'FieldThree' => new TextField('FieldThree'),
            'FieldFour' => new TextField('FieldFour'),
        ];
        // Copy the array so updating this array won't affect the origFields array
        $childFields = $origFields;
        $lastArgs1 = [];
        $lastArgs2 = [];
        $lastArgs3 = [];

        $field = new DependentCompositeField(
            'MyCompositeField',
            'MySessionPrefix',
            $childFields,
            [
                // Keep the callbacks in this order.
                // We have these in a different order than the children list
                // so that we can confirm that callbacks are called in the order of fields in the child list
                // not in the order that callbacks happen to be added to the callback list.
                'FieldThree' => [
                    'callback' => function (...$args) use (&$lastArgs2) {
                        $lastArgs2 = $args;
                        return null;
                    },
                    'fields' => ['FieldTwo'],
                ],
                'FieldTwo' => [
                    'callback' => function (...$args) use (&$lastArgs1) {
                        $lastArgs1 = $args;
                        return new HiddenField('FieldTwo');
                    },
                    'fields' => ['FieldOne'],
                ],
                'FieldFour' => [
                    'callback' => function (...$args) use (&$lastArgs3) {
                        $lastArgs3 = $args;
                        return $args[1];
                    },
                    'fields' => ['FieldOne', 'FieldThree'],
                ],
            ]
        );
        $reflectionGetUpdated = new ReflectionMethod($field, 'updateDependantFields');
        $reflectionGetUpdated->invokeArgs($field, [&$childFields]);

        // Fields 2 will be updated in $childFields but not in $origFields
        // Field 1 is not changed because it had no callback
        // Field 3 is not changed because it returned null, which means "use the same field"
        // Field 4 is not changed because it returned the original field explicitly
        $this->assertSame($origFields['FieldOne'], $childFields['FieldOne']);
        $this->assertNotSame($origFields['FieldTwo'], $childFields['FieldTwo']);
        $this->assertSame($origFields['FieldThree'], $childFields['FieldThree']);
        $this->assertSame($origFields['FieldFour'], $childFields['FieldFour']);

        $this->assertSame([
            ['FieldOne' => $origFields['FieldOne']],
            $origFields['FieldTwo']
        ], $lastArgs1);
        $this->assertSame([
            // Note this is the new updated field that gets passed in.
            // i.e. field 2 gets updated first, and then its result is used in
            // field 3's callback
            ['FieldTwo' => $childFields['FieldTwo']],
            $origFields['FieldThree']
        ], $lastArgs2);
        $this->assertSame([
            [
                'FieldOne' => $origFields['FieldOne'],
                'FieldThree' => $origFields['FieldThree'],
            ],
            $origFields['FieldFour']
        ], $lastArgs3);
    }

    public static function provideGetUpdatedDependantField(): array
    {
        return [
            'returns HiddenField' => [
                'newFieldClass' => HiddenField::class,
            ],
            'readonly field' => [
                'isReadOnly' => true,
            ],
            'disabled field' => [
                'isDisabled' => true,
            ],
            'returns original field' => [
                'returnsOriginalField' => true,
            ],
            'must return FormField' => [
                'newFieldClass' => stdClass::class,
                'expectedException' => 'Return from callback for FieldTwo must be a subclass of FormField, or null if the same formfield is to be used',
            ],
            'disallowed field type' => [
                'newFieldClass' => ConfirmedPasswordField::class,
                'expectedException' => 'The child field named FieldTwo must not be an instance of '
                    . ConfirmedPasswordField::class,
            ],
            'not allowed to change name' => [
                'newFieldName' => 'OogieBoogie',
                'expectedException' => 'Return from callback for FieldTwo must have the same name as the field it is replacing. Got OogieBoogie instead',
            ],
        ];
    }

    #[DataProvider('provideGetUpdatedDependantField')]
    public function testGetUpdatedDependantField(
        string $newFieldClass = TextField::class,
        bool $returnsOriginalField = false,
        bool $isReadOnly = false,
        bool $isDisabled = false,
        string $newFieldName = 'FieldTwo',
        string $expectedException = ''
    ): void {
        $fields = [
            'FieldOne' => new TextField('FieldOne'),
            'FieldTwo' => new TextField('FieldTwo'),
        ];
        $field = new DependentCompositeField('MyCompositeField', 'MySessionPrefix', $fields);
        $field->setDisabled($isDisabled);
        $field->setReadonly($isReadOnly);
        $this->prepareField($field);
        $callback = function (array $dependencyFields, FormField $originalField) use ($returnsOriginalField, $newFieldClass, $newFieldName) {
            return $returnsOriginalField ? $originalField : new $newFieldClass($newFieldName);
        };
        $reflectionGetUpdated = new ReflectionMethod($field, 'getUpdatedDependantField');

        if ($expectedException) {
            $this->expectException(LogicException::class);
            $this->expectExceptionMessage($expectedException);
        }

        $result = $reflectionGetUpdated->invoke($field, $callback, $fields['FieldTwo'], ['FieldOne' => $fields['FieldOne']]);

        if ($returnsOriginalField) {
            $this->assertNull($result);
        } else {
            $this->assertInstanceOf($newFieldClass, $result);
            $this->assertSame($field->getForm(), $result->getForm());
            $this->assertSame($field->isReadonly(), $result->isReadonly());
            $this->assertSame($field->isDisabled(), $result->isDisabled());
        }
    }

    /**
     * Prepare the field with a form, request, session, etc.
     *
     * By default this provides everything needed to use cached getChildren() calls but without
     * session data, so each callback only gets called once.
     */
    private function prepareField(
        DependentCompositeField $field,
        bool $hasForm = true,
        bool $hasFormAction = true,
        bool $hasRequest = true,
        bool $hasFormUrl = true,
        bool $hasSession = true,
        array $sessionData = [],
        &$numCalls = 0,
    ): void {
        if ($hasForm) {
            $form = new Form();
            $field->setForm($form);
            // setForm calls getChildren - but we don't want that to be considered as part of our calls.
            $numCalls = 0;
            if ($hasFormAction) {
                $form->setFormAction('some-path');
            }
        }
        if ($hasRequest) {
            $url = $hasFormUrl ? 'some-path/field/something' : 'another-path';
            $request = new HTTPRequest('GET', $url);
            if ($hasSession) {
                $session = new Session([]);
                $request->setSession($session);
                if ($sessionData) {
                    $reflectionSessionName = new ReflectionMethod($field, 'getSessionName');
                    $session->set($reflectionSessionName->invoke($field), $sessionData);
                }
            }
            if ($hasForm) {
                $form->getRequestHandler()->setRequest($request);
            } else {
                Injector::inst()->registerService($request);
            }
        }
    }
}
