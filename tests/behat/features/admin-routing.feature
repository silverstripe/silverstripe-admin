@retry @job2
Feature: Single-page routing works as expected
  As a content author
  I want to single-page-routing to work as expected
  So that I can get to the areas I want to get to

  Background:
    Given I have a config file "fake-asset-admin.yml"
      And the "Employee" "Employee A" with "Email"="test@example.com" and "Biography"="<p>some content here</p>" and "DateOfBirth"="1990-06-09"
      And the "group" "EDITOR" has permissions "Access to 'Test ModelAdmin' section" and "TEST_DATAOBJECT_EDIT"
      And I am logged in as a member of "EDITOR" group

  Scenario: Admin sections can start with the same string as a react section
    When I go to "/admin/assets-test"
    Then I should see "Add Company"
