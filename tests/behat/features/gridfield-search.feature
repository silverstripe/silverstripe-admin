Feature: Search in GridField
  As an author
  I want to search an item in the CMS
  So that I see proper result and don't see warning

  Background:
    Given the "Company" "Walmart"
    And the "Company" "ExxonMobil"
    And the "Company" "Test"
    And I am logged in with "ADMIN" permissions
    And I go to "/admin/test"
    
  Scenario: I can search and go to item
    When I press the "Open search and filter" button
    And I press the "Advanced" button
    Then I should see a "#Form_CompaniesSearchForm_Search_Name.no-change-track" element
    And I fill in "SearchBox__Name" with "Walmart"
    And I press the "Enter" key in the "SearchBox__Name" field
    Then I should see "Walmart" in the "#Form_EditForm" element
    But I should not see "ExxonMobil" in the "#Form_EditForm" element
    And I should not see "Test" in the "#Form_EditForm" element
    And I click "Walmart" in the "#Form_EditForm" element
    Then I should see "Walmart"
    And I should see "Walmart" in the ".breadcrumbs-wrapper" element
