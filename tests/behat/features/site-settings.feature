@retry @job3
Feature: Site settings
  As a site owner
  I want to be able to change site settings

  Background:
    Given a "page" "Home"
    And a "page" "MyPage"
    When I am logged in with "ADMIN" permissions
    And I go to "/admin/pages"
    And I follow "Home"
    And I press the "Publish" button
    And I follow "MyPage"
    And I press the "Publish" button
    
  Scenario: Change site visibility

    # Beocome an anonymous user
    Given I go to "/Security/login"
    And I press the "Log in as someone else" button
    
    # Anonymous user can view page
    When I go to "/home"
    Then I should see "Home"

    # Change site visbility
    When I am logged in with "ADMIN" permissions
    When I go to "/admin/settings"
    When I click the "Access" CMS tab
    And I select the "Form_EditForm_CanViewType_LoggedInUsers" radio button
    And I press the "Save" button
    When I go to "/Security/login"
    And I press the "Log in as someone else" button

    # Anonymous user can no longer view page
    When I go to "/home"
    Then I should not see "Home"

  Scenario: Change website name
    When I go to "/admin/settings"
    And I fill in "Site title" with "My website"
    And I press the "Save" button
    When I go to "/mypage"
    Then the rendered HTML should contain "My website"
