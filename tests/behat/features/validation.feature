@retry
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
    And I go to "/admin/test/SilverStripe-FrameworkTest-Model-Employee"
    And I press the "Add Employee" button

  Scenario: Field validation works as expected even if no validator is explicitly declared
    When I fill in "Name" with "any name"
    And I fill in "Email" with "invalid email"
    And I press the "Create" button
    Then I should not see "Saved Employee"
    And I should see "Please enter an email address"

    And I fill in "Email" with "email@example.com"
    And I press the "Create" button
    Then I should see "Saved Employee"
    And I should not see "Please enter an email address"
