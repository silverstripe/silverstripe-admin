<?php

namespace SilverStripe\Admin\Tests\LeftAndMainTest;

use SilverStripe\Admin\LeftAndMain;
use SilverStripe\Dev\TestOnly;

class MyTreeController extends LeftAndMain implements TestOnly
{
    private static $url_segment = 'mytree/edit';

    private static $tree_class = MyTree::class;

    private static $allowed_actions = [
        'EditForm'
    ];

    private static $url_handlers = [
        'EditForm/$ID' => 'EditForm',
    ];
}
