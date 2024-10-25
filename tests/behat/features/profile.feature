@retry @job3
Feature: Manage my own settings
  As a CMS user
  I want to be able to change personal settings
  In order to streamline my CMS experience

  Background:
    Given a "member" "Joe" belonging to "Admin group" with "Email"="joe@example.org" and "Password"="secret"
    And the "group" "Admin group" has permissions "Full administrative rights"
    And the "member" "Joe" belonging to "Admin group2"
    And the "group" "Admin group2" has permissions "Full administrative rights"
    And I log in with "joe@example.org" and "secret"
    And I go to "admin/myprofile"

  Scenario: I cannot remove all my admin groups
    When I click the "Admin group" option in the "DirectGroups" listbox
      And I click the "Admin group2" option in the "DirectGroups" listbox
      And I press the "Save" button
    Then I should see "Cannot remove all admin groups from your profile" in the "#Form_EditForm" element

  Scenario: I can remove one of my admin groups
    When I click the "Admin group" option in the "DirectGroups" listbox
      And I press the "Save" button
    Then I should see a "Saved" success toast
      And I should not see "Cannot remove all admin groups from your profile" in the "#Form_EditForm" element

  Scenario: I can edit my personal details
    Given I fill in "First Name" with "Jack"
    And I fill in "Surname" with "Johnson"
    And I fill in "Email" with "jack@example.org"
    When I press the "Save" button
    Given I go to "admin/myprofile"
    Then I should not see "Joe"
    Then I should see "Jack"
    And I should see "Johnson"

  Scenario: I can't reset the password without the original
    Given I follow "Change Password"
    And I fill in "Current Password" with "idontknow"
    And I fill in "New Password" with "the-quick-brown-fox"
    And I fill in "Confirm Password" with "the-quick-brown-fox"
    And I press the "Save" button
    Then I should see "The current password you have entered is not correct."

  Scenario: I can't create poor quality passwords
    Given I follow "Change Password"
    And I fill in "Current Password" with "secret"
    And I fill in "New Password" with "a"
    And I fill in "Confirm Password" with "a"
    And I press the "Save" button
    Then I should see "The password strength is too low. Please use a stronger password."

  Scenario: I can change my password
    Given I follow "Change Password"
    And I fill in "Current Password" with "secret"
    And I fill in "New Password" with "the-quick-brown-fox"
    And I fill in "Confirm Password" with "the-quick-brown-fox"
    And I press the "Save" button
    And I am not logged in
    When I log in with "joe@example.org" and "the-quick-brown-fox"
    And I go to "admin/myprofile"
    Then I should see the CMS

  Scenario: I can change the interface language
    And I select "German (Germany)" from "Interface Language"
    And I press the "Save" button
    Then I should see "Sprache"

  Scenario: Breadcrumbs are in the correct place
    Then I should see "Main" in the ".cms-content-header-tabs" element
    And I should not see "Main" in the "#Form_EditForm" element
