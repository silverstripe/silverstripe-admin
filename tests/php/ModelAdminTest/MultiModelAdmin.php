<?php

namespace SilverStripe\Admin\Tests\ModelAdminTest;

use SilverStripe\Admin\ModelAdmin;
use SilverStripe\Control\Controller;
use SilverStripe\Dev\TestOnly;

class MultiModelAdmin extends ModelAdmin implements TestOnly
{
    private static $url_segment = 'multi';

    private static $managed_models = [
        Contact::class,
        'Player' => [
            'dataClass' => Player::class,
            'title' => 'Ice Hockey Players',
        ],
        Player::class => [
            'title' => 'Rugby Players',
        ],
        'cricket-players' => [
            'dataClass' => Player::class,
            'title' => 'Cricket Players',
        ],
    ];

    // The purpose of this method is to increase the visibility of ModelAdmin::getManagedModelTabs()
    // from protected to public
    public function getManagedModelTabs()
    {
        return parent::getManagedModelTabs();
    }

    /** Allow public access to protected $modelTab attribute */
    public function getModelTab()
    {
        return $this->modelTab;
    }
}
