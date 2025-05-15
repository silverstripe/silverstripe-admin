@modal @retry @job3
Feature: Reauthenticate
  As a content editor
  I want to be able to log in through a CMS popup when my session expires
  So that I can avoid losing unsaved work

  Background:
    Given the "group" "EDITOR" has permissions "Access to 'Pages' section"
      And I am logged in as a member of "EDITOR" group
      And I go to "/admin/pages"
      And I am not in an iframe
      And I wait for 3 seconds
      And my session expires

  Scenario: Reauthenticate with correct login
    When I press the "Add new" button
    Then I should see "Login" in the ".login-dialog" element
    When I switch to the "login-dialog-iframe" iframe
    Then I should see "Your session has timed out due to inactivity" in the ".cms-security__container" element
      And I should see a "Let me back in" button
    When I fill in "Password" with "Secret!123"
      And I press the "Let me back in" button
      And I am not in an iframe
      Then I should not see the ".login-dialog" element
    When I go to "/admin/pages"
      And I press the "Add new" button
    Then I should see "Create" in the "#Form_AddForm_action_doAdd" element

  Scenario: Reauthenticate with wrong login
    When I press the "Add new" button
      And I switch to the "login-dialog-iframe" iframe
    Then I should see a "Let me back in" button
    When I fill in "Password" with "wrong password"
      And I press the "Let me back in" button
    Then I should see "The provided details don't seem to be correct. Please try again."
    When I fill in "Password" with "Secret!123"
      And I press the "Let me back in" button
      And I am not in an iframe
      And I go to "/admin/pages"
    When I press the "Add new" button
    Then I should see "Create" in the "#Form_AddForm_action_doAdd" element
