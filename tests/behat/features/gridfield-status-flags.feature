@retry @job1
Feature: Search in GridField
  As a content author
  I want to see the status flags for records in gridfields
  So that I can see at a glance what state my data is in

  Background:
    Given the "Company" "Walmart" with "Category"="Retail"
      And the "group" "EDITOR" has permissions "Access to 'Pages' section" and "Access to 'GridField Test Navigation' section" and "TEST_DATAOBJECT_EDIT"
      And I am logged in as a member of "EDITOR" group

  Scenario: I see status flags in gridfields
    When I go to "/admin/gridfield-test-navigation"
      And I should see "Walmart" in the "#Form_EditForm .col-Name" element
      And I should see "string-flag" in the "#Form_EditForm .col-Name .badge.status-company-status-flag1" element
      And I should see "array-flag" in the "#Form_EditForm .col-Name .badge.status-company-status-flag2" element
    Then I click "Walmart" in the "#Form_EditForm" element
      And I should see "Walmart" in the ".breadcrumbs-wrapper" element
      And I should see "string-flag" in the ".breadcrumbs-wrapper .badge.status-company-status-flag1" element
      And I should see "array-flag" in the ".breadcrumbs-wrapper .badge.status-company-status-flag2" element
