@retry @job2
Feature: Single-page routing works as expected
  As a content author
  I want to single-page-routing to work as expected
  So that I can get to the areas I want to get to

  Background:
    Given the "Company" "Company A" with "Category"="Other"
      And the "Employee" "Employee A" with "Email"="test@example.com" and "Biography"="<p>some content here</p>" and "DateOfBirth"="1990-06-09"
      # Page access is required to see the Company object
      And the "group" "EDITOR" has permissions "Access to 'Pages' section" and "Access to 'Test ModelAdmin' section" and "CMS_ACCESS_AssetAdmin" and "TEST_DATAOBJECT_EDIT"
      And I am logged in as a member of "EDITOR" group

  Scenario: Non-react sections correctly route to react sections
    When I go to "/admin/test"
    Then I click "Company A" in the "#Form_EditForm" element
    And I click "behat link to file" in the "#Form_ItemEditForm" element
    Then I should see "Files" in the ".cms-content.AssetAdmin .breadcrumb__container" element

  Scenario: Admin sections can start with the same string as a react section
    Given I have a config file "fake-asset-admin.yml"
    When I go to "/admin/assets-test"
    Then I should see "Add Company"
