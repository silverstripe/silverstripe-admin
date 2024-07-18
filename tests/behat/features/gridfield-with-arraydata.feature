@retry @job2
Feature: Use Gridfield with ArrayData
  As a developer
  I want to be able to view read-only data from some arbitrary source
  So that I don't need multiple websites or tools to view my data

  Background:
    Given the "group" "EDITOR" has permissions "Access to all CMS sections"
      And I am logged in as a member of "EDITOR" group

  Scenario: I can view my read-only ArrayData records in a gridfield
    When I go to "/admin/arbitrary-data/arraydata"
      # Check the items are displaying, appropriate gridfield elements exist, and the first page is limited correctly
      Then I should see "ID" in the "th.col-action_SetOrderID" element
      And I should see "Title" in the "th.col-action_SetOrderTitle" element
      And I should see "item 1" in the "#Form_EditForm" element
      And I should see "item 10" in the "#Form_EditForm" element
      And I should see the ".pagination-page-number input[value='1']" element
      And I should see "View 1–10 of 30" in the ".pagination-records-number" element
      And I should see the "View" button in the "arraydata" gridfield for the "item 1" row
      But I should not see "item 11" in the "#Form_EditForm" element
      And I should not see the ".pagination-page-number input[value='2']" element
      And I should not see the "Edit" button in the "arraydata" gridfield for the "item 1" row
      And I should not see the "Delete" button in the "arraydata" gridfield for the "item 1" row
      And I should not see "Add" in the ".btn-toolbar" element
    When I click on the "#action_pagination_next" element
      # Check pagination works correctly
      Then I should see "item 11" in the "#Form_EditForm" element
      And I should see "item 20" in the "#Form_EditForm" element
      And I should see the ".pagination-page-number input[value='2']" element
      And I should see "View 11–20 of 30" in the ".pagination-records-number" element
      But I should not see "item 10" in the "#Form_EditForm" element
      And I should not see the ".pagination-page-number input[value='1']" element
    When I click "item 11" in the "#Form_EditForm" element
      # Check we can view items correctly
      Then I should see "item 11" in the ".breadcrumbs-wrapper" element
      And I should see "item 11" in the "#Form_ItemEditForm_Title" element
      # Validate it's read only
      And I should see the "#Form_ItemEditForm_Title.readonly" element
      But I should not see the "input#Form_ItemEditForm_Title" element
      # Validate we don't have any modification actions
      And I should not see the "button#Form_ItemEditForm_action_doSave" element
      And I should not see the "button#Form_ItemEditForm_action_doDelete" element
      And I should not see the "a.action--new" element
      And I should not see "Cancel" in the ".btn-toolbar" element
    Then I click on the ".toolbar__back-button" element
      # And we can go back out to the gridfield again
      And I should see "View 11–20 of 30" in the ".pagination-records-number" element

  Scenario: I can sort my read-only ArrayData records in the gridfield
    When I go to "/admin/arbitrary-data/arraydata"
      # Just double check we're seeing the correct items to start with
      Then I should see "item 1" in the "#Form_EditForm" element
      And I should see "item 10" in the "#Form_EditForm" element
      But I should not see "item 11" in the "#Form_EditForm" element
      And I should not see "item 30" in the "#Form_EditForm" element
    # We can sort by ID or Title. ID will be easiest to see what's going on since it's just numeric ordering
    When I press the "ID" button
      # The first click sorts in ascending order
      Then I should see "item 1" in the "#Form_EditForm" element
      Then I should see "item 5" in the "#Form_EditForm" element
      And I should see "item 10" in the "#Form_EditForm" element
      But I should not see "item 11" in the "#Form_EditForm" element
      And I should not see "item 20" in the "#Form_EditForm" element
      And I should not see "item 30" in the "#Form_EditForm" element
    When I press the "ID" button
      # The second click sorts in descending order
      Then I should see "item 30" in the "#Form_EditForm" element
      And I should see "item 25" in the "#Form_EditForm" element
      And I should see "item 21" in the "#Form_EditForm" element
      But I should not see "item 20" in the "#Form_EditForm" element
      And I should not see "item 15" in the "#Form_EditForm" element
      And I should not see "item 1" in the "#Form_EditForm" element
    When I press the "ID" button
      # And then we're back to ascending order
      Then I should see "item 1" in the "#Form_EditForm" element
      Then I should see "item 5" in the "#Form_EditForm" element
      And I should see "item 10" in the "#Form_EditForm" element
      But I should not see "item 11" in the "#Form_EditForm" element
      And I should not see "item 20" in the "#Form_EditForm" element
      And I should not see "item 30" in the "#Form_EditForm" element

  Scenario: I can filter my read-only ArrayData records in the gridfield
    When I go to "/admin/arbitrary-data/arraydata"
      # Just double check we're seeing the correct items to start with
      Then I should see "item 3" in the "#Form_EditForm" element
      And I should see "item 4" in the "#Form_EditForm" element
      And I should see "item 10" in the "#Form_EditForm" element
      But I should not see "item 11" in the "#Form_EditForm" element
      And I should not see "item 30" in the "#Form_EditForm" element
    When I press the "Open search and filter" button
      And I press the "Advanced" button
      And I fill in "Search__Title" with "3"
      And I press the "Search" button
    Then I should see "item 3" in the "#Form_EditForm" element
      And I should see "item 13" in the "#Form_EditForm" element
      And I should see "item 23" in the "#Form_EditForm" element
      And I should see "item 30" in the "#Form_EditForm" element
      # We can't say we shouldn't see "item 1" because "item 13" starts with that string.
      # So we just look for "4" instead.
      But I should not see "item 4" in the "#Form_EditForm" element
      And I should not see "item 15" in the "#Form_EditForm" element
      And I should not see "item 20" in the "#Form_EditForm" element
      And I should not see "item 29" in the "#Form_EditForm" element
