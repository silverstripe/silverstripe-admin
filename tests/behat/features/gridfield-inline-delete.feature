@retry @job1
Feature: GridField inline delete
  As an author
  I want to inline delete records

  Background:
    Given I add an extension "SilverStripe\FrameworkTest\Model\CompanyEmployeeDeleteExtension" to the "SilverStripe\FrameworkTest\Model\Company" class
    Given the "Company" "Company A" with "Category"="Other"
    And the "Company" "Company B" with "Category"="Other"
    And the "Company" "Company C" with "Category"="Other"
    And the "Employee" "Employee A" with "Company"="3"
    And the "Employee" "Employee B" with "Company"="1"
    And the "Employee" "Employee C" with "Company"="1"
    And the "group" "EDITOR" has permissions "Access to 'Pages' section" and "Access to 'Test ModelAdmin' section" and "TEST_DATAOBJECT_EDIT"
    And I am logged in as a member of "EDITOR" group
    And I go to "/admin/test"

  Scenario: I can see toast message when I successfully delete a record by clicking the Delete button in action menu
    When I click "Company C" in the "#Form_EditForm" element
    And I click "Employees" in the ".ui-tabs-nav" element
    Then I should see "Employee A" in the "#Form_ItemEditForm_Employees" element
    And I press the "View actions" button
    And I press the "Delete" button, confirming the dialog
    And I wait for 1 seconds
    Then I should see a "Deleted" success toast
    Then I should not see "Employee A" in the "#Form_ItemEditForm_Employees" element
