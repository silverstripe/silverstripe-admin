@javascript @retry
Feature: Manage users
  As a site administrator
  I want to create and manage user accounts on my site
  So that I can control access to the CMS

  Background:
    Given a "member" "ADMIN" belonging to "ADMIN group" with "Email"="admin@example.org"
    And the "member" "ADMIN" belonging to "ADMIN group2"
    And a "member" "Staff" belonging to "Staff group" with "Email"="staffmember@example.org"
    And the "group" "ADMIN group" has permissions "Full administrative rights"
    And the "group" "ADMIN group2" has permissions "Full administrative rights"
    And I am logged in with "ADMIN" permissions
    And I go to "/admin/security"


  Scenario: I cannot remove my admin access, but can remove myself from an admin group
    When I click the "Groups" CMS tab
      And I click "ADMIN group" in the "#Root_Groups" element
      And I should see the "Unlink" button in the "Members" gridfield for the "ADMIN" row
    Then I click "Groups" in the ".breadcrumbs-wrapper" element
      And I click the "Groups" CMS tab
      And I click "ADMIN group2" in the "#Root_Groups" element
      And I should see the "Unlink" button in the "Members" gridfield for the "ADMIN" row
    Then I click the "Unlink" button in the "Members" gridfield for the "ADMIN" row
      And I should not see the "Unlink" button in the "Members" gridfield for the "ADMIN" row
    Then I click "Groups" in the ".breadcrumbs-wrapper" element
      And I click the "Groups" CMS tab
      And I click "ADMIN group" in the "#Root_Groups" element
      And I should not see the "Unlink" button in the "Members" gridfield for the "ADMIN" row

  Scenario: I can list all users regardless of group
    When I click the "Users" CMS tab
    Then I should see "admin@example.org" in the "#Root_Users" element
    And I should see "staffmember@example.org" in the "#Root_Users" element

  Scenario: I can search for an existing user by name
    When I click the "Users" CMS tab
    And I press the "Open search and filter" button
    And I fill in "SearchBox__FirstName" with "ADMIN"
    And I press the "Enter" key in the "SearchBox__FirstName" field
    Then I should see "admin@example.org" in the "#Root_Users" element
    But I should not see "staffmember@example.org" in the "#Root_Users" element
    # Required to avoid "unsaved changes" browser dialog
    Then I press the "Close" button

  Scenario: I can search for an existing user by email
    When I click the "Users" CMS tab
    And I press the "Open search and filter" button
    And I press the "Advanced" button
    And I fill in "Search__Email" with "staffmember@example.org"
    And I press the "Search" button
    Then I should see "staffmember@example.org" in the "#Root_Users" element
    But I should not see "admin@example.org" in the "#Root_Users" element
    # Required to avoid "unsaved changes" browser dialog
    Then I press the "Close" button

  Scenario: I can clear a search for an existing user
    Given I click the "Users" CMS tab
    And I press the "Open search and filter" button
    And I press the "Advanced" button
    And I fill in "Search__Email" with "staffmember@example.org"
    And I press the "Search" button
    And I should see "staffmember@example.org" in the "#Root_Users" element
    And I should not see "admin@example.org" in the "#Root_Users" element
    When I press the "Close" button
    Then I should see a "Open search and filter" button
    And I should see "staffmember@example.org" in the "#Root_Users" element
    And I should see "admin@example.org" in the "#Root_Users" element

  Scenario: I can list all users in a specific group
    When I click the "Groups" CMS tab
    # TODO Please check how performant this is
    And I click "ADMIN group" in the "#Root_Groups" element
    Then I should see "admin@example.org" in the "#Root_Members" element
    And I should not see "staffmember@example.org" in the "#Root_Members" element

  Scenario: I can add a user to the system
    When I click the "Users" CMS tab
    And I press the "Add Member" button
    And I fill in the following:
      | First Name | Other Staff |
      | Surname | Doe |
      | Email | john.doe@example.org |
    And I press the "Create" button
    Then I should see a "Saved member" message

    When I go to "admin/security/"
    Then I should see "john.doe@example.org" in the "#Root_Users" element

  Scenario: I can navigate users from the edit form and retain my search query
    When I press the "Open search and filter" button
    And I press the "Advanced" button
    And I fill in "Search__FirstName" with "Staff"
    And I press the "Search" button
    Then I should see "staffmember@example.org" in the "#Root_Users" element
    And I should see "john.doe@example.org" in the "#Root_Users" element
    But I should not see "admin@example.org" in the "#Root_Users" element

    When I click "john.doe@example.org" in the "#Root_Users" element
    And I press the "Next" button
    Then the "Email" field should contain "staffmember@example.org"
    When I press the "Previous" button
    Then the "Email" field should contain "john.doe@example.org"

  Scenario: I can edit an existing user and add him to an existing group
    When I go to "admin/security/"
    And I click the "Users" CMS tab
    And I click "staffmember@example.org" in the "#Root_Users" element
    And I select "ADMIN group" from "Groups"
    And I press the "Apply changes" button
    Then I should see a "Saved Member" message

    When I go to "admin/security"
    And I click the "Groups" CMS tab
    And I click "ADMIN group" in the "#Root_Groups" element
    Then I should see "staffmember@example.org"

  Scenario: I can delete an existing user
    When I click the "Users" CMS tab
    And I click "staffmember@example.org" in the "#Root_Users" element
    And I press the "Delete" button, confirming the dialog
    Then I should see "admin@example.org"
    And I should not see "staffmember@example.org"
