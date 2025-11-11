<?php

namespace SilverStripe\Admin\Tests\Behat\Context\Extension;

use Page;
use SilverStripe\Admin\Forms\DependentCompositeField;
use SilverStripe\Core\Extension;
use SilverStripe\Dev\TestOnly;
use SilverStripe\Forms\CheckboxField;
use SilverStripe\Forms\DateField;
use SilverStripe\Forms\DatetimeField;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\FormField;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\NumericField;
use SilverStripe\Forms\SearchableDropdownField;
use SilverStripe\Forms\TextField;
use SilverStripe\Forms\TreeDropdownField;

class DependentCompositeFieldExtension extends Extension implements TestOnly
{
    protected function updateCMSFields(FieldList $fields): void
    {
        $fields->addFieldToTab('Root.Dependencies', DependentCompositeField::create(
            'MyDependencyField',
            "{$this->owner->ClassName}_{$this->owner->ID}",
            children: [
                DropdownField::create('FieldType', 'Field type', [
                    HiddenField::class => 'HiddenField',
                    TextField::class => 'TextField',
                    NumericField::class => 'NumericField',
                    DropdownField::class => 'DropdownField',
                    SearchableDropdownField::class => 'SearchableDropdownField',
                    TreeDropdownField::class => 'TreeDropdownField',
                    CheckboxField::class => 'CheckboxField',
                    DateField::class => 'DateField',
                    DatetimeField::class => 'DatetimeField',
                ])->setHasEmptyDefault(true),
                HiddenField::create('Dependency1'),
                HiddenField::create('Dependency2'),
            ],
            dependencyCallbacks: [
                'Dependency1' => [
                    'fields' => ['FieldType'],
                    'callback' => function (array $dependencyFields, FormField $originalField): ?FormField {
                        $fieldType = $dependencyFields['FieldType']->dataValue();
                        // === instead of is_a() or instanceof because we don't want subclasses.
                        if ($fieldType === get_class($originalField)) {
                            // Returning null reuses the existing field which also keeps the value.
                            return null;
                        }
                        // Create a new field of the given type. We don't set the value, so the value will be reset for the new field.
                        $field = match ($fieldType) {
                            TextField::class => TextField::create($originalField->getName()),
                            NumericField::class => NumericField::create($originalField->getName()),
                            DropdownField::class => DropdownField::create(
                                $originalField->getName(),
                                $originalField->Title(),
                                ['Value1' => 'Value1', 'Value2' => 'Value2']
                            ),
                            SearchableDropdownField::class => SearchableDropdownField::create(
                                $originalField->getName(),
                                $originalField->Title(),
                                Page::get()
                            ),
                            TreeDropdownField::class => TreeDropdownField::create(
                                $originalField->getName(),
                                $originalField->Title(),
                                Page::class
                            ),
                            CheckboxField::class => CheckboxField::create($originalField->getName()),
                            DateField::class => DateField::create($originalField->getName()),
                            DatetimeField::class => DatetimeField::create($originalField->getName()),
                            // Retain the previous value for hidden field since we have no way to set the value in the form
                            null, '', HiddenField::class => HiddenField::create($originalField->getName())->setValue($originalField->dataValue()),
                            // Warning in case we add fields to the dropdown but forget to handle them here.
                            default => LiteralField::create($originalField->getName(), "<div class=\"alert alert-warning\">Unexpected field type: {$fieldType}</div>")
                        };
                        return $field;
                    },
                ],
                'Dependency2' => [
                    'fields' => ['FieldType', 'Dependency1'],
                    'callback' => function (array $dependencyFields, FormField $originalField): ?FormField {
                        $fieldType = $dependencyFields['FieldType']->dataValue();
                        if (!$fieldType) {
                            $originalField->setValue('<div class="alert alert-info">No field type set</div>');
                            // Intentionally return null to keep the previous form field so we can validate that works
                            // In a real-world situation we'd probably return a hidden field here instead.
                            return null;
                        }
                        $value = $dependencyFields['Dependency1']->dataValue();
                        if (is_string($value)) {
                            $value = "'$value'";
                        }
                        if (is_array($value)) {
                            $value = json_encode($value);
                        }
                        if ($value === null) {
                            $value = 'null';
                        }
                        return LiteralField::create(
                            $originalField->getName(),
                            "<div class=\"alert alert-info\">{$fieldType}: {$value}</div>"
                        );
                    },
                ],
            ]
        ));
    }
}
