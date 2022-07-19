Feature: Search in GridField
  As an author
  I want to search an item in the CMS
  So that I see proper result and don't see warning

  Background:
    Given the "Company" "Walmart" with "Category"="Retail"
    And the "Employee" "Alen" with "Company"="1"
    And the "Employee" "Bill" with "Company"="1"
    And the "Employee" "Ford" with "Company"="1"
    And the "Company" "ExxonMobil" with "Category"="Oil"
    And the "Company" "Vitol" with "Category"="Other" 
    And I am logged in with "ADMIN" permissions
    And I go to "/admin/test"

  Scenario: I can search and go to item
    When I press the "Open search and filter" button
      And I press the "Advanced" button
    Then I should see a "#Form_CompaniesSearchForm_Search_Name.no-change-track" element
      And I fill in "SearchBox__Name" with "Walmart"
      And I press the "Enter" key in the "SearchBox__Name" field
    Then I should see "Walmart" in the "#Form_EditForm" element
      But I should not see "ExxonMobil" in the ".col-Name" element
      And I should not see "Vitol" in the ".col-Name" element
      And I click "Walmart" in the "#Form_EditForm" element
    Then I should see "Walmart"
      And I should see "Walmart" in the ".breadcrumbs-wrapper" element

  Scenario: I can navigate back and forward through the GridField
    When I am on "/admin/pages"
    Then I go to "/admin/test"
    When I press the "Open search and filter" button
      And I press the "Advanced" button
      And I fill in "Search__Category" with "Retail"
      And I press the "Enter" key in the "Search__Category" field
    Then I should see "Walmart" in the "#Form_EditForm" element
      But I should not see "ExxonMobil" in the ".col-Name" element
      And I should not see "Vitol" in the ".col-Name" element
    When I move backward one page
      And I should see "Pages"
    When I move forward one page
    Then I should see "Walmart" in the "#Form_EditForm" element
      But I should not see "ExxonMobil" in the ".col-Name" element
      And I should not see "Vitol" in the ".col-Name" element
    When I click "Walmart" in the "#Form_EditForm" element
    Then I should see "Walmart"
    Then I click "Employees" in the ".ui-tabs-nav" element
      And I press the "Open search and filter" button
      And I press the "Advanced" button
      And I fill in "Search__Name" with "Alen"
      And I press the "Enter" key in the "Search__Category" field
    Then I should see "Alen" in the "#Form_ItemEditForm_Employees" element
      And I click "Alen" in the "#Form_ItemEditForm_Employees" element
      And I click "Walmart" in the ".breadcrumbs-wrapper" element
      And I click "Employees" in the ".ui-tabs-nav" element
    Then I should see "Alen" in the "#Form_ItemEditForm_Employees" element
      But I should not see "Bill" in the ".col-Name" element
      And I should not see "Ford" in the ".col-Name" element
      And I should see an "#EmployeesSearch_searchbox" element
    Then I click on the ".toolbar__back-button" element
      And I should see "Walmart" in the "#Form_EditForm" element
      But I should not see "ExxonMobil" in the ".col-Name" element
      And I should not see "Vitol" in the ".col-Name" element
      And I should see an "#SilverStripe-FrameworkTest-Model-CompanySearch_searchbox" element
    When I move backward one page
    Then I click "Employees" in the ".ui-tabs-nav" element
    Then I should see "Alen"
      But I should not see "Bill" in the ".col-Name" element
      And I should not see "Ford" in the ".col-Name" element
      And I should see an "#EmployeesSearch_searchbox" element
    When I move forward one page
      And I should see "Walmart" in the "#Form_EditForm" element
      But I should not see "ExxonMobil" in the ".col-Name" element
      And I should not see "Vitol" in the ".col-Name" element
      And I should see an "#SilverStripe-FrameworkTest-Model-CompanySearch_searchbox" element
