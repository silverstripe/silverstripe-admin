<?php

namespace SilverStripe\Admin\Tests\Behat\Context;

use Behat\Behat\Context\Context;
use SilverStripe\BehatExtension\Context\MainContextAwareTrait;

class AdminContext implements Context
{
    use MainContextAwareTrait;

    /**
     * Example: I should see an invalid tab icon on the "Third" tab
     * Example: I should not see an invalid tab icon on the "Second" tab
     *
     * @Then /^I should (not |)see an invalid tab icon on the "(.+?)" tab/
     * @param string $not
     * @param string $tabLabel
     */
    public function iShouldSeeAnInvalidTabIcon(string $not, string $tabLabel)
    {
        $id = str_replace('Main Content', 'Main', $tabLabel);
        $id = str_replace(' ', '_', $id);
        $id = "tab-Root_$id";
        $selector = "[aria-labelledby=$id] .font-icon-attention-1";
        $hiddenSelector = ".ss-tabset-tabshidden $selector";
        $page = $this->getMainContext()->getSession()->getPage();
        if ($not) {
            $element = $page->find('css', $selector);
            $hiddenElement = $page->find('css', $hiddenSelector);
            $message = "Tab validation icon for $id is visible when it should not be";
            assertTrue(is_null($element) || $hiddenElement, $message);
        } else {
            $element = $page->find('css', $selector);
            assertNotNull($element, "Tab validation icon for $id was not found");
        }
    }

    /**
     * @When /^I can (not |)see the form validation error message$/
     * @param $not
     */
    public function iCanSeeTheFormValidationErrorMessage($not)
    {
        $selector = '#Form_EditForm_error';
        $text = 'There are validation errors on this page';
        $page = $this->getMainContext()->getSession()->getPage();
        $element = $page->find('css', $selector);
        if ($not) {
            if (is_null($element)) {
                assertTrue(true);
            } else {
                $message = 'Form validation error message is present when it should not be';
                assertFalse(strpos($element->getText(), $text), $message);
            }
        } else {
            $message = sprintf('Element %s not found', $selector);
            assertNotNull($element, $message);
            assertTrue(strpos($element->getText(), $text) !== false, $message);
        }
    }
}
