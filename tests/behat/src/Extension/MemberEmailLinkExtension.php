<?php

namespace SilverStripe\Admin\Tests\Behat\Context\Extension;

use SilverStripe\Admin\SecurityAdmin;
use SilverStripe\Core\Extension;
use SilverStripe\Dev\TestOnly;
use SilverStripe\Forms\GridField\GridField;
use SilverStripe\Forms\GridField\GridFieldDataColumns;
use SilverStripe\ORM\FieldType\DBField;
use SilverStripe\Security\Member;

/**
 * @extends Extension<SecurityAdmin>
 */
class MemberEmailLinkExtension extends Extension implements TestOnly
{
    protected function updateGridField(GridField $gridField)
    {
        if (is_a($this->getOwner()->getModelClass(), Member::class, true)) {
            $columns = $gridField->getConfig()->getComponentByType(GridFieldDataColumns::class);
            $summaryColumns = $columns->getDisplayFields($gridField);
            $summaryColumns['Email'] = [
                'title' => 'Email',
                'callback' => function (Member $member): ?DBField {
                    $render = sprintf(
                        '<a id=%s href="mailto:%s">%s</a>',
                        htmlspecialchars(str_replace(' ', '-', $member->FirstName)),
                        htmlspecialchars($member->Email),
                        htmlspecialchars($member->Email)
                    );
                    return DBField::create_field('HTMLVarchar', $render);
                }
            ];
            $columns->setDisplayFields($summaryColumns);
        }
    }
}
