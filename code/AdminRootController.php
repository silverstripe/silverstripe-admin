<?php

namespace SilverStripe\Admin;

use SilverStripe\Control\Controller;
use SilverStripe\Control\Director;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\View\TemplateGlobalProvider;

/**
 * Controller in charge of managing AdminController routing.
 *
 * Adds AdminController classes to the Director routing rules and redirects to an
 * appropriate controller if a user navigates directly to /admin
 */
class AdminRootController extends Controller implements TemplateGlobalProvider
{
    /**
     * Fallback admin URL in case this cannot be infered from Director.rules
     */
    private static string $url_base = 'admin';

    /**
     * The LeftAndMain child that will be used as the initial panel to display if none is selected (i.e. if you
     * visit /admin)
     */
    private static string $default_panel = SecurityAdmin::class;

    /**
     * Holds an array of url_pattern => controller k/v pairs, the same as Director::rules. However this is built
     * dynamically from introspecting on all the classes that derive from AdminController.
     *
     * Don't access this directly - always access via the rules() accessor, which will build this array
     * the first time it's accessed
     *
     * @internal
     */
    private static ?array $adminRules = null;

    /**
     * Convenience function to return the admin route config.
     * Looks for the {@link Director::$rules} for the current admin Controller.
     */
    public static function get_admin_route(): string
    {
        $rules = Director::config()->get('rules');
        $adminRoute = array_search(__CLASS__, $rules ?? []);
        return $adminRoute ?: static::config()->get('url_base');
    }

    /**
     * Returns the root admin URL for the site with trailing slash
     */
    public static function admin_url(string $action = ''): string
    {
        return Controller::join_links(AdminRootController::get_admin_route(), $action);
    }

    /**
     * Gets a list of url_pattern => controller k/v pairs for each LeftAndMain derived controller
     */
    public static function rules(): array
    {
        if (AdminRootController::$adminRules === null) {
            AdminRootController::$adminRules = [];

            // Map over the array calling add_rule_for_controller on each
            $classes = CMSMenu::get_cms_classes(AdminController::class, true, CMSMenu::URL_PRIORITY);
            array_map([__CLASS__, 'add_rule_for_controller'], $classes ?? []);
        }
        return AdminRootController::$adminRules;
    }

    /**
     * Add the appropriate k/v pair to AdminRootController::$rules for the given controller.
     */
    protected static function add_rule_for_controller(string $controllerClass): void
    {
        $config = Config::forClass($controllerClass);
        $urlSegment = $config->get('url_segment');
        $urlRule    = $config->get('url_rule');

        if ($urlSegment) {
            // Make director rule
            if ($urlRule[0] == '/') {
                $urlRule = substr($urlRule ?? '', 1);
            }
            $rule = $urlSegment . '//' . $urlRule;

            // ensure that the first call to add_rule_for_controller for a rule takes precedence
            if (!isset(AdminRootController::$adminRules[$rule])) {
                AdminRootController::$adminRules[$rule] = $controllerClass;
            }
        }
    }

    public function handleRequest(HTTPRequest $request): HTTPResponse
    {
        // If this is the final portion of the request (i.e. the URL is just /admin), direct to the default panel
        if ($request->allParsed()) {
            $segment = Config::forClass($this->config()->get('default_panel'))
                ->get('url_segment');

            $this->redirect(Controller::join_links(AdminRootController::admin_url(), $segment, '/'));
            return $this->getResponse();
        }

        // Otherwise
        $rules = AdminRootController::rules();
        foreach ($rules as $pattern => $controller) {
            if ($request->match($pattern, true) !== false) {
                /** @var LeftAndMain $controllerObj */
                $controllerObj = Injector::inst()->create($controller);
                return $controllerObj->handleRequest($request);
            }
        }

        // Fall back to methods defined on LeftAndMain
        $controllerObj = Injector::inst()->create(LeftAndMain::class);
        return $controllerObj->handleRequest($request);
    }

    /**
     * Returns an array of strings of the method names of methods on the call that should be exposed
     * as global variables in the templates.
     */
    public static function get_template_global_variables(): array
    {
        return [
            'adminURL' => 'admin_url'
        ];
    }
}
