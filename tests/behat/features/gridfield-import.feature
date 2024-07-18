@retry @job1
Feature: Import in GridField
  As a site owner
  I want confidence that only users with permission can import records
  So that I can sleep at night

  Background:
    Given the "Company" "Walmart" with "Category"="Retail"
    And I am logged in with "ADMIN" permissions

  Scenario: I can create new records via the import form
    When I go to "/admin/test"
    Then I should see 1 ".col-Name" elements
    And I press the "Import CSV" button
    Then I should see the "#Form_ImportForm" element
    When I attach the file "import-company-create.csv" to the "_CsvFile" field
    And I press the "Import from CSV" button
    Then I should see "Imported 1 record" in the "#Form_ImportForm" element
    And I should see 2 ".col-Name" elements

  Scenario: I cannot create new records without permission
    Given I add an extension "SilverStripe\Admin\Tests\Behat\Context\Extension\CannotCreateExtension" to the "SilverStripe\FrameworkTest\Model\Company" class
    When I go to "/admin/test"
    And I press the "Import CSV" button
    Then I should see the "#Form_ImportForm" element
    When I attach the file "import-company-create.csv" to the "_CsvFile" field
    And I press the "Import from CSV" button
    Then I should see "Not allowed to create 'Company' records" in the "#Form_ImportForm" element
    And I should see 1 ".col-Name" elements
    And I should see "Walmart" in the ".col-Name" element

  Scenario: I can edit existing records via the import form
    # To edit, we have to rely on IDs - so start by validating that a record with that ID exists at all.
    When I go to "/admin/test/SilverStripe-FrameworkTest-Model-Company/EditForm/field/SilverStripe-FrameworkTest-Model-Company/item/1"
    # Check we are viewing a record (we don't know or care what it's called)
    Then I should see "Main" in the "div.cms-content-header-tabs" element
    # Check we didn't get a not found error
    And I should not see "Not Found"
    When I go to "/admin/test"
    And I press the "Import CSV" button
    Then I should see the "#Form_ImportForm" element
    When I attach the file "import-company-edit.csv" to the "_CsvFile" field
    And I press the "Import from CSV" button
    Then I should see "Updated 1 record" in the "#Form_ImportForm" element
    And I should see 1 ".col-Name" elements
    And I should not see "Walmart" in the ".col-Name" element
    And I should see "Some other company" in the ".col-Name" element

  Scenario: I cannot edit existing records without permission
    Given I add an extension "SilverStripe\Admin\Tests\Behat\Context\Extension\CannotEditExtension" to the "SilverStripe\FrameworkTest\Model\Company" class
    # We can't check if the record exists here because we don't have permission! But if it doesn't, this test will fail anyway.
    When I go to "/admin/test"
    And I press the "Import CSV" button
    Then I should see the "#Form_ImportForm" element
    When I attach the file "import-company-edit.csv" to the "_CsvFile" field
    And I press the "Import from CSV" button
    Then I should see "Not allowed to edit 'Company' records" in the "#Form_ImportForm" element
    And I should see 1 ".col-Name" elements
    And I should see "Walmart" in the ".col-Name" element
    And I should not see "Some other company" in the ".col-Name" element

  Scenario: I can delete records via the import form
    When I go to "/admin/test"
    And I press the "Import CSV" button
    Then I should see the "#Form_ImportForm" element
    When I attach the file "import-company-delete.csv" to the "_CsvFile" field
    And I check "Replace data"
    And I press the "Import from CSV" button
    Then I should see "Nothing to import" in the "#Form_ImportForm" element
    And I should see "No items found" in the ".ss-gridfield-items" element
    And I should not see the ".col-Name" element

  Scenario: I cannot delete records without permission
    Given I add an extension "SilverStripe\Admin\Tests\Behat\Context\Extension\CannotDeleteExtension" to the "SilverStripe\FrameworkTest\Model\Company" class
    When I go to "/admin/test"
    And I press the "Import CSV" button
    Then I should see the "#Form_ImportForm" element
    When I attach the file "import-company-delete.csv" to the "_CsvFile" field
    And I check "Replace data"
    And I press the "Import from CSV" button
    Then I should see "Not allowed to delete 'Company' records" in the "#Form_ImportForm" element
    And I should not see "No items found" in the ".ss-gridfield-items" element
    And I should see 1 ".col-Name" elements
    And I should see "Walmart" in the ".col-Name" element
