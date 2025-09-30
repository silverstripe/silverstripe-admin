@javascript @retry @job2
Feature: Manage Roles
  As a site administrator
  I want to create and manage group roles on my site
  So that I can control access to the CMS

  Background:
    Given I add an extension "SilverStripe\BehatExtension\Extensions\ActivateSudoModeServiceExtension" to the "SilverStripe\Security\SudoMode\SudoModeService" class
    And a "group" "Jane"
    And the "role" "This role is just another role"
    And the "role" "View draft content" has permissions "View draft content"
    And the "page" "My page"
    And I am logged in with "ADMIN" permissions
    And I go to "/admin/security"

  Scenario: I can create a new role with permissions
    When I click the "Roles" CMS tab
    And I press the "Add new Role" button
    And I fill in "Title" with "MyRole"
    And I check "View draft content"
    And I press the "Create" button
    Then I should not see "Validation Error"
    And the "View draft content" checkbox should be checked

  Scenario: Manage roles link works correctly
    When I click the "Groups" CMS tab
    And I click "Jane" in the "#Form_EditForm_groups" element
    And I click the "Roles" CMS tab
    And I click "Manage roles" in the "#Root_Roles" element
    Then I should see "Add new Role"
    And I should see "This role is just another role"

  Scenario: Members of a group with role permissions can view draft content
    When I click the "Groups" CMS tab
    And I click "Jane" in the "#Form_EditForm_groups" element
    And I click the "Roles" CMS tab
    And I select "View draft content" from "Roles[]"
    And I press the "Save" button
    Then I should not see "Validation Error"
    Given I go to "/Security/login"
    And I press the "Log in as someone else" button
    And I am logged in as a member of "Jane" group
    When I go to "/my-page?stage=Stage"
    Then I should see "My page"
