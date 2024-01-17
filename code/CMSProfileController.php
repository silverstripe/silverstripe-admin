<?php

namespace SilverStripe\Admin;

use SilverStripe\CMS\Controllers\CMSMain;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\FormAction;
use SilverStripe\ORM\ArrayList;
use SilverStripe\Security\Member;
use SilverStripe\Security\Permission;
use SilverStripe\Security\Security;

class CMSProfileController extends LeftAndMain
{
    private static $url_segment = 'myprofile';

    private static $menu_title = 'My Profile';

    private static $required_permission_codes = 'CMS_ACCESS';

    private static $tree_class = Member::class;

    public function getEditForm($id = null, $fields = null)
    {
        $this->setCurrentPageID(Security::getCurrentUser()->ID);

        $form = parent::getEditForm($id, $fields);

        if ($form instanceof HTTPResponse) {
            return $form;
        }

        $form->Fields()->removeByName('LastVisited');
        $form->Fields()->push(new HiddenField('ID', null, Security::getCurrentUser()->ID));
        $form->Actions()->push(
            FormAction::create('save', _t(CMSMain::class . '.SAVE', 'Save'))
                ->addExtraClass('btn-primary font-icon-save')
                ->setUseButtonTag(true)
        );

        $form->Actions()->removeByName('action_delete');

        if ($member = Security::getCurrentUser()) {
            $form->setValidator($member->getValidator());
        } else {
            $form->setValidator(Member::singleton()->getValidator());
        }

        if ($form->Fields()->hasTabSet()) {
            $form->Fields()->findOrMakeTab('Root')->setTemplate('SilverStripe\\Forms\\CMSTabSet');
        }

        $form->addExtraClass('member-profile-form root-form cms-edit-form center fill-height');

        return $form;
    }

    public function canView($member = null)
    {
        $currentUser = Security::getCurrentUser();

        if (!$member && $member !== false) {
            $member = $currentUser;
        }

        // cms menus only for logged-in members
        if (!$member) {
            return false;
        }

        // Check they are trying to edit themselves and they have permissions
        return $member->ID === $currentUser->ID && parent::canView($member);
    }

    public function save(array $data, Form $form): HTTPResponse
    {
        $member = Member::get()->byID($data['ID']);
        if (!$member) {
            $this->httpError(404);
        }
        $origLocale = $member->Locale;

        if (!$member->canEdit()) {
            $form->sessionMessage(_t(__CLASS__.'.CANTEDIT', 'You don\'t have permission to do that'), 'bad');
            return $this->redirectBack();
        }

        $response = parent::save($data, $form);

        if (isset($data['Locale']) && $origLocale != $data['Locale']) {
            $response->addHeader('X-Reload', true);
            $response->addHeader('X-ControllerURL', $this->Link());
        }

        return $response;
    }

    /**
     * Only show first element, as the profile form is limited to editing
     * the current member it doesn't make much sense to show the member name
     * in the breadcrumbs.
     *
     * @param bool $unlinked
     */
    public function Breadcrumbs($unlinked = false)
    {
        $items = parent::Breadcrumbs($unlinked);
        return new ArrayList([$items[0]]);
    }
}
