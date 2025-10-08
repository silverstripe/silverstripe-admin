@retry @job2
Feature: Changetracker correctly identifies changes
  As a content author
  I want to know when unsaved changes have been made
  So that I know when I need to save my work

  Background:
    Given the "Employee" "Employee A" with "Email"="test@example.com" and "Biography"="<p>some content here</p>" and "DateOfBirth"="1990-06-09"
      And the "group" "EDITOR" has permissions "Access to 'Test ModelAdmin' section" and "TEST_DATAOBJECT_EDIT"
      And I am logged in as a member of "EDITOR" group
      And I go to "/admin/test"
      And I click "Employees" in the ".ui-tabs-nav" element
      And I click "Employee A" in the "#Form_EditForm" element

  Scenario: Changing values in TextField
    # Should have "tick" icon, not "save" icon (i.e. form is NOT dirty)
    Given I should see the "button#Form_ItemEditForm_action_doSave .font-icon-tick" element
      And I should not see the "button#Form_ItemEditForm_action_doSave .font-icon-save" element
      And I should not see the "form#Form_ItemEditForm.changed" element
    When I click on the "input#Form_ItemEditForm_Email" element
      And I press the "A" key globally
    # Should have "save" icon, not "tick" icon (i.e. form is dirty)
    Then I should not see the "button#Form_ItemEditForm_action_doSave .font-icon-tick" element
      And I should see the "button#Form_ItemEditForm_action_doSave .font-icon-save" element
      And I should see the "form#Form_ItemEditForm.changed" element
    # Save so the driver can reset without having to deal with the popup alert.
    Then I press the "Save" button

  Scenario: Changing values in DateField
    # Should have "tick" icon, not "save" icon (i.e. form is NOT dirty)
    Given I should see the "button#Form_ItemEditForm_action_doSave .font-icon-tick" element
      And I should not see the "button#Form_ItemEditForm_action_doSave .font-icon-save" element
      And I should not see the "form#Form_ItemEditForm.changed" element
    When I click on the "input#Form_ItemEditForm_DateOfBirth" element
      And I press the "8" key globally
    # Should have "save" icon, not "tick" icon (i.e. form is dirty)
    Then I should not see the "button#Form_ItemEditForm_action_doSave .font-icon-tick" element
      And I should see the "button#Form_ItemEditForm_action_doSave .font-icon-save" element
      And I should see the "form#Form_ItemEditForm.changed" element
    # Save so the driver can reset without having to deal with the popup alert.
    Then I press the "Save" button

  Scenario: Changing values in DropdownField
    # Should have "tick" icon, not "save" icon (i.e. form is NOT dirty)
    Given I should see the "button#Form_ItemEditForm_action_doSave .font-icon-tick" element
      And I should not see the "button#Form_ItemEditForm_action_doSave .font-icon-save" element
      And I should not see the "form#Form_ItemEditForm.changed" element
    When I click on the "#Form_ItemEditForm_Category_chosen" element
      And I wait 1 second
      And I click "hr" in the "#Form_ItemEditForm_Category_chosen .chosen-results" element
    # Should have "save" icon, not "tick" icon (i.e. form is dirty)
    Then I should not see the "button#Form_ItemEditForm_action_doSave .font-icon-tick" element
      And I should see the "button#Form_ItemEditForm_action_doSave .font-icon-save" element
      And I should see the "form#Form_ItemEditForm.changed" element
    # Save so the driver can reset without having to deal with the popup alert.
    Then I press the "Save" button

  Scenario: Changing values in HTMLEditorField
    # Should have "tick" icon, not "save" icon (i.e. form is NOT dirty)
    Given I should see the "button#Form_ItemEditForm_action_doSave .font-icon-tick" element
      And I should not see the "button#Form_ItemEditForm_action_doSave .font-icon-save" element
      And I should not see the "form#Form_ItemEditForm.changed" element
    When I click on the "iframe#Form_ItemEditForm_Biography_ifr" element
      And I press the "A" key globally
    # Should have "save" icon, not "tick" icon (i.e. form is dirty)
    Then I should not see the "button#Form_ItemEditForm_action_doSave .font-icon-tick" element
      And I should see the "button#Form_ItemEditForm_action_doSave .font-icon-save" element
      And I should see the "form#Form_ItemEditForm.changed" element
    # Save so the driver can reset without having to deal with the popup alert.
    Then I press the "Save" button
