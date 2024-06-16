<?php

namespace SilverStripe\Admin;

use SilverStripe\CMS\Controllers\CMSMain;
use SilverStripe\Core\ClassInfo;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Convert;
use SilverStripe\Core\Manifest\ClassLoader;
use SilverStripe\Control\Controller;
use SilverStripe\Dev\TestOnly;
use SilverStripe\i18n\i18nEntityProvider;
use SilverStripe\Security\Member;
use IteratorAggregate;
use ReflectionClass;
use ArrayIterator;
use SilverStripe\Security\Security;
use Traversable;

/**
 * The object manages the main CMS menu. See {@link LeftAndMain::init()} for
 * example usage.
 *
 * The menu will be automatically populated with menu items for subclasses of
 * {@link LeftAndMain}. That is, for each class in the CMS that creates an
 * administration panel, a CMS menu item will be created. The default
 * configuration will also include a 'help' link to the SilverStripe user
 * documentation.
 *
 * Additional CMSMenu items can be added through {@link LeftAndMainExtension::init()}
 * extensions added to {@link LeftAndMain}.
 */
class CMSMenu implements IteratorAggregate, i18nEntityProvider
{

    /**
     * Sort by menu priority, highest to lowest
     */
    const MENU_PRIORITY = 'menu_priority';

    /**
     * Sort by url priority, highest to lowest
     */
    const URL_PRIORITY = 'url_priority';

    /**
     * An array of changes to be made to the menu items, in the order that the changes should be
     * applied.  Each item is a map in one of the two forms:
     *  - array('type' => 'add', 'item' => CMSMenuItem::create(...) )
     *  - array('type' => 'remove', 'code' => 'codename' )
     */
    protected static $menu_item_changes = [];

    /**
     * Set to true if clear_menu() is called, to indicate that the default menu shouldn't be
     * included
     */
    protected static $menu_is_cleared = false;

    /**
     * Generate CMS main menu items by collecting valid
     * subclasses of {@link LeftAndMain}
     */
    public static function populate_menu()
    {
        CMSMenu::$menu_is_cleared = false;
    }

    /**
     * Add a LeftAndMain controller to the CMS menu.
     *
     * @param string $controllerClass The class name of the controller
     */
    public static function add_controller($controllerClass)
    {
        if ($menuItem = CMSMenu::menuitem_for_controller($controllerClass)) {
            $code = static::get_menu_code($controllerClass);
            CMSMenu::add_menu_item_obj($code, $menuItem);
        }
    }

    /**
     * Return a CMSMenuItem to add the given controller to the CMSMenu
     *
     * @param string $controllerClass
     * @return CMSMenuItem
     */
    protected static function menuitem_for_controller($controllerClass)
    {
        $urlBase = AdminRootController::admin_url();
        $urlSegment   = Config::inst()->get($controllerClass, 'url_segment');
        $menuPriority = Config::inst()->get($controllerClass, 'menu_priority');
        $ignoreFromMenu = Config::inst()->get($controllerClass, 'ignore_menuitem');

        // Don't add menu items defined the old way, or for controllers that are set to be ignored
        if (!$urlSegment || $ignoreFromMenu) {
            return null;
        }

        $link = Controller::join_links($urlBase, $urlSegment);

        // doesn't work if called outside of a controller context (e.g. in _config.php)
        // as the locale won't be detected properly. Use {@link LeftAndMain->MainMenu()} to update
        // titles for existing menu entries
        $menuTitle = LeftAndMain::menu_title($controllerClass);

        return CMSMenuItem::create($menuTitle, $link, $controllerClass, $menuPriority);
    }


    /**
     * Add an arbitrary URL to the CMS menu.
     *
     * @param string $code A unique identifier (used to create a CSS ID and its key in {@link $menu_items})
     * @param string $menuTitle The link's title in the CMS menu
     * @param string $url The url of the link
     * @param integer $priority The menu priority (sorting order) of the menu item.  Higher priorities will be further
     *                          left.
     * @param array $attributes an array of attributes to include on the link.
     * @param string $iconClass
     *
     * @return boolean The result of the operation.
     */
    public static function add_link($code, $menuTitle, $url, $priority = -1, $attributes = null, $iconClass = null)
    {
        return CMSMenu::add_menu_item($code, $menuTitle, $url, null, $priority, $attributes, $iconClass);
    }

