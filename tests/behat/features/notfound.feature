@retry @job3
Feature: Not found
  As a site owner
  I want error messages to be displayed in the context of the admin section

  Background:
    Given the "group" "EDITOR" has permissions "CMS_ACCESS_LeftAndMain"

  Scenario: Errors are displayed in the admin context
    Given I am logged in as a member of "EDITOR" group
    And I go to "/admin/nothing"
    Then I should see "Not Found"
    And I should see "Sorry, it seems you were trying to access a section or object that doesn't exist."
    And I should see the admin menu
    Given I go to "/admin/pages/nothing"
    Then I should see "Not Found"
    And I should see "Sorry, it seems you were trying to access a section or object that doesn't exist."
    And I should see the admin menu
    Given I go to "/admin/settings/nothing"
    Then I should see "Not Found"
    And I should see "Sorry, it seems you were trying to access a section or object that doesn't exist."
    And I should see the admin menu

  Scenario: Valid routes do not display the error
    Given I am logged in with "ADMIN" permissions
    And I go to "/admin/settings"
    Then I should not see "Not Found"
    And I should not see "Sorry, it seems you were trying to access a section or object that doesn't exist."
    And I should see the admin menu
    Given I go to "/admin/security/groups/EditForm/field/groups/item/new"
    Then I should not see "Not Found"
    And I should not see "Sorry, it seems you were trying to access a section or object that doesn't exist."
    And I should see the admin menu
