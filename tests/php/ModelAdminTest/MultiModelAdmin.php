<?php

namespace SilverStripe\Admin\Tests\ModelAdminTest;

use SilverStripe\Dev\TestOnly;
use SilverStripe\Admin\ModelAdmin;
use SilverStripe\Control\Controller;
use SilverStripe\Admin\Tests\ModelAdminTest\ModelAdminTestBulkLoader;

class MultiModelAdmin extends ModelAdmin implements TestOnly
{
    private static $url_segment = 'multi';

    private static $managed_models = [
        Contact::class,
        'Player' => [
            'dataClass' => Player::class,
            'title' => 'Ice Hockey Players'
        ],
        Player::class => [
            'title' => 'Rugby Players'
        ]
    ];

    private static $model_importers = [
        // Implicit for class
        // Contact::class,
        // Explicit for alias
        'Player' => ModelAdminTestBulkLoader::class,
        // Explicit for class
        Player::class => ModelAdminTestBulkLoader::class
    ];

    public function Link($action = null)
    {
        if (!$action) {
            $action = $this->sanitiseClassName($this->modelClass);
        }
        return Controller::join_links('ContactAdmin', $action, '/');
    }

    // The purpose of this method is to increase the visibility of ModelAdmin::getManagedModelTabs()
    // from protected to public
    public function getManagedModelTabs()
    {
        return parent::getManagedModelTabs();
    }
}
