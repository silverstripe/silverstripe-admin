@javascript @retry @job2
Feature: Manage groups
  As a site administrator
  I want to create and manage user groups on my site
  So that I can control access to the CMS

  Background:
    Given I add an extension "SilverStripe\BehatExtension\Extensions\ActivateSudoModeServiceExtension" to the "SilverStripe\Security\SudoMode\SudoModeService" class
    And a "group" "BOB"
    And a "group" "Jane" with permissions "View draft content"
    And the "group" "GROUPS_EDITOR" has permissions "CMS_ACCESS_SecurityAdmin" and "EDIT_PERMISSIONS"
    And the "group" "MEMEBERS_EDITOR" has permissions "CMS_ACCESS_SecurityAdmin" and "APPLY_ROLES"
    And the "page" "My page"
    And I am logged in with "ADMIN" permissions
    And I go to "/admin/security"

  Scenario: I can create a new group with permissions
    # Create a user group
    When I click the "Groups" CMS tab
    And I press the "Add new Group" button
    And I fill in "Group name" with "MyGroup"
    And I press the "Create" button
    Then I should not see "Validation Error"

    # Assign various permissions to the group
    And I click the "Permissions" CMS tab
    And I check "View draft content"
    And I press the "Save" button
    Then I should not see "Validation Error"

  Scenario: Group cannot have a blank name
    When I click the "Groups" CMS tab
    And I press the "Add new Group" button
    And I fill in "Group name" with ""
    And I press the "Create" button
    Then I should see "Validation Error"

  Scenario: Members of a group with permissions can edit Group data
    Given I go to "/Security/login"
    And I press the "Log in as someone else" button
    And I am logged in as a member of "GROUPS_EDITOR" group
    And I go to "/admin/security"
    When I click the "Groups" CMS tab
    And I click "GROUPS_EDITOR" in the "#Form_EditForm_groups" element
    And I fill in "Group name" with "GROUPS_EDITOR_NEW"
    And I press the "Save" button
    And I should see "Saved Group "
    And I click "Groups" in the ".breadcrumbs-wrapper" element
    And I click the "Groups" CMS tab
    And I should see "GROUPS_EDITOR_NEW"

  Scenario: Members of a group with permissions can edit Members data
    Given I go to "/Security/login"
    And I press the "Log in as someone else" button
    And I am logged in as a member of "GROUPS_EDITOR" group
    And I go to "/admin/security"
    When I click the "Users" CMS tab
    And I click "GROUPS_EDITOR" in the "#Form_EditForm_users" element
    And I fill in "First Name" with "General Editor"
    And I press the "Save" button
    And I should see "Saved Member "
    And I click "Users" in the ".breadcrumbs-wrapper" element
    And I should see "General Editor"

  Scenario: Members of a group without permissions cannot view draft content
    Given I go to "/Security/login"
    And I press the "Log in as someone else" button
    And I am logged in as a member of "BOB" group
    When I go to "/my-page?stage=Stage"
    Then I should not see "My page"

  Scenario: Members of a group with relevant permissions can view draft content
    Given I go to "/Security/login"
    And I press the "Log in as someone else" button
    And I am logged in as a member of "Jane" group
    When I go to "/my-page?stage=Stage"
    Then I should see "My page"
