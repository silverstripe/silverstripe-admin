@retry @job2
Feature: Basic FormField testing
  As an author
  I want to use the form system in Silverstripe CMS
  So that I can keep my content up-to-date

  Background:
    Given the "Company" "Walmart"
    And the "group" "EDITOR" has permissions "Access to 'Pages' section" and "Access to 'Test ModelAdmin' section" and "TEST_DATAOBJECT_EDIT"
    And I am logged in as a member of "EDITOR" group
    And I go to "/admin/test"

  Scenario: The basic form fields work as expected
    Given I click "Walmart" in the "#Form_EditForm" element
    # ReadonlyField should have a `<p>` rather than an `<input>` element
    Then I should not see the "#Form_ItemEditForm_IntentionallyEmpty_Holder input" element
    And I should not see the "input#Form_ItemEditForm_IntentionallyEmpty" element
    And I should see the "p#Form_ItemEditForm_IntentionallyEmpty" element
    # ReadonlyField should render its value as HTML (only when empty), not be escaped
    And I should see "('none')" in the "p#Form_ItemEditForm_IntentionallyEmpty" element
    And I should not see "<i>('none')</i>" in the "p#Form_ItemEditForm_IntentionallyEmpty" element
    And I should see "<i>Read-only value</i>" in the "p#Form_ItemEditForm_ReadonlyWithValue" element
    # Check values for fields
    And the "Name" field should contain "Walmart"
    And the "CEO" field should be empty
    And the "Revenue" field should contain "0.0"
    # Fill in the empty fields
    When I fill in "CEO" with "Some Person"
    And I fill in "Revenue" with "1.23"
    And I press the "Save" button
    Then I should see a "Saved Company "Walmart" successfully" success toast
    And the "CEO" field should contain "Some Person"
    And the "Revenue" field should contain "1.23"
