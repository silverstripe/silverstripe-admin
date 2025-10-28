@retry @job2
Feature: Accessibility
  As a keyboard user
  I want to be able to easily navigate the CMS with my keyboard

  Scenario: Skip link functions
    Given I am logged in with "ADMIN" permissions
    And I go to "/admin/pages"
    Then I should not see "Skip main navigation"

    # Skip link should be first thing tabbed to
    When I press the "Tab" key globally
    Then I should see "Skip main navigation"
    And the ".cms-container-skip-link" element should have focus

    # If we tab past the skip link, we should be on the first "normal link"
    When I press the "Tab" key globally
    Then I should not see "Skip main navigation"
    And the ".cms-sitename__title" element should have focus

    # Can shift-tab back to the skip link
    When I press the "Shift-Tab" key globally
    Then I should see "Skip main navigation"
    And the ".cms-container-skip-link" element should have focus

    # Using the skip link goes to the skip link target
    When I press the "Enter" key globally
    Then I should not see "Skip main navigation"
    And the ".cms-container-skip-link-target" element should have focus
    # Pressing tab twice and not testing that we are focused on .font-icon-search because
    # for whatever reason CI has different coords to the document.activeElement vs the one it's
    # selecting with the queryselector
    When I press the "Tab" key globally
    When I press the "Tab" key globally
    And the ".cms-content-addpage-button" element should have focus

  Scenario: Skip link works on non-page section
    Given I am logged in with "ADMIN" permissions
    And I go to "/admin/security"
    Then I should not see "Skip main navigation"
    When I press the "Tab" key globally
    Then I should see "Skip main navigation"
    And the ".cms-container-skip-link" element should have focus
    When I press the "Enter" key globally
    Then I should not see "Skip main navigation"
    And the ".cms-container-skip-link-target" element should have focus
    When I press the "Tab" key globally
    And the ".tab-users" element should have focus

  Scenario: Skip link works after ajax navigation to member profile
    Given I am logged in with "ADMIN" permissions
    And I go to "/admin/pages"
    When I press the "Tab" key globally
    And I press the "Tab" key globally
    And I press the "Tab" key globally
    And the ".cms-login-status__profile-link" element should have focus
    When I press the "Enter" key globally
    Then I should not see "Skip main navigation"
    When I press the "Shift-Tab" key globally
    When I press the "Shift-Tab" key globally
    Then I should see "Skip main navigation"
    And the ".cms-container-skip-link" element should have focus
    When I press the "Enter" key globally
    Then I should not see "Skip main navigation"
    And the ".cms-container-skip-link-target" element should have focus
    When I press the "Tab" key globally
    And the ".ui-tabs-tab[aria-controls='Root_Main']" element should have focus

  Scenario: Site tree keyboard navigation
    Given a "Page" "Page 1"
    And a "Page" "Page 2"
    And the "Page" "Page 2a" is a child of a "Page" "Page 2"
    And the "Page" "Page 2b" is a child of a "Page" "Page 2"
    And the "Page" "Page 2bi" is a child of a "Page" "Page 2b"
    And the "Page" "Page 2bii" is a child of a "Page" "Page 2b"
    And the "Page" "Page 2biii" is a child of a "Page" "Page 2b"
    And the "Page" "Page 2c" is a child of a "Page" "Page 2"
    And a "Page" "Page 3"
    And I am logged in with "ADMIN" permissions
    And I go to "/admin/pages"

    # Move focus to the element before the site tree so we have a known starting point
    When I focus on the "a[data-view='listview']" element
    And I press the "Tab" key globally
    Then the ".jstree-no-checkboxes > .nodelete > .jstree-icon" element should have focus
    When I press the "Tab" key globally
    Then the "a[title='(Record type: Page) Page 1']" element should have focus

    # Pages and toggle icon each receive tab focus
    When I press the "Tab" key globally
    Then the ".jstree-closed .jstree-icon" element should have focus
    When I press the "Tab" key globally
    Then the "a[title='(Record type: Page) Page 2']" element should have focus
    When I press the "Tab" key globally
    Then the "a[title='(Record type: Page) Page 3']" element should have focus

    # Up moves to previous sibling and skips toggle
    When I press the "Up" key globally
    Then the "a[title='(Record type: Page) Page 2']" element should have focus
    When I press the "Up" key globally
    Then the "a[title='(Record type: Page) Page 1']" element should have focus

    # Down moves to next sibling
    When I press the "Down" key globally
    Then the "a[title='(Record type: Page) Page 2']" element should have focus

    # Right arrow opens node if closed, focus stays on parent
    When I press the "Right" key globally
    Then I should see "Page 2a"
    And the "a[title='(Record type: Page) Page 2']" element should have focus

    # Left arrow closes node if open
    When I press the "Left" key globally
    Then I should not see "Page 2a"
    And the "a[title='(Record type: Page) Page 2']" element should have focus

    # Both Enter and Space on icon toggles node open/closed tab to icon
    When I press the "Shift-Tab" key globally
    Then the ".jstree-closed .jstree-icon" element should have focus
    When I press the "Enter" key globally
    Then I should see "Page 2a"
    When I press the "Enter" key globally
    Then I should not see "Page 2a"
    When I press the "Space" key globally
    Then I should see "Page 2a"

    # PageUp/PageDown moves to first/last sibling
    When I press the "Tab" key globally
    When I press the "Tab" key globally
    And the "a[title='(Record type: Page) Page 2a']" element should have focus
    When I press the "Page_Down" key globally
    Then the "a[title='(Record type: Page) Page 2c']" element should have focus
    When I press the "Page_Up" key globally
    Then the "a[title='(Record type: Page) Page 2a']" element should have focus

    # Can open nested children
    When I press the "Down" key globally
    And the "a[title='(Record type: Page) Page 2b']" element should have focus
    When I press the "Right" key globally
    Then I should see "Page 2bi"

    # Up + Down moves through all visible nodes
    When I press the "Up" key globally
    Then the "a[title='(Record type: Page) Page 2a']" element should have focus
    When I press the "Up" key globally
    Then the "a[title='(Record type: Page) Page 2']" element should have focus
    When I press the "Up" key globally
    Then the "a[title='(Record type: Page) Page 1']" element should have focus
    When I press the "Down" key globally
    Then the "a[title='(Record type: Page) Page 2']" element should have focus
    When I press the "Down" key globally
    Then the "a[title='(Record type: Page) Page 2a']" element should have focus
    When I press the "Down" key globally
    Then the "a[title='(Record type: Page) Page 2b']" element should have focus
    When I press the "Down" key globally
    Then the "a[title='(Record type: Page) Page 2bi']" element should have focus
    When I press the "Down" key globally
    Then the "a[title='(Record type: Page) Page 2bii']" element should have focus
    When I press the "Down" key globally
    Then the "a[title='(Record type: Page) Page 2biii']" element should have focus
    When I press the "Down" key globally
    Then the "a[title='(Record type: Page) Page 2c']" element should have focus
    When I press the "Down" key globally
    Then the "a[title='(Record type: Page) Page 3']" element should have focus

  Scenario: Tab navigation on page using keyboard loads focused tab
    Given a "BasicFieldsTestPage" "My page"
    And I am logged in with "ADMIN" permissions
    And I go to "/admin/pages"
    And I click on "My page" in the tree
    And I click on the "#Form_EditForm_Title" element

    # Secondary nav tabs aka panel navigation i.e. tabs within edit form
    And I press the "Shift-Tab" key globally
    Then the ".panel .nav-item:nth-of-type(1)" element should have focus
    And I should see "Page name"
    And I should not see "Required field"
    And I should not see "multiUpload"
    When I press the "Right" key globally
    Then the ".panel .nav-item:nth-of-type(2)" element should have focus
    And I should not see "Page name"
    And I should see "Required field"
    And I should not see "multiUpload"
    When I press the "Left" key globally
    Then the ".panel .nav-item:nth-of-type(1)" element should have focus
    And I should see "Page name"
    And I should not see "Required field"
    And I should not see "multiUpload"
    When I press the "End" key globally
    Then the ".panel .nav-item:nth-of-type(6)" element should have focus
    And I should not see "Page name"
    And I should not see "Required field"
    And I should see "multiUpload"
    When I press the "Home" key globally
    Then the ".panel .nav-item:nth-of-type(1)" element should have focus
    And I should see "Page name"
    And I should not see "Required field"
    And I should not see "multiUpload"
    When I press the "Tab" key globally
    Then the "#Form_EditForm_Title" element should have focus

    # Primary nav tabs i.e. Main/Settings/History tabs
    When I press the "Shift-Tab" key globally
    When I press the "Shift-Tab" key globally
    Then the ".cms-tabset-nav-primary .nav-item:nth-of-type(1)" element should have focus
    And I should see "Page name"
    And I should not see "Page location"
    And I should not see "Recard"
    When I press the "Right" key globally
    Then the ".cms-tabset-nav-primary .nav-item:nth-of-type(2)" element should have focus
    And I should not see "Page name"
    And I should see "Page location"
    And I should not see "Record"
    When I press the "Left" key globally
    Then the ".cms-tabset-nav-primary .nav-item:nth-of-type(1)" element should have focus
    And I should see "Page name"
    And I should not see "Page location"
    And I should not see "Record"
    When I press the "End" key globally
    Then the ".cms-tabset-nav-primary .nav-item:nth-of-type(3)" element should have focus
    And I should not see "Page name"
    And I should not see "Required field"
    And I should see "Record"
    When I press the "Home" key globally
    Then the ".cms-tabset-nav-primary .nav-item:nth-of-type(1)" element should have focus
    And I should see "Page name"
    And I should not see "Required field"
    And I should not see "Record"
    When I press the "Tab" key globally
    And I press the "Tab" key globally
    Then the "#Form_EditForm_Title" element should have focus

  Scenario: Tab navigation on dataobject edit form using keyboard loads focused tab
    # Note - not testing panel navigation because it's the same as the one page uses above
    Given the "Company" "Company A"
    And the "Employee" "Employee A" with "Company"="1"
    And I am logged in with "ADMIN" permissions
    When I go to "/admin/test"
    And I click on the ".col-Name" element
    And I click on the "#Form_ItemEditForm_Name" element
    And I press the "Shift-Tab" key globally
    Then the ".cms-tabset-nav-primary .ui-tabs-tab:nth-of-type(1)" element should have focus
    And I should see "Revenue"
    And I should not see "Employee A"
    And I should not see "No items found"
    When I press the "Right" key globally
    Then the ".cms-tabset-nav-primary .ui-tabs-tab:nth-of-type(2)" element should have focus
    And I should not see "Revenue"
    And I should see "Employee A"
    And I should not see "No items found"
    When I press the "Left" key globally
    Then the ".cms-tabset-nav-primary .ui-tabs-tab:nth-of-type(1)" element should have focus
    And I should see "Revenue"
    And I should not see "Employee A"
    And I should not see "No items found"
    When I press the "End" key globally
    Then the ".cms-tabset-nav-primary .ui-tabs-tab:nth-of-type(3)" element should have focus
    And I should not see "Revenue"
    And I should not see "Employee A"
    And I should see "No items found"
    When I press the "Home" key globally
    Then the ".cms-tabset-nav-primary .ui-tabs-tab:nth-of-type(1)" element should have focus
    And I should see "Revenue"
    And I should not see "Employee A"
    And I should not see "No items found"
    When I press the "Tab" key globally
    Then the "#Form_ItemEditForm_Name" element should have focus

  Scenario: Edit form tab-pane has tabindex when page has no focusable fields
    Given I add an extension "SilverStripe\Admin\Tests\Behat\Context\Extension\LiteralFieldPageExtension" to the "Page" class
    And a "page" "MyPage"
    And I am logged in with "ADMIN" permissions
    When I go to "/admin/pages"
    And I follow "About Us"
    Then I should see "Nothing to focus on"
    And I should see an ".cms-edit-form .tab-pane[tabindex='0'] p[id='lf01']" element

  Scenario: Edit form tabs has tabindex selectively applied if they have no focusable fields
    Given I add an extension "SilverStripe\Admin\Tests\Behat\Context\Extension\TabsLiteralFieldPageExtension" to the "Page" class
    And a "page" "MyPage"
    And I am logged in with "ADMIN" permissions
    When I go to "/admin/pages"
    And I follow "MyPage"
    Then I should see "Nothing to focus on"
    And I should see an ".cms-edit-form .tab-pane[tabindex='0'] p[id='lf01']" element
    When I follow "Tab02"
    Then I should see "Something to focus on"
    And I should not see an ".cms-edit-form .tab-pane[tabindex='0'] p[id='lf02']" element
