@javascript @retry @job3
Feature: Manage users
  As a site administrator
  I want to create and manage user accounts on my site
  So that I can control access to the CMS

  Background:
    Given I add an extension "SilverStripe\BehatExtension\Extensions\ActivateSudoModeServiceExtension" to the "SilverStripe\Security\SudoMode\SudoModeService" class
    And a "member" "ADMIN" belonging to "ADMIN group" with "Email"="admin@example.org"
    And the "member" "ADMIN" belonging to "ADMIN group2"
    And a "member" "Staff" belonging to "Staff group" with "Email"="staffmember@example.org"
    And a "member" "Other Staff" belonging to "Staff group" with "Email"="othermember@example.org"
    And the "group" "ADMIN group" has permissions "Full administrative rights"
    And the "group" "ADMIN group2" has permissions "Full administrative rights"
    And I am logged in with "ADMIN" permissions
    And I go to "/admin/security"

  Scenario: I cannot remove my admin access, but can remove myself from an admin group
    When I click the "Groups" CMS tab
      And I click "ADMIN group" in the "#Form_EditForm_groups" element
      And I should see the "Unlink" button in the "Members" gridfield for the "ADMIN" row
    Then I click "Groups" in the ".breadcrumbs-wrapper" element
      And I click the "Groups" CMS tab
      And I click "ADMIN group2" in the "#Form_EditForm_groups" element
      And I press the "View actions" button
      And I press the "Unlink" button, confirming the dialog
      And I wait for 1 seconds
      Then I should see a "Unlinked" success toast
    Then I click "Groups" in the ".breadcrumbs-wrapper" element
      And I click the "Groups" CMS tab
      And I click "ADMIN group" in the "#Form_EditForm_groups" element
      And I should not see the "Unlink" button in the "Members" gridfield for the "ADMIN" row

  Scenario: I can list all users regardless of group
    When I click the "Users" CMS tab
    Then I should see "admin@example.org" in the "#Form_EditForm_users" element
    And I should see "staffmember@example.org" in the "#Form_EditForm_users" element

  Scenario: I can search for an existing user by name
    When I click the "Users" CMS tab
    And I press the "Open search and filter" button
    And I press the "Advanced" button
    And I fill in "Search__FirstName" with "ADMIN"
    And I press the "Enter" key in the "Search__FirstName" field
    Then I should see "admin@example.org" in the "#Form_EditForm_users" element
    But I should not see "staffmember@example.org" in the "#Form_EditForm_users" element
    # Required to avoid "unsaved changes" browser dialog
    Then I press the "Close" button

  Scenario: I can search for an existing user by email
    When I click the "Users" CMS tab
    And I press the "Open search and filter" button
    And I press the "Advanced" button
    And I fill in "Search__Email" with "staffmember@example.org"
    And I press the "Search" button
    Then I should see "staffmember@example.org" in the "#Form_EditForm_users" element
    But I should not see "admin@example.org" in the "#Form_EditForm_users" element
    # Required to avoid "unsaved changes" browser dialog
    Then I press the "Close" button

  Scenario: I can clear a search for an existing user
    Given I click the "Users" CMS tab
    And I press the "Open search and filter" button
    And I press the "Advanced" button
    And I fill in "Search__Email" with "staffmember@example.org"
    And I press the "Search" button
    And I should see "staffmember@example.org" in the "#Form_EditForm_users" element
    And I should not see "admin@example.org" in the "#Form_EditForm_users" element
    When I press the "Close" button
    Then I should see a "Open search and filter" button
    And I should see "staffmember@example.org" in the "#Form_EditForm_users" element
    And I should see "admin@example.org" in the "#Form_EditForm_users" element

  Scenario: I can list all users in a specific group
    When I click the "Groups" CMS tab
    And I click "ADMIN group" in the "#Form_EditForm_groups" element
    Then I should see "admin@example.org" in the "#Root_Members" element
    And I should not see "staffmember@example.org" in the "#Root_Members" element

  Scenario: I can add a user to the system
    When I click the "Users" CMS tab
    And I press the "Add new Member" button
    And I fill in the following:
      | First Name | John |
      | Surname | Doe |
      | Email | john.doe@example.org |
      | Password | the-quick-brown-fox |
      | Confirm Password | the-quick-brown-fox |
    And I press the "Create" button
    Then I should see a "Saved member" message

    When I go to "admin/security/"
    Then I should see "john.doe@example.org" in the "#Form_EditForm_users" element

  @modal
  Scenario: I can navigate users from the edit form and retain my search query
    When I click the "Users" CMS tab
    And I press the "First Name" button

    Then I should see "admin@example.org" in the "#Form_EditForm_users" element
    And I should see "othermember@example.org" in the "#Form_EditForm_users" element
    And I should see "staffmember@example.org" in the "#Form_EditForm_users" element

    When I click "othermember@example.org" in the "#Form_EditForm_users" element
    And I follow "Go to next record"
    Then the "Email" field should contain "staffmember@example.org"

    When I follow "Go to previous record"
    Then the "Email" field should contain "othermember@example.org"
    When I fill in "FirstName" with "Staff Renamed"
    And I follow "Add new record"
    Then I see the text "Are you sure you want to navigate away from this page?" in the alert
    And I dismiss the dialog

    When I go to "admin/security/"
    Then I confirm the dialog

  Scenario: I can edit an existing user and add him to an existing group
    When I go to "admin/security/"
    And I click the "Users" CMS tab
    And I click "staffmember@example.org" in the "#Form_EditForm_users" element
    And I select "ADMIN group" from "Groups"
    And I press the "Apply changes|Save" buttons
    Then I should see a "Saved Member" message

    When I go to "admin/security"
    And I click the "Groups" CMS tab
    And I click "ADMIN group" in the "#Form_EditForm_groups" element
    Then I should see "staffmember@example.org"

  Scenario: I can delete an existing user
    When I click the "Users" CMS tab
    And I click "staffmember@example.org" in the "#Form_EditForm_users" element
    And I press the "Delete" button, confirming the dialog
    Then I should see "admin@example.org"
    And I should not see "staffmember@example.org"
