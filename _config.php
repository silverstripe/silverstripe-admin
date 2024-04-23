<?php

/**
 * Init admin html editor config
 */

use SilverStripe\Admin\CMSMenu;
use SilverStripe\Admin\CMSProfileController;
use SilverStripe\Core\Manifest\ModuleLoader;
use SilverStripe\Forms\HTMLEditor\TinyMCEConfig;

// Enable SilverStripe insert link dialog on the rich text editor
$module = ModuleLoader::inst()->getManifest()->getModule('silverstripe/admin');
$editorConfig = TinyMCEConfig::get('cms');
$editorConfig
    ->enablePlugins([
        'image' => null,
        'anchor' => null,
        'sslink' => $module->getResource('client/dist/js/TinyMCE_sslink.js'),
        'sslinkexternal' => $module->getResource('client/dist/js/TinyMCE_sslink-external.js'),
        'sslinkemail' => $module->getResource('client/dist/js/TinyMCE_sslink-email.js'),
    ])
    ->setOptions([
        'friendly_name' => 'Default CMS',
        'priority' => '50',
        'skin' => 'silverstripe',
        'contextmenu' => "searchreplace | sslink anchor ssmedia ssembed inserttable | cell row column deletetable",
        'use_native_selects' => false,
        'extended_valid_elements' => "iframe[src|name|width|height|align|frameborder|marginwidth|marginheight|scrolling],"
            . "object[width|height|data|type],param[name|value],map[class|name|id],area[shape|coords|href|target|alt]"
    ]);
// enable ability to insert anchors
$editorConfig->insertButtonsAfter('sslink', 'anchor');

CMSMenu::remove_menu_class(CMSProfileController::class);
