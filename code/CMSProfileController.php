<?php

namespace SilverStripe\Admin;

use SilverStripe\Control\HTTPResponse;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Security\Member;
use SilverStripe\Security\Security;

class CMSProfileController extends SingleRecordAdmin
{
    private static $url_segment = 'myprofile';

    private static $menu_title = 'My Profile';

    private static $required_permission_codes = 'CMS_ACCESS';

    private static $model_class = Member::class;

    private static $ignore_menuitem = true;

    private static bool $restrict_to_single_record = false;

    private static bool $allow_new_record = false;

    protected function init()
    {
        parent::init();
        if (!$this->getResponse()->isRedirect()) {
            $this->setCurrentPageID(Security::getCurrentUser()->ID);
        }
    }

    public function getEditForm($id = null, $fields = null): Form
    {
        $form = parent::getEditForm($id, $fields);
        $form->Fields()->push(HiddenField::create('ID', null, Security::getCurrentUser()->ID));
        return $form;
    }

    public function canView($member = null)
    {
        $currentUser = Security::getCurrentUser();
        if (!$member && $member !== false) {
            $member = $currentUser;
        }
        // cms menus are only for logged-in members
        if (!$member) {
            return false;
        }
        // Check they are trying to edit themselves and they have permissions
        return $member->ID === $currentUser->ID && parent::canView($member);
    }

    public function save(array $data, Form $form): HTTPResponse
    {
        // Make sure the ID is a positive number
        $id = $data['ID'] ?? null;
        if ((!is_int($id) && !ctype_digit($id)) || $id < 1) {
            $this->httpError(400);
        }
        // Get the current member locale so we can see if it changes
        $member = Member::get()->byID($id);
        $origLocale = $member?->Locale;
        // actual save (along with error handling e.g. if there's no member with that ID) is handled by the parent class
        $response = parent::save($data, $form);
        // If the member locale changes, reload the full CMS so localisation can kick in.
        // Otherwise only the edit form will reload.
        if (isset($data['Locale']) && $origLocale != $data['Locale']) {
            $response->addHeader('X-Reload', true);
            $response->addHeader('X-ControllerURL', $this->Link());
        }
        return $response;
    }
}
