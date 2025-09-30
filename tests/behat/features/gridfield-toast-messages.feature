@retry @job1
Feature: Show toast messages
  As an author
  I want to see toast message in the CMS when I create, edit, delete, unlink, publish, unpublish, archive a record

  Background:
    Given the "Company" "Company A" with "Category"="Other"
    And the "Company" "Company B" with "Category"="Other"
    And the "Company" "Company C" with "Category"="Other"
    And the "Employee" "Employee A" with "Company"="3"
    And the "Employee" "Employee B" with "Company"="1"
    And the "Employee" "Employee C" with "Company"="1"
    And the "group" "EDITOR" has permissions "Access to 'Pages' section" and "Access to 'Test ModelAdmin' section" and "TEST_DATAOBJECT_EDIT"
    And I am logged in as a member of "EDITOR" group
    And I go to "/admin/test"

  Scenario: I can see toast message when I successfully create or publish a record
    When I press the "Add new Company" button
    And I fill in "Name" with "My Company"
    And I press the "Create" button
    Then I should see a "Saved Company "My Company" successfully" success toast
    And I fill in "Name" with "My New Company"
    And I wait for 5 seconds
    And I press the "Publish" button
    Then I should see a "Published Company "My New Company"" success toast

  Scenario: I can see toast message when I successfully unpublish and archive a record
    When I click "Company B" in the "#Form_EditForm" element
    And I press the "Publish" button
    Then I should see a "Published Company "Company B"" success toast
    And I wait for 5 seconds
    And I click "More options" in the "#ActionMenus" element
    And I press the "Unpublish" button, confirming the dialog
    Then I should see a "Unpublished Company "Company B"" success toast
    And I wait for 5 seconds
    And I click "More options" in the "#ActionMenus" element
    And I press the "Archive" button, confirming the dialog
    And I should not see "Validation Error"
    And I should see a "Archived Company "Company B"" success toast

  Scenario: I can see toast message when I successfully delete a record
    When I click "Company C" in the "#Form_EditForm" element
    And I click "Employees" in the ".ui-tabs-nav" element
    Then I should see "Employee A" in the "#Form_ItemEditForm_Employees" element
    And I click "Employee A" in the "#Form_ItemEditForm_Employees" element
    And I press the "Delete" button, confirming the dialog
    Then I should see a "Deleted Employee "Employee A"" success toast
    Then I should not see "Employee A" in the "#Form_ItemEditForm_Employees" element

  # Clicking the inline "Delete" button in action menu is tested in gridfield-inline-delete.feature

  Scenario: I can see toast message when I successfully unlink a record by clicking the Unlink button in action menu
    When I click "Company C" in the "#Form_EditForm" element
    And I click "Employees" in the ".ui-tabs-nav" element
    Then I should see "Employee A" in the "#Form_ItemEditForm_Employees" element
    And I press the "View actions" button
    And I press the "Unlink" button, confirming the dialog
    And I wait for 1 seconds
    Then I should see a "Unlinked" success toast
    Then I should not see "Employee A" in the "#Form_ItemEditForm_Employees" element

  Scenario: I can see toast message when I successfully archive a record by clicking the Archive button in action menu
    And I should see "Company A" in the "#Form_EditForm" element
    And I press the "View actions" button
    And I press the "Archive" button, confirming the dialog
    And I wait for 2 seconds
    Then I should see a "Archived" success toast
    Then I should not see "Company A" in the "#Form_EditForm" element

  Scenario: I can see toast message when I have validation errors
    When I click "Company C" in the "#Form_EditForm" element
    And I click "Main" in the ".ui-tabs-nav" element
    And I fill in "Name" with ""
    And I press the "Save" button
    Then I should see "Validation Error"
    And I fill in "Name" with "New Company C"
    And I press the "Save" button
    Then I should see a "Saved Company "New Company C" successfully" success toast

  Scenario: I can see toast message when I have validation errors when I edit a nested record
    When I click "Company A" in the "#Form_EditForm" element
    And I click "Employees" in the ".ui-tabs-nav" element
    Then I should see "Employee B" in the "#Form_ItemEditForm_Employees" element
    And I click "Employee B" in the "#Form_ItemEditForm_Employees" element
    And I fill in "Name" with ""
    And I press the "Save" button
    Then I should see "Validation Error"
