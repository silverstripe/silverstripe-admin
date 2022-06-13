@javascript @retry
Feature: Manage groups
  As a site administrator
  I want to create and manage user groups on my site
  So that I can control access to the CMS

  Background:
    Given a "group" "BOB group"
    And a "group" "Jane group" with permissions "View draft content"
    And the "page" "My page"
    And I am logged in with "ADMIN" permissions
    And I go to "/admin/security"

  Scenario: I can create a new group with permissions
    # Create a user group
    When I click the "Groups" CMS tab
    And I press the "Add Group" button
    And I fill in "Group name" with "MyGroup"
    And I press the "Create" button
    Then I should not see "Validation Error"

    # Assign various permissions to the group
    And I click the "Permissions" CMS tab
    And I check "View draft content"
    And I press the "Save" button
    Then I should not see "Validation Error"

  Scenario: Members of a group without permissions cannot view draft content
    Given I go to "/Security/login"
    And I press the "Log in as someone else" button
    And I am logged in with "BOB" permissions
    When I go to "/my-page?stage=Stage"
    Then I should not see "My page"

  Scenario: Members of a group with relevant permissions can view draft content
    Given I go to "/Security/login"
    And I press the "Log in as someone else" button
    And I am logged in with "Jane" permissions
    When I go to "/my-page?stage=Stage"
    Then I should see "My page"
