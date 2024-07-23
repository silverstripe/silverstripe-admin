@retry @job1
Feature: Render HTML in GridField
  As a developer
  I want to have the ability to render HTML in a GridField column
  So that I have greater control over how my data is presented to content authors

  Background:
    Given I add an extension "SilverStripe\Admin\Tests\Behat\Context\Extension\MemberEmailLinkExtension" to the "SilverStripe\Admin\SecurityAdmin" class
    Given a "member" "some user" with "Email"="00me@example.com"
    And I am logged in with "ADMIN" permissions
    And I go to "/admin/security/users"

  Scenario: I see the rendered HTML in the GridField
    # sort by Email so we've definitely got our user on the screen
    Given I press the "Email" button
    Then I should see "00me@example.com" in the "a#some-user" element
