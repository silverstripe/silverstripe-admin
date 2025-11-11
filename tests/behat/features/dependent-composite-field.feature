@retry @job1
Feature: DependentCompositeField functionality
  As a developer
  I want the DependentCompositeField to work as expected
  So that I can rely on it in my forms

  Background:
    # The first BasicFieldsTestPage record is used for the test-react admin section
    Given I add an extension "SilverStripe\Admin\Tests\Behat\Context\Extension\DependentCompositeFieldExtension" to the "BasicFieldsTestPage" class without dev-build
    And the "BasicFieldsTestPage" "Basic Fields"
    And the "Page" "Page 1"
    And the "Page" "Page 2"
    And the "Page" "Page 3"
    And the "group" "EDITOR" has permissions "Access to 'Pages' section" and "Access to 'Test React FormBuilder' section"
    And I am logged in as a member of "EDITOR" group

  Scenario: DependencyCompositeField works as expected in a react form with various form fields
    Given I go to "/admin/test-react"
    When I click "Dependencies" in the ".nav-tabs" element
    Then I should see a "FieldType" field
    And I should not see a "Dependency1" field
    And I should not see a "Dependency2" field
    And I should not see the "div#Form_TestEditForm_Dependency2" element

    # Select text field and set the value
    When I select "TextField" in the "FieldType" dropdown
    Then I should see a "Dependency1" field
    And the "input[name='Dependency1']" element "type" attribute should be "text"
    And the "input[name='Dependency1']" element "value" attribute should be ""
    And I should not see a "Dependency2" field
    And I should see "SilverStripe\Forms\TextField: ''" in the "div#Form_TestEditForm_Dependency2" element
    When I fill in "Dependency1" with "my value"
    Then the "input[name='Dependency1']" element "type" attribute should be "text"
    And the "input[name='Dependency1']" element "value" attribute should be "my value"
    And I should see "SilverStripe\Forms\TextField: 'my value'" in the "div#Form_TestEditForm_Dependency2" element

    # Select hidden field (value is just whatever was set for the previous field)
    When I select "HiddenField" in the "FieldType" dropdown
    Then the "input[name='Dependency1']" element "type" attribute should be "hidden"
    And the "input[name='Dependency1']" element "value" attribute should be "my value"
    And I should see "SilverStripe\Forms\HiddenField: 'my value'" in the "div#Form_TestEditForm_Dependency2" element

    # Select numeric field and set the value
    When I select "NumericField" in the "FieldType" dropdown
    Then the "input[name='Dependency1']" element "type" attribute should be "number"
    And the "input[name='Dependency1']" element "value" attribute should be ""
    And I should see "SilverStripe\Forms\NumericField: null" in the "div#Form_TestEditForm_Dependency2" element
    When I fill in "Dependency1" with "123"
    # NumericField uses a string representation of the value even though it's a *numeric* field - so the quote marks are expected
    And I should see "SilverStripe\Forms\NumericField: '123'" in the "div#Form_TestEditForm_Dependency2" element
    # for some reason react doesn't update the value in the DOM until blur for numeric field
    When I press the "Tab" key globally
    Then the "input[name='Dependency1']" element "type" attribute should be "number"
    Then the "input[name='Dependency1']" element "value" attribute should be "123"

    # Select dropdown and set the value
    When I select "DropdownField" in the "FieldType" dropdown
    Then I should see the "select[name='Dependency1']" element
    And I should see "SilverStripe\Forms\DropdownField: null" in the "div#Form_TestEditForm_Dependency2" element
    When I select "Value2" in the "Dependency1" dropdown
    And I should see "SilverStripe\Forms\DropdownField: 'Value2'" in the "div#Form_TestEditForm_Dependency2" element

    # Select searchable dropdown and set the value
    When I select "SearchableDropdownField" in the "FieldType" dropdown
    # a field with the "__input" suffix is a way to fingerprint a searchabledropdown field
    Then I should see a "Form_TestEditForm_Dependency1__input" field
    And the "input[name=Dependency1]" element "value" attribute should be ""
    # searchable dropdown values are arrays if "ID" isn't at the end of the field name, unfortunately
    And I should see "SilverStripe\Forms\SearchableDropdownField: []" in the "div#Form_TestEditForm_Dependency2" element
    # this seems the be the way we tell behat how to use searchable dropdowns...
    When I click on the "#Form_TestEditForm_Dependency1 .ss-searchable-dropdown-field__value-container" element
    And I type "page 1" in the field
    And I wait 2 seconds
    And I press the "Enter" key globally
    And I should see "SilverStripe\Forms\SearchableDropdownField: [2]" in the "div#Form_TestEditForm_Dependency2" element

    # Select tree dropdown and set the value
    When I select "TreeDropdownField" in the "FieldType" dropdown
    Then I should see the "#Form_TestEditForm_Dependency1_Holder .treedropdownfield__value-container" element
    # for some reason when initialised the value is a pure int, but whenever we set or clear the value it becomes a string
    And the "input[name='Dependency1']" element "value" attribute should be "0"
    And I should see "SilverStripe\Forms\TreeDropdownField: 0" in the "div#Form_TestEditForm_Dependency2" element
    When I select "Page 2" in the "#Form_TestEditForm_Dependency1_Holder" tree dropdown
    And I should see "SilverStripe\Forms\TreeDropdownField: '3'" in the "div#Form_TestEditForm_Dependency2" element
    And I should see "Page 2" in the "#Form_TestEditForm_Dependency1_Holder .treedropdownfield__value-container" element
    And the "input[name='Dependency1']" element "value" attribute should be "3"
    # clear the field
    When I click on the "#Form_TestEditForm_Dependency1_Holder .treedropdownfield__clear-indicator" element
    Then I should see "SilverStripe\Forms\TreeDropdownField: '0'" in the "div#Form_TestEditForm_Dependency2" element
    And the "input[name='Dependency1']" element "value" attribute should be "0"

    # Select checkbox and tick the box
    When I select "CheckboxField" in the "FieldType" dropdown
    Then the "input[name='Dependency1']" element "type" attribute should be "checkbox"
    And the "Dependency1" checkbox should not be checked
    And I should see "SilverStripe\Forms\CheckboxField: null" in the "div#Form_TestEditForm_Dependency2" element
    When I check "Dependency1"
    Then I should see "SilverStripe\Forms\CheckboxField: 1" in the "div#Form_TestEditForm_Dependency2" element
    And the "input[name='Dependency1']" element "type" attribute should be "checkbox"
    And the "Dependency1" checkbox should be checked

    # Select date field and set a date
    When I select "DateField" in the "FieldType" dropdown
    Then the "input[name='Dependency1']" element "type" attribute should be "date"
    # but is 0 after treedropdown?!?!?!?
    And the "input[name=Dependency1]" element "value" attribute should be "0"
    And I should see "SilverStripe\Forms\DateField: ''" in the "div#Form_TestEditForm_Dependency2" element
    When I fill in "Dependency1" with "03-20-2025"
    And I should see "SilverStripe\Forms\DateField: '2025-03-20'" in the "div#Form_TestEditForm_Dependency2" element
    Then the "input[name='Dependency1']" element "type" attribute should be "date"
    And the "input[name=Dependency1]" element "value" attribute should be "2025-03-20"

    # Select datetime field and set a date and time
    When I select "DatetimeField" in the "FieldType" dropdown
    Then the "input[name='Dependency1']" element "type" attribute should be "datetime-local"
    And the "input[name=Dependency1]" element "value" attribute should be "0"
    And I should see "SilverStripe\Forms\DatetimeField: ''" in the "div#Form_TestEditForm_Dependency2" element
    # we can't use `And I fill in "Dependency1" with "some date/time"` because
    # the HTML5 datetime widget does weird things. This manual way works though.
    And I focus on the "input[name='Dependency1']" element
    And I type "04-15-2025" in the field
    And I press the "Tab" key globally
    And I type "03:16pm" in the field
    And I should see "SilverStripe\Forms\DatetimeField: '2025-04-15 15:16:00'" in the "div#Form_TestEditForm_Dependency2" element
    Then the "input[name='Dependency1']" element "type" attribute should be "datetime-local"
    And the "input[name=Dependency1]" element "value" attribute should be "2025-04-15T15:16:00"