    /**
     * Add a navigation item to the main administration menu showing in the top bar.
     *
     * uses {@link CMSMenu::$menu_items}
     *
     * @param string $code Unique identifier for this menu item (e.g. used by {@link replace_menu_item()} and
     *                    {@link remove_menu_item}. Also used as a CSS-class for icon customization.
     * @param string $menuTitle Localized title showing in the menu bar
     * @param string $url A relative URL that will be linked in the menu bar.
     * @param string $controllerClass The controller class for this menu, used to check permisssions.
     *                    If blank, it's assumed that this is public, and always shown to users who
     *                    have the rights to access some other part of the admin area.
     * @param int $priority
     * @param array $attributes an array of attributes to include on the link.
     * @param string $iconClass
     *
     * @return bool Success
     */
    public static function add_menu_item(
        $code,
        $menuTitle,
        $url,
        $controllerClass = null,
        $priority = -1,
        $attributes = null,
        $iconClass = null
    ) {
        // If a class is defined, then force the use of that as a code.  This helps prevent menu item duplication
        if ($controllerClass) {
            $code = CMSMenu::get_menu_code($controllerClass);
        }

        return CMSMenu::replace_menu_item(
            $code,
            $menuTitle,
            $url,
            $controllerClass,
            $priority,
            $attributes,
            $iconClass
        );
    }

    /**
     * Get a single menu item by its code value.
     *
     * @param string $code
     * @return array
     */
    public static function get_menu_item($code)
    {
        $menuItems = CMSMenu::get_menu_items();
        return (isset($menuItems[$code])) ? $menuItems[$code] : false;
    }

    /**
     * Get menu code for class
     *
     * @param string $cmsClass Controller class name
     * @return string
     */
    public static function get_menu_code($cmsClass)
    {
        return Convert::raw2htmlname(str_replace('\\', '-', $cmsClass ?? ''));
    }

    /**
     * Get all menu entries.
     *
     * @return array
     */
    public static function get_menu_items()
    {
        $menuItems = [];

        // Set up default menu items
        if (!CMSMenu::$menu_is_cleared) {
            $cmsClasses = CMSMenu::get_cms_classes();
            foreach ($cmsClasses as $cmsClass) {
                $menuItem = CMSMenu::menuitem_for_controller($cmsClass);
                $menuCode = CMSMenu::get_menu_code($cmsClass);
                if ($menuItem) {
                    $menuItems[$menuCode] = $menuItem;
                }
            }
        }

        // Apply changes
        foreach (CMSMenu::$menu_item_changes as $change) {
            switch ($change['type']) {
                case 'add':
                    $menuItems[$change['code']] = $change['item'];
                    break;

                case 'remove':
                    unset($menuItems[$change['code']]);
                    break;

                default:
                    user_error("Bad menu item change type {$change['type']}", E_USER_WARNING);
            }
        }

        // Sort menu items according to priority, then title asc
        $menuPriority = [];
        $menuTitle    = [];
        foreach ($menuItems as $key => $menuItem) {
            $menuPriority[$key] = is_numeric($menuItem->priority) ? $menuItem->priority : 0;
            $menuTitle[$key]    = $menuItem->title;
        }
        array_multisort($menuPriority, SORT_DESC, $menuTitle, SORT_ASC, $menuItems);

        return $menuItems;
    }

    /**
     * Get all menu items that the passed member can view.
     * Defaults to {@link Security::getCurrentUser()}.
     *
     * @param Member $member
     * @return array<CMSMenuItem>
     */
    public static function get_viewable_menu_items($member = null)
    {
        if (!$member && $member !== false) {
            $member = Security::getCurrentUser();
        }

        $viewableMenuItems = [];
        $allMenuItems = CMSMenu::get_menu_items();
        if ($allMenuItems) {
            foreach ($allMenuItems as $code => $menuItem) {
                        // exclude all items which have a controller to perform permission
                        // checks on
                if ($menuItem->controller) {
                    $controllerObj = singleton($menuItem->controller);
                    if (Controller::has_curr()) {
                        // Necessary for canView() to have request data available,
                        // e.g. to check permissions against LeftAndMain->currentPage()
                        $controllerObj->setRequest(Controller::curr()->getRequest());
                        if (!$controllerObj->canView($member)) {
                            continue;
                        }
                    }
                }

                $viewableMenuItems[$code] = $menuItem;
            }
        }

        return $viewableMenuItems;
    }

    /**
     * Removes an existing item from the menu.
     *
     * @param string $code Unique identifier for this menu item
     */
    public static function remove_menu_item($code)
    {
        CMSMenu::$menu_item_changes[] = ['type' => 'remove', 'code' => $code];
    }

    /**
     * Remove menu item by class name.
     *
     * @param string $className Name of class
     */
    public static function remove_menu_class($className)
    {
        $code = CMSMenu::get_menu_code($className);
        CMSMenu::remove_menu_item($code);
    }

