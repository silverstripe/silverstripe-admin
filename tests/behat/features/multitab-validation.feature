@retry @job2
Feature: Multi-tab page validation icons
  As a content author
  I want to see which tabs have form fields that failed validation
  So that I know what I need to fix before saving

  Background:
    Given a "multi tab page" "My MultiTab Page"
    And a "single tab page" "My SingleTab Page"
    And the "group" "EDITOR" has permissions "Access to 'Pages' section"

  Scenario: I can see tab validation icons on multi-tab pages
    Given I am logged in as a member of "EDITOR" group
    And I go to "/admin/pages"
    And I should see "My MultiTab Page" in the tree
    And I click on "My MultiTab Page" in the tree
    When I press the "Save" button
    Then I can see the form validation error message
    Then I should not see an invalid tab icon on the "Second" tab
    Then I should see an invalid tab icon on the "Third" tab
    Then I should see an invalid tab icon on the "Fourth" tab
    When I click on the "#tab-Root_Third" element
    And I fill in "Third tab first field" with "abc"
    When I press the "Save" button
    Then I can see the form validation error message
    Then I should not see an invalid tab icon on the "Second" tab
    Then I should see an invalid tab icon on the "Third" tab
    Then I should see an invalid tab icon on the "Fourth" tab
    And I fill in "Third tab first field" with "abc@example.com"
    When I press the "Save" button
    Then I can see the form validation error message
    Then I should not see an invalid tab icon on the "Second" tab
    Then I should not see an invalid tab icon on the "Third" tab
    Then I should see an invalid tab icon on the "Fourth" tab
    And I fill in "Third tab first field" with "abc@example.com"
    When I press the "Save" button
    Then I can see the form validation error message
    Then I should not see an invalid tab icon on the "Second" tab
    Then I should not see an invalid tab icon on the "Third" tab
    Then I should see an invalid tab icon on the "Fourth" tab
    When I click on the "#tab-Root_Fourth" element
    And I fill in "Fourth tab first field" with "def"
    When I press the "Save" button
    Then I can not see the form validation error message
    Then I should not see an invalid tab icon on the "Second" tab
    Then I should not see an invalid tab icon on the "Third" tab
    Then I should not see an invalid tab icon on the "Fourth" tab
    When I click on the "#tab-Root_Second" element
    And I fill in "Second tab first field" with "wrong value"
    When I press the "Save" button
    Then I can see the form validation error message
    Then I should see an invalid tab icon on the "Second" tab
    Then I should not see an invalid tab icon on the "Third" tab
    Then I should not see an invalid tab icon on the "Fourth" tab
    When I fill in "Second tab first field" with "222"
    When I press the "Save" button
    Then I can not see the form validation error message
    Then I should not see an invalid tab icon on the "Second" tab
    Then I should not see an invalid tab icon on the "Third" tab
    Then I should not see an invalid tab icon on the "Fourth" tab

  Scenario: Tab validation icons dont appear on pages with a single tab
    Given I am logged in as a member of "EDITOR" group
    And I go to "/admin/pages"
    And I should see "My SingleTab Page" in the tree
    And I click on "My SingleTab Page" in the tree
    When I press the "Save" button
    Then I can see the form validation error message
    And I should not see an invalid tab icon on the "Main Content" tab
