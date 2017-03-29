<?php

namespace SilverStripe\Admin;

use SilverStripe\Control\Controller;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormRequestHandler;

/**
 * Allows CMS forms to be decorated with additional context arguments.
 * By injecting additional IDs into the form link, LeftAndMain subclasses
 * can avoid relying on session state to record current page ID.
 * {@see CMSMain} for example usage.
 */
class LeftAndMainFormRequestHandler extends FormRequestHandler
{
    /**
     * Extra form identifiers (e.g. ID, OtherID)
     * @var array
     */
    protected $extra = [];

    public function __construct(Form $form, $extra = [])
    {
        parent::__construct($form);
        $this->extra = $extra;
    }

    public function Link($action = null)
    {
        // Add on extra urlsegments to end of link
        $parts = $this->extra;
        if ($action) {
            $parts[] = $action;
        }
        return parent::Link(Controller::join_links($parts));
    }
}
