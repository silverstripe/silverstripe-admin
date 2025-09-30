@retry @job2
Feature: Use Gridfield with arbitrary data
  As a developer
  I want to be able to view and edit data from some arbitrary source
  So that I don't need multiple websites or tools to manage my data

  Background:
    Given the "group" "EDITOR" has permissions "Access to all CMS sections"
      And I am logged in as a member of "EDITOR" group

  Scenario: I can view my editable arbitrary data in a gridfield
    When I go to "/admin/arbitrary-data/custommodel"
      # Check the items are displaying, appropriate gridfield elements exist, and the first page is limited correctly
      Then I should see "Title" in the "th.col-action_SetOrderTitle" element
      And I should see "Created" in the "th.col-action_SetOrderCreated" element
      And I should see "LastEdited" in the "th.col-action_SetOrderLastEdited" element
      And I should see "item 1" in the "#Form_EditForm" element
      And I should see "item 10" in the "#Form_EditForm" element
      And I should see the ".pagination-page-number input[value='1']" element
      And I should see "View 1–10 of 30" in the ".pagination-records-number" element
      And I should see the "Edit" button in the "custommodel" gridfield for the "item 1" row
      And I should see the "Delete" button in the "custommodel" gridfield for the "item 1" row
      And I should see "Add" in the ".btn-toolbar" element
      But I should not see "item 11" in the "#Form_EditForm" element
      And I should not see the ".pagination-page-number input[value='2']" element
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
      And I should see the "input#Form_ItemEditForm_Title" element
      And I should see the "input#Form_ItemEditForm_Title[value='item 11']" element
      But I should not see the "#Form_ItemEditForm_Title.readonly" element
      # Validate we have the appropriate modification actions
      And I should see the "button#Form_ItemEditForm_action_doSave" element
      And I should see "Save" in the "button#Form_ItemEditForm_action_doSave" element
      And I should see the "button#Form_ItemEditForm_action_doDelete" element
      And I should see the "a.action--new" element
      But I should not see "Create" in the "button#Form_ItemEditForm_action_doSave" element
      And I should not see "Cancel" in the ".btn-toolbar" element
    Then I click on the ".toolbar__back-button" element
      # And we can go back out to the gridfield again
      And I should see "View 11–20 of 30" in the ".pagination-records-number" element

  Scenario: I can sort my editable arbitrary data in the gridfield
    When I go to "/admin/arbitrary-data/custommodel"
      # Just double check we're seeing the correct items to start with
      Then I should see "item 1" in the "#Form_EditForm" element
      And I should see "item 10" in the "#Form_EditForm" element
      But I should not see "item 11" in the "#Form_EditForm" element
      And I should not see "item 30" in the "#Form_EditForm" element
    # We can't rely on ID here since the ID isn't 100% deterministic.
    # The title will be sorted as a string, so instead of "item 1", "item 2", etc it'll be
    # "item 1", "item 10", "item 11", "item 12", etc.
    # Descending it'll be 9, 8, 7 ... 4, 30, 3, 29, 28.
    When I press the "Title" button
      # The first click sorts in ascending order
      Then I should see "item 1" in the "#Form_EditForm" element
      Then I should see "item 12" in the "#Form_EditForm" element
      And I should see "item 18" in the "#Form_EditForm" element
      But I should not see "item 19" in the "#Form_EditForm" element
      And I should not see "item 20" in the "#Form_EditForm" element
      And I should not see "item 30" in the "#Form_EditForm" element
    When I press the "Title" button
      # The second click sorts in descending order
      Then I should see "item 9" in the "#Form_EditForm" element
      And I should see "item 30" in the "#Form_EditForm" element
      And I should see "item 4" in the "#Form_EditForm" element
      And I should see "item 28" in the "#Form_EditForm" element
      But I should not see "item 27" in the "#Form_EditForm" element
      And I should not see "item 15" in the "#Form_EditForm" element
      And I should not see "item 10" in the "#Form_EditForm" element
      And I should not see "item 1" in the "#Form_EditForm" element
    When I press the "Title" button
      # And then we're back to ascending order
      Then I should see "item 1" in the "#Form_EditForm" element
      Then I should see "item 12" in the "#Form_EditForm" element
      And I should see "item 18" in the "#Form_EditForm" element
      But I should not see "item 19" in the "#Form_EditForm" element
      And I should not see "item 20" in the "#Form_EditForm" element
      And I should not see "item 30" in the "#Form_EditForm" element

  Scenario: I can filter my editable arbitrary data in the gridfield
    When I go to "/admin/arbitrary-data/custommodel"
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
      Then I should see "item 13" in the "#Form_EditForm" element
      And I should see "item 23" in the "#Form_EditForm" element
      And I should see "item 30" in the "#Form_EditForm" element
      # We can't say we shouldn't see "item 1" because "item 13" starts with that string.
      # So we just look for "4" instead.
      But I should not see "item 4" in the "#Form_EditForm" element
      And I should not see "item 10" in the "#Form_EditForm" element
      And I should not see "item 15" in the "#Form_EditForm" element
      And I should not see "item 20" in the "#Form_EditForm" element
      And I should not see "item 29" in the "#Form_EditForm" element

  Scenario: I can edit my editable arbitrary data
    When I go to "/admin/arbitrary-data/custommodel"
      Then I should see "item 4" in the "#Form_EditForm" element
      But I should not see "updated item" in the "#Form_EditForm" element
    When I click "item 4" in the "#Form_EditForm" element
    And I fill in "Title" with "updated item"
    And I press the "Save" button
      # Validate it saved and is displaying correctly
      Then I should see a "Saved Arbitrary Datum "updated item" successfully." success toast
      And I should see the "input#Form_ItemEditForm_Title[value='updated item']" element
      # Validate we have the appropriate modification actions
      And I should see the "button#Form_ItemEditForm_action_doSave" element
      And I should see "Save" in the "button#Form_ItemEditForm_action_doSave" element
      But I should not see "Create" in the "button#Form_ItemEditForm_action_doSave" element
      And I should not see "Cancel" in the ".btn-toolbar" element
    Then I click on the ".toolbar__back-button" element
      # And we can go back out to the gridfield again and see our edited item
      Then I should see "updated item" in the "#Form_EditForm" element
      But I should not see "item 4" in the "#Form_EditForm" element

  Scenario: I can create new editable arbitrary data
    When I go to "/admin/arbitrary-data/custommodel"
    And I press the "Add new Arbitrary Datum" button
      # Validate it's a new item with no preset data
      Then I should see "New Arbitrary Datum" in the ".breadcrumbs-wrapper" element
      And I should see the "input#Form_ItemEditForm_Title" element
      And I should not see the "input#Form_ItemEditForm_Title[value]" element
      # Validate we have the appropriate modification actions
      And I should see the "button#Form_ItemEditForm_action_doSave" element
      And I should see "Create" in the "button#Form_ItemEditForm_action_doSave" element
      And I should see "Cancel" in the ".btn-toolbar" element
      But I should not see "Save" in the "button#Form_ItemEditForm_action_doSave" element
    When I fill in "Title" with "this is a new item"
    And I press the "Create" button
      # Validate it saved and is displaying correctly
      Then I should see a "Saved Arbitrary Datum "this is a new item" successfully." success toast
      And I should see the "input#Form_ItemEditForm_Title[value='this is a new item']" element
      # Validate we have the appropriate modification actions
      And I should see the "button#Form_ItemEditForm_action_doSave" element
      And I should see "Save" in the "button#Form_ItemEditForm_action_doSave" element
      But I should not see "Create" in the "button#Form_ItemEditForm_action_doSave" element
      And I should not see "Cancel" in the ".btn-toolbar" element
    Then I click on the ".toolbar__back-button" element
    # The new item will be on the last page of items
    And I press the "Last" button
      # We can go back out to the gridfield again and see our new item
      Then I should see "this is a new item" in the "#Form_EditForm" element

  Scenario: I can delete editable arbitrary data
    When I go to "/admin/arbitrary-data/custommodel"
      # We have to specify fieldset because there's a message in the form saying you deleted the item
      # but that message is _not_ in the fieldset.
      Then I should see "item 4" in the "#Form_EditForm fieldset" element
    When I click "item 4" in the "#Form_EditForm" element
    # Delete from the edit form
    And I press the "Delete" button, confirming the dialog
      # Validate it deleted and we got kicked back out to the gridfield
      Then I should see a "Deleted Arbitrary Datum "item 4"" success toast
      And I should see "View 1–10" in the ".pagination-records-number" element
      And I should see "item 5" in the "#Form_EditForm fieldset" element
      But I should not see the "#Form_ItemEditForm_Title" element
      And I should not see "item 4" in the "#Form_EditForm fieldset" element
    # Delete from the gridfield view
    When I click the "Delete" button in the "custommodel" gridfield for the "item 5" row, confirming the dialog
      Then I should not see "item 5" in the "#Form_EditForm fieldset" element
