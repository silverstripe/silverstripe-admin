Feature: Search in GridField
  As an author
  I want to search an item in the CMS
  So that I see proper result and don't see warning

  Background:
    Given the "Company" "Walmart" with "Category"="Retail"
    And the "Company" "ExxonMobil" with "Category"="Oil"
    And the "Company" "Vitol" with "Category"="Other" 
    And the "group" "EDITOR" has permissions "Access to 'Pages' section" and "Access to 'Test ModelAdmin' section" and "TEST_DATAOBJECT_EDIT"
    And I am logged in as a member of "EDITOR" group
    And I go to "/admin/test"

  Scenario: I can search and go to item
    When I press the "Open search and filter" button
      And I press the "Advanced" button
    Then I should see a "#Form_CompaniesSearchForm_Search_Name.no-change-track" element
      And I fill in "Search__Name" with "Walmart"
      And I press the "Enter" key in the "Search__Name" field
    Then I should see "Walmart" in the "#Form_EditForm" element
      But I should not see "ExxonMobil" in the ".col-Name" element
      And I should not see "Vitol" in the ".col-Name" element
      And I click "Walmart" in the "#Form_EditForm" element
    Then I should see "Walmart"
      And I should see "Walmart" in the ".breadcrumbs-wrapper" element
