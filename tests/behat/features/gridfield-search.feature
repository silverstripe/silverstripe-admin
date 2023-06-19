Feature: Search in GridField
  As an author
  I want to search an item in the CMS
  So that I see proper result and don't see warning

  Background:
    Given the "Company" "Walmart" with "Category"="Retail"
    And the "Company" "ExxonMobil" with "Category"="Oil"
    And the "Company" "Chevron" with "Category"="Oil"
    And the "Company" "ConocoPhillips" with "Category"="Oil"
    And the "Company" "Saudi Aramco" with "Category"="Oil"
    And the "Company" "Eni" with "Category"="Oil"
    And the "Company" "Gazprom" with "Category"="Oil"
    And the "Company" "Pemex" with "Category"="Oil"
    And the "Company" "Vitol" with "Category"="Other"
    And the "group" "EDITOR" has permissions "Access to 'Pages' section" and "Access to 'Test ModelAdmin' section" and "Access to 'GridField Test Navigation' section" and "TEST_DATAOBJECT_EDIT"
    And I am logged in as a member of "EDITOR" group

  Scenario: I can search and go to item
    When I go to "/admin/test"
      And I press the "Open search and filter" button
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

  Scenario: I can see pagination after search
    When I go to "/admin/gridfield-test-navigation"
      And I should see "Walmart" in the "#Form_EditForm" element
      And I press the "Open search and filter" button
      And I press the "Advanced" button
      And I fill in "Search__Category" with "Oil"
      And I press the "Enter" key in the "Search__Category" field
    Then I should see "ExxonMobil" in the "#Form_EditForm" element
      But I should not see "Walmart" in the ".col-Name" element
      And I should not see "Vitol" in the ".col-Name" element
      And I should see "1" in the ".pagination-page-number" element
      And I should see "View 1–5 of 7" in the ".pagination-records-number" element
