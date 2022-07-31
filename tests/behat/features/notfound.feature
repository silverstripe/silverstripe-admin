Feature: Not found
  As a site owner
  I want error messages to be displayed in the context of the admin section

  Background:
    Given I am logged in with "ADMIN" permissions

  Scenario: Errors are displayed in the admin context
    Given I go to "/admin/nothing"
    Then I should see "Not Found"
    And I should see "Sorry, it seems you were trying to access a section or object that doesn't exist."
    And I should see the admin menu
    Given I go to "/admin/pages/nothing"
    Then I should see "Not Found"
    And I should see "Sorry, it seems you were trying to access a section or object that doesn't exist."
    And I should see the admin menu
    Given I go to "/admin/security/EditForm/nothing"
    Then I should see "Not Found"
    And I should see "Sorry, it seems you were trying to access a section or object that doesn't exist."
    And I should see the admin menu
    Given I go to "/admin/security/EditForm/field/Members/nothing"
    Then I should see "Not Found"
    And I should see "Sorry, it seems you were trying to access a section or object that doesn't exist."
    And I should see the admin menu
    Given I go to "/admin/settings/nothing"
    Then I should see "Not Found"
    And I should see "Sorry, it seems you were trying to access a section or object that doesn't exist."
    And I should see the admin menu

  Scenario: Valid routes do not display the error
    Given I go to "/admin/settings"
    Then I should not see "Not Found"
    And I should not see "Sorry, it seems you were trying to access a section or object that doesn't exist."
    And I should see the admin menu
    Given I go to "/admin/security/EditForm/field/Members/item/new"
    Then I should not see "Not Found"
    And I should not see "Sorry, it seems you were trying to access a section or object that doesn't exist."
    And I should see the admin menu
