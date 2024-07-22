@retry @job1
Feature: Search in GridField
  As an author
  I want to navigate through the filtered and sorted GridField list
  So that I see the filtered and sorted GridField when I navigate to an item and back to the GridFIeld list

  Background:
    Given the "Company" "Walmart" with "Category"="Retail"
      And the "Employee" "Alen" with "Company"="1"
      And the "Employee" "Bill" with "Company"="1"
      And the "Employee" "Ford" with "Company"="1"
      And the "Company" "ExxonMobil" with "Category"="Oil"
      And the "Company" "Vitol" with "Category"="Other"
      And the "Company" "Safeway" with "Category"="Other"
      And the "Company" "SuperValue" with "Category"="Other"
      And the "Company" "UBS" with "Category"="Other"
      And the "Company" "Kraft Foods" with "Category"="Other"
      And the "Company" "Ahold" with "Category"="Other"
      And the "Company" "Cisco" with "Category"="Other"
      And the "Company" "Bouygues" with "Category"="Other"
      And the "Company" "Insurance" with "Category"="Other"
      And the "group" "EDITOR" has permissions "Access to 'Pages' section" and "Access to 'GridField Test Navigation' section" and "TEST_DATAOBJECT_EDIT"
      And I am logged in as a member of "EDITOR" group

  Scenario: I can navigate back through the GridField items by using the "previous record" button
    When I go to "/admin/gridfield-test-navigation"
      And I should see "Walmart" in the "#Form_EditForm" element
      And I should see "ExxonMobil" in the "#Form_EditForm" element
      And I should see "Vitol" in the "#Form_EditForm" element
      And I should see "Safeway" in the "#Form_EditForm" element
      And I should see "SuperValue" in the "#Form_EditForm" element
      But I should not see "UBS" in the ".col-Name" element
      And I should see "3" in the ".pagination-page-number" element
      And I should see "View 1–5 of 11" in the ".pagination-records-number" element
    Then I click on the "#action_pagination_next" element
      And I should see "View 6–10 of 11" in the ".pagination-records-number" element
      And I should see "UBS" in the "#Form_EditForm" element
      And I should see "Kraft Foods" in the "#Form_EditForm" element
      And I should see "Ahold" in the "#Form_EditForm" element
      And I should see "Cisco" in the "#Form_EditForm" element
      And I should see "Bouygues" in the "#Form_EditForm" element
      But I should not see "Insurance" in the ".col-Name" element
    Then I click "Cisco" in the "#Form_EditForm" element
      And I should see "Cisco" in the ".breadcrumbs-wrapper" element
      And I should see an "#Form_ItemEditForm_PreviousAndNextGroup_Holder" element
    Then I click on the ".action--previous" element
      And I should see "Ahold" in the ".breadcrumbs-wrapper" element
      And I click on the ".action--previous" element
      And I should see "Kraft Foods" in the ".breadcrumbs-wrapper" element
      And I click on the ".action--previous" element
      And I should see "UBS" in the ".breadcrumbs-wrapper" element
      And I click on the ".action--previous" element
      And I should see "SuperValue" in the ".breadcrumbs-wrapper" element
    Then I click on the ".toolbar__back-button" element
      And I should see "View 1–5 of 11" in the ".pagination-records-number" element
    Then I click "SuperValue" in the "#Form_EditForm" element
      And I click on the ".action--previous" element
      And I should see "Safeway" in the ".breadcrumbs-wrapper" element
      And I click on the ".action--previous" element
      And I should see "Vitol" in the ".breadcrumbs-wrapper" element
      And I click on the ".action--previous" element
      And I should see "ExxonMobil" in the ".breadcrumbs-wrapper" element
      And I click on the ".action--previous" element
      And I should see "Walmart" in the ".breadcrumbs-wrapper" element
      And I should see an ".action--previous.disabled" element
      And I click on the ".action--next" element
      And I should see "ExxonMobil" in the ".breadcrumbs-wrapper" element

  Scenario: I can navigate forward through the GridField items by using the "next record" button
    When I go to "/admin/gridfield-test-navigation"
      And I should see "Walmart" in the "#Form_EditForm" element
      And I should see "ExxonMobil" in the "#Form_EditForm" element
      And I should see "Vitol" in the "#Form_EditForm" element
      And I should see "Safeway" in the "#Form_EditForm" element
      And I should see "SuperValue" in the "#Form_EditForm" element
      But I should not see "UBS" in the ".col-Name" element
      And I should see "3" in the ".pagination-page-number" element
      And I should see "View 1–5 of 11" in the ".pagination-records-number" element
    Then I click "Walmart" in the "#Form_EditForm" element
      And I should see "Walmart" in the ".breadcrumbs-wrapper" element
      And I should see an "#Form_ItemEditForm_PreviousAndNextGroup_Holder" element
    Then I click on the ".action--next" element
      And I should see "ExxonMobil" in the ".breadcrumbs-wrapper" element
      And I click on the ".action--next" element
      And I should see "Vitol" in the ".breadcrumbs-wrapper" element
      And I click on the ".action--next" element
      And I should see "Safeway" in the ".breadcrumbs-wrapper" element
      And I click on the ".action--next" element
      And I should see "SuperValue" in the ".breadcrumbs-wrapper" element
      And I click on the ".action--next" element
      And I should see "UBS" in the ".breadcrumbs-wrapper" element
    Then I click on the ".toolbar__back-button" element
      And I should see "View 6–10 of 11" in the ".pagination-records-number" element
    Then I click "UBS" in the "#Form_EditForm" element
      And I click on the ".action--next" element
      And I should see "Kraft Foods" in the ".breadcrumbs-wrapper" element
      And I click on the ".action--next" element
      And I should see "Ahold" in the ".breadcrumbs-wrapper" element
      And I click on the ".action--next" element
      And I should see "Cisco" in the ".breadcrumbs-wrapper" element
      And I click on the ".action--next" element
      And I should see "Bouygues" in the ".breadcrumbs-wrapper" element
      And I click on the ".action--next" element
      And I should see "Insurance" in the ".breadcrumbs-wrapper" element
      And I should see an ".action--next.disabled" element
      And I click on the ".action--previous" element
      And I should see "Bouygues" in the ".breadcrumbs-wrapper" element
    Then I click on the ".toolbar__back-button" element
    Then I click on the "#action_SetOrderName" element
    Then I click on the "#action_pagination_prev" element
      And I should see "View 1–5 of 11" in the ".pagination-records-number" element
      And I should see "Ahold" in the "#Form_EditForm" element
      And I should see "Bouygues" in the "#Form_EditForm" element
      And I should see "Cisco" in the "#Form_EditForm" element
      And I should see "ExxonMobil" in the "#Form_EditForm" element
      And I should see "Insurance" in the "#Form_EditForm" element
    Then I click on the "#action_pagination_next" element
      And I should see "View 6–10 of 11" in the ".pagination-records-number" element
      And I should see "Kraft Foods" in the "#Form_EditForm" element
      And I should see "Safeway" in the "#Form_EditForm" element
      And I should see "SuperValue" in the "#Form_EditForm" element
      And I should see "UBS" in the "#Form_EditForm" element
      And I should see "Vitol" in the "#Form_EditForm" element
    Then I click "Vitol" in the "#Form_EditForm" element
      And I should see "Vitol" in the ".breadcrumbs-wrapper" element
      And I click on the ".action--previous" element
      And I should see "UBS" in the ".breadcrumbs-wrapper" element
      And I click on the ".action--previous" element
      And I should see "SuperValue" in the ".breadcrumbs-wrapper" element
      And I click on the ".action--previous" element
      And I should see "Safeway" in the ".breadcrumbs-wrapper" element
      And I click on the ".action--previous" element
      And I should see "Kraft Foods" in the ".breadcrumbs-wrapper" element
      And I click on the ".action--previous" element
      And I should see "Insurance" in the ".breadcrumbs-wrapper" element
      And I click on the ".action--previous" element
      And I should see "ExxonMobil" in the ".breadcrumbs-wrapper" element
      Then I click on the ".toolbar__back-button" element
      And I should see "View 1–5 of 11" in the ".pagination-records-number" element

  Scenario: I can navigate back and forward through the GridField items and keep filtered order
    When I go to "/admin/gridfield-test-navigation"
      And I should see "Walmart" in the "#Form_EditForm" element
      And I should see "ExxonMobil" in the "#Form_EditForm" element
      And I should see "Vitol" in the "#Form_EditForm" element
      And I should see "Safeway" in the "#Form_EditForm" element
      And I should see "SuperValue" in the "#Form_EditForm" element
      But I should not see "UBS" in the ".col-Name" element
      And I should see "3" in the ".pagination-page-number" element
      And I should see "View 1–5 of 11" in the ".pagination-records-number" element
    Then I click "Walmart" in the "#Form_EditForm" element
      And I should see "Walmart"
      And I should see an "#Form_ItemEditForm_PreviousAndNextGroup_Holder" element
    Then I click on the ".action--next" element
      And I should see "ExxonMobil"
      And I click on the ".action--next" element
      And I should see "Vitol"
      And I click on the ".action--next" element
      And I should see "Safeway"
      And I click on the ".action--next" element
      And I should see "SuperValue"
      And I click on the ".action--next" element
      And I should see "UBS"
    Then I click on the ".toolbar__back-button" element
      And I should see "View 6–10 of 11" in the ".pagination-records-number" element
    Then I click "UBS" in the "#Form_EditForm" element
      And I click on the ".action--next" element
      And I should see "Kraft Foods"
    Then I click on the ".toolbar__back-button" element
    Then I click on the "#action_SetOrderName" element
    Then I click on the "#action_pagination_prev" element
      And I should see "View 1–5 of 11" in the ".pagination-records-number" element
      And I should see "Ahold" in the "#Form_EditForm" element
      And I should see "Bouygues" in the "#Form_EditForm" element
      And I should see "Cisco" in the "#Form_EditForm" element
      And I should see "ExxonMobil" in the "#Form_EditForm" element
      And I should see "Insurance" in the "#Form_EditForm" element
    Then I click on the "#action_pagination_next" element
      And I should see "View 6–10 of 11" in the ".pagination-records-number" element
      And I should see "Kraft Foods" in the "#Form_EditForm" element
      And I should see "Safeway" in the "#Form_EditForm" element
      And I should see "SuperValue" in the "#Form_EditForm" element
      And I should see "UBS" in the "#Form_EditForm" element
      And I should see "Vitol" in the "#Form_EditForm" element
    Then I click "Vitol" in the "#Form_EditForm" element
      And I should see "Vitol"
      And I click on the ".action--previous" element
      And I should see "UBS"
      And I click on the ".action--previous" element
      And I should see "SuperValue"
      And I click on the ".action--previous" element
      And I should see "Safeway"
      And I click on the ".action--previous" element
      And I should see "Kraft Foods"
      And I click on the ".action--previous" element
      And I should see "Insurance"
      And I click on the ".action--previous" element
      And I should see "ExxonMobil"
      Then I click on the ".toolbar__back-button" element
      And I should see "View 1–5 of 11" in the ".pagination-records-number" element

  Scenario: I can navigate back and forward through the GridField
    When I am on "/admin/pages"
    Then I go to "/admin/gridfield-test-navigation"
    When I press the "Open search and filter" button
      And I press the "Advanced" button
      And I fill in "Search__Category" with "Retail"
      And I press the "Enter" key in the "Search__Category" field
    Then I should see "Walmart" in the "#Form_EditForm" element
      But I should not see "ExxonMobil" in the ".col-Name" element
      And I should not see "Vitol" in the ".col-Name" element
      And I should not see "Safeway" in the ".col-Name" element
      And I should not see "SuperValue" in the ".col-Name" element
    When I move backward one page
      And I should see "Pages"
    When I move forward one page
    Then I should see "Walmart" in the "#Form_EditForm" element
      But I should not see "ExxonMobil" in the ".col-Name" element
      And I should not see "Vitol" in the ".col-Name" element
      And I should not see "Safeway" in the ".col-Name" element
      And I should not see "SuperValue" in the ".col-Name" element
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
      And I should not see "Safeway" in the ".col-Name" element
      And I should not see "SuperValue" in the ".col-Name" element
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
      And I should not see "Safeway" in the ".col-Name" element
      And I should not see "SuperValue" in the ".col-Name" element
      And I should see an "#SilverStripe-FrameworkTest-Model-CompanySearch_searchbox" element
