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
        'body_class' => 'typography',
        'contextmenu' => "searchreplace | sslink anchor ssmedia ssembed inserttable | cell row column deletetable",
        'use_native_selects' => false,
        'valid_elements' => "@[id|class|style|title],a[id|rel|rev|dir|tabindex|accesskey|type|name|href|target|title"
            . "|class],-strong/-b[class],-em/-i[class],-strike[class],-u[class],#p[id|dir|class|align|style],-ol[class],"
            . "-ul[class],-li[class],br,img[id|dir|longdesc|usemap|class|src|border|alt=|title|width|height|align|data*],"
            . "-sub[class],-sup[class],-blockquote[dir|class],-cite[dir|class|id|title],"
            . "-table[cellspacing|cellpadding|width|height|class|align|summary|dir|id|style],"
            . "-tr[id|dir|class|rowspan|width|height|align|valign|bgcolor|background|bordercolor|style],"
            . "tbody[id|class|style],thead[id|class|style],tfoot[id|class|style],"
            . "#td[id|dir|class|colspan|rowspan|width|height|align|valign|scope|style],"
            . "-th[id|dir|class|colspan|rowspan|width|height|align|valign|scope|style],caption[id|dir|class],"
            . "-div[id|dir|class|align|style],-span[class|align|style],-pre[class|align],address[class|align],"
            . "-h1[id|dir|class|align|style],-h2[id|dir|class|align|style],-h3[id|dir|class|align|style],"
            . "-h4[id|dir|class|align|style],-h5[id|dir|class|align|style],-h6[id|dir|class|align|style],hr[class],"
            . "dd[id|class|title|dir],dl[id|class|title|dir],dt[id|class|title|dir]",
        'extended_valid_elements' => "img[class|src|alt|title|hspace|vspace|width|height|align|name"
            . "|usemap|data*],iframe[src|name|width|height|align|frameborder|marginwidth|marginheight|scrolling],"
            . "object[width|height|data|type],param[name|value],map[class|name|id],area[shape|coords|href|target|alt]"
    ]);
// enable ability to insert anchors
$editorConfig->insertButtonsAfter('sslink', 'anchor');

CMSMenu::remove_menu_class(CMSProfileController::class);
