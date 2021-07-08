@javascript @retry
Feature: Grid field
  As a user
  I want to view users on the site.
  So that I can control access to the CMS

  Background:
    Given a "member" "Tayler Alexander" belonging to "Staff group" with "Email"="Alexander.Tayler@gmail.com"
    And a "member" "Bethany Bloom" belonging to "Staff group" with "Email"="Bloom.Bethany@gmail.com"
    And a "member" "Johnnie Buxton" belonging to "Staff group" with "Email"="Buxton.Johnnie@gmail.com"
    And a "member" "Malak Doherty" belonging to "Staff group" with "Email"="Doherty.Malak@gmail.com"
    And a "member" "Alice Dudley" belonging to "Staff group" with "Email"="Dudley.Alice@gmail.com"
    And a "member" "Samir Evans" belonging to "Staff group" with "Email"="Evans.Samir@gmail.com"
    And a "member" "T-Jay Fuller" belonging to "Staff group" with "Email"="Fuller.T-Jay@gmail.com"
    And a "member" "Glenda Goddard" belonging to "Staff group" with "Email"="Goddard.Glenda@gmail.com"
    And a "member" "Emma Gomez" belonging to "Staff group" with "Email"="Gomez.Emma@gmail.com"
    And a "member" "Riaz Hanson" belonging to "Staff group" with "Email"="Hanson.Riaz@gmail.com"
    And a "member" "Krish Herman" belonging to "Staff group" with "Email"="Herman.Krish@gmail.com"
    And a "member" "Amiee Hoover" belonging to "Staff group" with "Email"="Hoover.Amiee@gmail.com"
    And a "member" "Hamzah Horne" belonging to "Staff group" with "Email"="Horne.Hamzah@gmail.com"
    And a "member" "Alvin Jaramillo" belonging to "Staff group" with "Email"="Jaramillo.Alvin@gmail.com"
    And a "member" "Grover Kaiser" belonging to "Staff group" with "Email"="Kaiser.Grover@gmail.com"
    And a "member" "Esha Kerr" belonging to "Staff group" with "Email"="Kerr.Esha@gmail.com"
    And a "member" "Ellice Lennon" belonging to "Staff group" with "Email"="Lennon.Ellice@gmail.com"
    And a "member" "ADMIN" belonging to "ADMIN group" with "Email"="ADMIN@example.org"
    And the "group" "ADMIN group" has permissions "Full administrative rights"
    And I am logged in with "ADMIN" permissions
    And I go to "/admin/security"

  Scenario: I can paginate through users
    When I click the "Users" CMS tab
    Then I should see "Alexander.Tayler@gmail.com" in the "#Root_Users" element
    And I should not see "Kerr.Esha@gmail.com"
    And I should not see "Lennon.Ellice@gmail.com"
    And I should not see "ADMIN@example.org"
    When I click "Kaiser.Grover@gmail.com" in the "#Root_Users" element
    And I follow "Go to next record"
    Then the "Email" field should contain "Kerr.Esha@gmail.com"
    And I follow "Go to next record"
    Then the "Email" field should contain "Lennon.Ellice@gmail.com"
    And I follow "Go to next record"
    Then the "Email" field should contain "ADMIN@example.org"
