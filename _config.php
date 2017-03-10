<?php

/**
 * Sets constants and init admin html editor config
 *
 * - FRAMEWORK_ADMIN_DIR: Path relative to webroot, e.g. "silverstripe-admin"
 * - FRAMEWORK_ADMIN_PATH: Absolute filepath, e.g. "/var/www/my-webroot/silverstripe-admin"
 * - ADMIN_THIRDPARTY_DIR: Path relative to webroot. .g. silvestripe-admin/thirdparty
 * - ADMIN_THIRDPARTY_PATH: Absolute filepath, e.g. "/var/www/my-webroot/silverstripe-admin/thirdparty"
 */

use SilverStripe\Admin\CMSMenu;
use SilverStripe\Admin\CMSProfileController;
use SilverStripe\Forms\HTMLEditor\TinyMCEConfig;

// Set constants relative to base path
if (strcasecmp(__DIR__, BASE_PATH) === 0) {
    // Admin is root
    define('FRAMEWORK_ADMIN_DIR', '');
    define('ADMIN_THIRDPARTY_DIR', 'thirdparty');
} else {
    // Admin is subdir
    define('FRAMEWORK_ADMIN_DIR', 'silverstripe-admin');
    define('ADMIN_THIRDPARTY_DIR', 'silverstripe-admin/thirdparty');
}

// Absolute paths
define('FRAMEWORK_ADMIN_PATH', __DIR__);
define('ADMIN_THIRDPARTY_PATH', BASE_PATH . '/' . ADMIN_THIRDPARTY_DIR);

// Default CMS HTMLEditorConfig
TinyMCEConfig::get('cms')->setOptions(array(
    'friendly_name' => 'Default CMS',
    'priority' => '50',

    'body_class' => 'typography',

    'contextmenu' => "sslink ssmedia inserttable | cell row column deletetable",

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
    'extended_valid_elements' => "img[class|src|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name"
        . "|usemap|data*],iframe[src|name|width|height|align|frameborder|marginwidth|marginheight|scrolling],"
        . "object[width|height|data|type],param[name|value],map[class|name|id],area[shape|coords|href|target|alt]"
));

TinyMCEConfig::get('cms')
    ->enablePlugins(array(
        'contextmenu' => null,
        'image' => null,
        'sslink' => FRAMEWORK_ADMIN_DIR . '/client/dist/js/TinyMCE_sslink.js'
    ));

CMSMenu::remove_menu_class(CMSProfileController::class);
