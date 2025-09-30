@retry @job3
Feature: Form validation
  As a content author
  I want form validation to work in the CMS
  So that I know my data is sane

  Background:
    Given the "Company" "Walmart" with "Category"="Retail"
    And the "Company" "ExxonMobil" with "Category"="Oil"
    And the "Company" "Vitol" with "Category"="Other"
    And the "group" "EDITOR" has permissions "Access to 'Pages' section" and "Access to 'Test ModelAdmin' section" and "TEST_DATAOBJECT_EDIT"
    And I am logged in as a member of "EDITOR" group

  Scenario: Field validation works as expected even if no validator is explicitly declared
    Given I go to "/admin/test/SilverStripe-FrameworkTest-Model-Employee"
    And I press the "Add new Employee" button
    When I fill in "Name" with "any name"
    And I fill in "Email" with "invalid email"
    And I press the "Create" button
    Then I should not see "Saved Employee"
    And I should see "Invalid email address"

    When I fill in "Email" with "email@example.com"
    And I press the "Create" button
    Then I should see "Saved Employee"
    And I should not see "Invalid email address"

  Scenario: Validation in GridField highlights the tab where the error is
    Given I go to "/admin/test/SilverStripe-FrameworkTest-Model-Company"
    And I click "Walmart" in the "#Form_EditForm" element
    When I fill in "Name" with ""
    And I press the "Save" button
    Then I should not see "Saved Company"
    And I should see "\"Name\" is required"
    And I should see "There are validation errors on this page, please fix them before saving or publishing."
    And I should see an invalid tab icon on the "Main" tab

    When I fill in "Name" with "new name"
    And I press the "Save" button
    Then I should see "Saved Company"
    And I should not see "\"Name\" is required"
    And I should not see "There are validation errors on this page, please fix them before saving or publishing."
    And I should not see an invalid tab icon on the "Main" tab