    /**
     * Clears the entire menu
     */
    public static function clear_menu()
    {
        CMSMenu::$menu_item_changes = [];
        CMSMenu::$menu_is_cleared = true;
    }

    /**
     * Replace a navigation item to the main administration menu showing in the top bar.
     *
     * @param string $code Unique identifier for this menu item (e.g. used by {@link replace_menu_item()} and
     *                    {@link remove_menu_item}. Also used as a CSS-class for icon customization.
     * @param string $menuTitle Localized title showing in the menu bar
     * @param string $url A relative URL that will be linked in the menu bar.
     *                    Make sure to add a matching route via {@link Director::$rules} to this url.
     * @param string $controllerClass The controller class for this menu, used to check permisssions.
     *                    If blank, it's assumed that this is public, and always shown to users who
     *                    have the rights to access some other part of the admin area.
     * @param int $priority
     * @param array $attributes an array of attributes to include on the link.
     * @param string $iconClass
     *
     * @return bool Success
     */
    public static function replace_menu_item(
        $code,
        $menuTitle,
        $url,
        $controllerClass = null,
        $priority = -1,
        $attributes = null,
        $iconClass = null
    ) {
        $item = CMSMenuItem::create($menuTitle, $url, $controllerClass, $priority, $iconClass);

        if ($attributes) {
            $item->setAttributes($attributes);
        }

        CMSMenu::$menu_item_changes[] = [
            'type' => 'add',
            'code' => $code,
            'item' => $item,
        ];
    }

    /**
     * Add a previously built menu item object to the menu
     *
     * @param string $code
     * @param CMSMenuItem $cmsMenuItem
     */
    protected static function add_menu_item_obj($code, $cmsMenuItem)
    {
        CMSMenu::$menu_item_changes[] = [
            'type' => 'add',
            'code' => $code,
            'item' => $cmsMenuItem,
        ];
    }

    /**
     * A utility funciton to retrieve subclasses of a given class that
     * are instantiable (ie, not abstract) and have a valid menu title.
     *
     * Sorted by url_priority config.
     *
     * @param string $root The root class to begin finding subclasses
     * @param boolean $recursive Look for subclasses recursively?
     * @param string $sort Name of config on which to sort. Can be 'menu_priority' or 'url_priority'
     * @return array Valid, unique subclasses
     */
    public static function get_cms_classes($root = null, $recursive = true, $sort = CMSMenu::MENU_PRIORITY)
    {
        if (!$root) {
            $root = LeftAndMain::class;
        }
        $abstractClasses = [LeftAndMain::class, CMSMain::class];
        $subClasses = array_values(ClassInfo::subclassesFor($root) ?? []);
        foreach ($subClasses as $className) {
            if ($recursive && $className != $root) {
                $subClasses = array_merge($subClasses, array_values(ClassInfo::subclassesFor($className) ?? []));
            }
        }
        $subClasses = array_unique($subClasses ?? []);
        foreach ($subClasses as $key => $className) {
            // Remove abstract classes and LeftAndMain
            if (in_array($className, $abstractClasses ?? []) || ClassInfo::classImplements($className, TestOnly::class)) {
                unset($subClasses[$key]);
            } else {
                // Separate conditional to avoid autoloading the class
                $classReflection = new ReflectionClass($className);
                if (!$classReflection->isInstantiable()) {
                    unset($subClasses[$key]);
                }
            }
        }

        // Sort by specified sorting config
        usort($subClasses, function ($a, $b) use ($sort) {
            $priorityA = Config::inst()->get($a, $sort);
            $priorityB = Config::inst()->get($b, $sort);
            return $priorityB - $priorityA;
        });

        return $subClasses;
    }

    /**
     * IteratorAggregate Interface Method.  Iterates over the menu items.
     */
    public function getIterator(): Traversable
    {
        return new ArrayIterator(CMSMenu::get_menu_items());
    }

    /**
     * Provide menu titles to the i18n entity provider
     */
    public function provideI18nEntities()
    {
        $cmsClasses = CMSMenu::get_cms_classes();
        $entities = [];
        foreach ($cmsClasses as $cmsClass) {
            $defaultTitle = LeftAndMain::menu_title($cmsClass, false);
            $ownerModule = ClassLoader::inst()->getManifest()->getOwnerModule($cmsClass);
            $entities["{$cmsClass}.MENUTITLE"] = [
                'default' => $defaultTitle,
                'module' => $ownerModule->getShortName()
            ];
        }
        return $entities;
    }
}
