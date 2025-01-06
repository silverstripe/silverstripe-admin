<?php

namespace SilverStripe\Admin;

use InvalidArgumentException;
use LogicException;
use ReflectionClass;
use SilverStripe\CMS\Controllers\CMSMain;
use SilverStripe\Admin\Navigator\SilverStripeNavigator;
use SilverStripe\Control\Controller;
use SilverStripe\Control\Director;
use SilverStripe\Control\HTTPRequest;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Control\HTTPResponse_Exception;
use SilverStripe\Control\PjaxResponseNegotiator;
use SilverStripe\Core\ClassInfo;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Convert;
use SilverStripe\Core\Injector\Injector;
use SilverStripe\Core\Manifest\ModuleResourceLoader;
use SilverStripe\Core\Manifest\VersionProvider;
use SilverStripe\Dev\TestOnly;
use SilverStripe\Forms\DropdownField;
use SilverStripe\Forms\FieldList;
use SilverStripe\Forms\Form;
use SilverStripe\Forms\FormAction;
use SilverStripe\Forms\HiddenField;
use SilverStripe\Forms\LiteralField;
use SilverStripe\Forms\PrintableTransformation;
use SilverStripe\i18n\i18n;
use SilverStripe\Model\List\ArrayList;
use SilverStripe\ORM\CMSPreviewable;
use SilverStripe\ORM\DataObject;
use SilverStripe\ORM\FieldType\DBField;
use SilverStripe\ORM\FieldType\DBHTMLText;
use SilverStripe\ORM\Hierarchy\Hierarchy;
use SilverStripe\Model\List\SS_List;
use SilverStripe\Core\Validation\ValidationException;
use SilverStripe\Core\Validation\ValidationResult;
use SilverStripe\Security\Permission;
use SilverStripe\Security\PermissionProvider;
use SilverStripe\Security\Security;
use SilverStripe\Security\SecurityToken;
use SilverStripe\SiteConfig\SiteConfig;
use SilverStripe\Model\ArrayData;
use SilverStripe\View\Requirements;
use SilverStripe\View\SSViewer;

/**
 * LeftAndMain is the parent class of all the two-pane views in the CMS.
 * If you are wanting to add more areas to the CMS, you can do it by subclassing LeftAndMain.
 *
 * This is essentially an abstract class which should be subclassed.
 * See {@link CMSMain} for a good example.
 */
class LeftAndMain extends FormSchemaController implements PermissionProvider
{
    /**
     * Enable front-end debugging (increases verbosity) in dev mode.
     * Will be ignored in live environments.
     *
     * @var bool
     */
    private static $client_debugging = true;

    /**
     * @config
     * @var string
     */
    private static $menu_title;

    /**
     * @config
     * @var string
     */
    private static $menu_icon;

    /**
     * @config
     * @var int
     */
    private static $menu_priority = 0;

    /**
     * When set to true, this controller isn't given a menu item in the left panel in the CMS.
     */
    private static bool $ignore_menuitem = false;

    /**
     * A subclass of {@link DataObject}.
     *
     * Determines what is managed in this interface, through
     * {@link getEditForm()} and other logic.
     */
    private static ?string $model_class = null;

    /**
     * @var array
     */
    private static $allowed_actions = [
        'index',
        'save',
        'printable',
        'show',
        'EditForm',
        'AddForm',
        'batchactions',
        'BatchActionsForm',
    ];

    private static $dependencies = [
        'VersionProvider' => '%$' . VersionProvider::class,
    ];

    /**
     * Current record ID for this request
     */
    protected $recordID = null;

    /**
     * Set by {@link LeftAndMainErrorExtension} if an http error occurs
     */
    private string $httpErrorMessage;

    /**
     * Used to allow errors to be displayed using a front-end template
     */
    private bool $suppressAdminErrorContext = false;

    /**
     * Themes to use within the CMS
     *
     * Default themes are assigned in _config/themes.yml
     *
     * @config
     * @var array
     */
    private static $admin_themes = [];

    /**
     * Namespace for session info, e.g. current record.
     * Defaults to the current class name, but can be amended to share a namespace in case
     * controllers are logically bundled together, and mainly separated
     * to achieve more flexible templating.
     *
     * @config
     * @var string
     */
    private static $session_namespace;

    /**
     * Register additional requirements through the {@link Requirements} class.
     * Used mainly to work around the missing "lazy loading" functionality
     * for getting css/javascript required after an ajax-call (e.g. loading the editform).
     *
     * YAML configuration example:
     * <code>
     * LeftAndMain:
     *   extra_requirements_javascript:
     *     - mysite/javascript/myscript.js
     *     mysite/javascript/anotherscript.js:
     *       defer: true
     * </code>
     *
     * @config
     * @var array
     */
    private static $extra_requirements_javascript = [];

    /**
     * Register additional i18n requirements through the {@link Requirements} class.
     *
     * YAML configuration example:
     * <code>
     * LeftAndMain:
     *   extra_requirements_i18n:
     *     - mysite/client/lang
     *     'myorg/mymodule:client/lang': true
     * </code>
     * @var array See {@link extra_requirements_javascript}
     */
    private static array $extra_requirements_i18n = [];

    /**
     * YAML configuration example:
     * <code>
     * LeftAndMain:
     *   extra_requirements_css:
     *     mysite/css/mystyle.css:
     *       media: screen
     * </code>
     *
     * @config
     * @var array See {@link extra_requirements_javascript}
     */
    private static $extra_requirements_css = [];

    /**
     * @config
     * @var array See {@link extra_requirements_javascript}
     */
    private static $extra_requirements_themedCss = [];

    /**
     * If true, call a keepalive ping every 5 minutes from the CMS interface,
     * to ensure that the session never dies.
     *
     * @config
     * @var bool
     */
    private static $session_keepalive_ping = true;

    /**
     * Value of X-Frame-Options header
     *
     * @config
     * @var string
     */
    private static $frame_options = 'SAMEORIGIN';

    /**
     * The urls used for the links in the Help dropdown in the backend
     *
     * Set this to `false` via yml config if you do not want to show any help links
     *
     * @config
     * @var array
     */
    private static $help_links = [
        'CMS User help' => 'https://userhelp.silverstripe.org/en/6/',
        'Developer docs' => 'https://docs.silverstripe.org/en/6/',
        'Community' => 'https://www.silverstripe.org/',
        'Feedback' => 'https://www.silverstripe.org/give-feedback/',
    ];

    /**
     * The href for the anchor on the Silverstripe logo
     *
     * @config
     * @var string
     */
    private static $application_link = '//www.silverstripe.org/';

    /**
     * The application name
     *
     * @config
     * @var string
     */
    private static $application_name = 'Silverstripe';

    /**
     * @var PjaxResponseNegotiator
     */
    protected $responseNegotiator;

    /**
     * @var VersionProvider
     */
    protected $versionProvider;

    /**
     * Cached search filter instance for current search
     *
     * @var LeftAndMain_SearchFilter
     */
    protected $searchFilterCache = null;

    /**
     * Gets the combined configuration of all LeftAndMain subclasses required by the client app.
     *
     * @return string
     *
     * WARNING: Experimental API
     */
    public function getCombinedClientConfig()
    {
        $combinedClientConfig = ['sections' => []];
        $cmsClassNames = CMSMenu::get_cms_classes(AdminController::class, true, CMSMenu::URL_PRIORITY);

        // append LeftAndMain to the list as well
        $cmsClassNames[] = LeftAndMain::class;
        foreach ($cmsClassNames as $className) {
            $combinedClientConfig['sections'][] = Injector::inst()->get($className)->getClientConfig();
        }

        // Pass in base url (absolute and relative)
        $combinedClientConfig['baseUrl'] = Director::baseURL();
        $combinedClientConfig['absoluteBaseUrl'] = Director::absoluteBaseURL();
        $combinedClientConfig['adminUrl'] = AdminRootController::admin_url();

        // Get "global" CSRF token for use in JavaScript
        $token = SecurityToken::inst();
        $combinedClientConfig[$token->getName()] = $token->getValue();

        // Set env
        $combinedClientConfig['environment'] = Director::get_environment_type();
        $combinedClientConfig['debugging'] = LeftAndMain::config()->uninherited('client_debugging');

        return json_encode($combinedClientConfig);
    }

    public function getClientConfig(): array
    {
        // Add WYSIWYG link form schema before extensions are applied
        $this->beforeExtending('updateClientConfig', function (array &$clientConfig): void {
            $modalController = ModalController::singleton();
            foreach (array_keys(ModalController::config()->get('link_modal_form_factories')) as $name) {
                $clientConfig['form'][$name]['schemaUrl'] = $modalController->Link('linkModalFormSchema/' . $name . '/:pageid');
            }
        });
        return parent::getClientConfig();
    }

    /**
     * Try to redirect to an appropriate admin section if we can't access this one
     */
    public function onInitPermissionFailure(): void
    {
        $menu = $this->MainMenu();
        foreach ($menu as $candidate) {
            if ($candidate->Link &&
                $candidate->Link != $this->Link()
                && $candidate->MenuItem->controller
                && singleton($candidate->MenuItem->controller)->canView()
            ) {
                $this->redirect($candidate->Link);
                return;
            }
        }
        $this->suppressAdminErrorContext = true;
    }

    protected function init()
    {
        $this->beforeExtending('onInit', function () {
            // Audit logging hook
            if (empty($_REQUEST['executeForm']) && !$this->getRequest()->isAjax()) {
                $this->extend('accessedCMS');
            }

            Requirements::customScript("
                window.ss = window.ss || {};
                window.ss.config = " . $this->getCombinedClientConfig() . ";
            ");

            Requirements::javascript('silverstripe/admin: client/dist/js/vendor.js');
            Requirements::javascript('silverstripe/admin: client/dist/js/bundle.js');

            // Bootstrap components
            Requirements::javascript('silverstripe/admin: thirdparty/popper/popper.min.js');
            Requirements::javascript('silverstripe/admin: thirdparty/bootstrap/js/dist/util.js');
            Requirements::javascript('silverstripe/admin: thirdparty/bootstrap/js/dist/collapse.js');
            Requirements::javascript('silverstripe/admin: thirdparty/bootstrap/js/dist/tooltip.js');
            Requirements::customScript(
                "window.jQuery('body').tooltip({ selector: '[data-toggle=tooltip]' });",
                'bootstrap.tooltip-boot'
            );

            Requirements::css('silverstripe/admin: client/dist/styles/bundle.css');
            Requirements::add_i18n_javascript('silverstripe/admin:client/lang');
            Requirements::add_i18n_javascript('silverstripe/admin:client/dist/moment-locales', false);

            if (LeftAndMain::config()->uninherited('session_keepalive_ping')) {
                Requirements::javascript('silverstripe/admin: client/dist/js/LeftAndMain.Ping.js');
            }

            // Custom requirements
            $extraJs = $this->config()->get('extra_requirements_javascript');

            if ($extraJs) {
                foreach ($extraJs as $file => $config) {
                    if (is_numeric($file)) {
                        $file = $config;
                        $config = [];
                    }

                    Requirements::javascript($file, $config);
                }
            }

            $extraI18n = $this->config()->get('extra_requirements_i18n');
            if ($extraI18n) {
                foreach ($extraI18n as $dir => $return) {
                    if (is_numeric($dir)) {
                        $dir = $return;
                        $return = false;
                    }
                    Requirements::add_i18n_javascript($dir, $return);
                }
            }

            $extraCss = $this->config()->get('extra_requirements_css');

            if ($extraCss) {
                foreach ($extraCss as $file => $config) {
                    if (is_numeric($file)) {
                        $file = $config;
                        $config = [];
                    }
                    $media = null;
                    if (isset($config['media'])) {
                        $media = $config['media'];
                        unset($config['media']);
                    }

                    Requirements::css($file, $media, $config);
                }
            }

            $extraThemedCss = $this->config()->get('extra_requirements_themedCss');

            if ($extraThemedCss) {
                foreach ($extraThemedCss as $file => $config) {
                    if (is_numeric($file)) {
                        $file = $config;
                        $config = [];
                    }
                    $media = null;
                    if (isset($config['media'])) {
                        $media = $config['media'];
                        unset($config['media']);
                    }

                    Requirements::themedCSS($file, $media, $config);
                }
            }
        });

        // Run parent init and process the onInit extension hook
        parent::init();
    }

    public function afterHandleRequest()
    {
        if (!$this->suppressAdminErrorContext
            && $this->response->isError()
            && !$this->request->isAjax()
            && $this->response->getHeader('Content-Type') !== 'application/json'
        ) {
            $this->init();
            $errorCode = $this->response->getStatusCode();
            $errorType = $this->response->getStatusDescription();
            $defaultMessage = _t(
                LeftAndMain::class . '.ErrorMessage',
                'Sorry, it seems there was a {errorcode} error.',
                ['errorcode' => $errorCode]
            );
            $this->response = HTTPResponse::create($this->render([
                'Title' => $this->getApplicationName() . ' - ' . $errorType,
                'Content' => $this->renderWith($this->getTemplatesWithSuffix('_Error'), [
                    'ErrorCode' => $errorCode,
                    'ErrorType' => $errorType,
                    'Message' => DBField::create_field(
                        'HTMLFragment',
                        /** @phpstan-ignore translation.key (we need the key to be dynamic here) */
                        _t(LeftAndMain::class . '.ErrorMessage' . $errorCode, $defaultMessage)
                    ),
                ]),
            ]), $errorCode, $errorType);
        }
        parent::afterHandleRequest();
    }

    public function handleRequest(HTTPRequest $request): HTTPResponse
    {
        try {
            $response = parent::handleRequest($request);
        } catch (ValidationException $e) {
            // Nicer presentation of model-level validation errors
            $msgs = _t(__CLASS__ . '.ValidationError', 'Validation error') . ': '
                . $e->getMessage();
            $e = new HTTPResponse_Exception($msgs, 403);
            $errorResponse = $e->getResponse();
            $errorResponse->addHeader('Content-Type', 'text/plain');
            $errorResponse->addHeader('X-Status', rawurlencode($msgs));
            $e->setResponse($errorResponse);
            throw $e;
        }

        $title = $this->Title();
        if (!$response->getHeader('X-Controller')) {
            $response->addHeader('X-Controller', static::class);
        }
        if (!$response->getHeader('X-Title')) {
            $response->addHeader('X-Title', urlencode($title ?? ''));
        }

        // Prevent clickjacking, see https://developer.mozilla.org/en-US/docs/HTTP/X-Frame-Options
        $originalResponse = $this->getResponse();
        $originalResponse->addHeader('X-Frame-Options', LeftAndMain::config()->uninherited('frame_options'));
        $originalResponse->addHeader('Vary', 'X-Requested-With');

        return $response;
    }

    public function index(HTTPRequest $request): HTTPResponse
    {
        return $this->getResponseNegotiator()->respond($request);
    }

    /**
     * If this is set to true, the "switchView" context in the
     * template is shown, with links to the staging and publish site.
     *
     * @return bool
     */
    public function ShowSwitchView()
    {
        return false;
    }

    /**
     * Get menu title for this section (translated)
     *
     * @param string $class Optional class name if called on LeftAndMain directly
     * @param bool $localise Determine if menu title should be localised via i18n.
     * @return string Menu title for the given class
     */
    public static function menu_title($class = null, $localise = true)
    {
        if ($class && is_subclass_of($class, __CLASS__)) {
            // Respect oveloading of menu_title() in subclasses
            return $class::menu_title(null, $localise);
        }
        if (!$class) {
            $class = get_called_class();
        }

        // Get default class title
        $title = static::config()->get('menu_title');
        if (!$title) {
            $title = preg_replace('/Admin$/', '', $class ?? '');
        }

        // Check localisation
        if (!$localise) {
            return $title;
        }
        /** @phpstan-ignore translation.key (we need the key to be dynamic here) */
        return i18n::_t("{$class}.MENUTITLE", $title);
    }

    /**
     * Return styling for the menu icon, if a custom icon is set for this class
     *
     * Example: static $menu-icon = '/path/to/image/';
     * @param string $class
     * @return string
     */
    public static function menu_icon_for_class($class)
    {
        $icon = Config::inst()->get($class, 'menu_icon');
        if (!empty($icon)) {
            $iconURL = ModuleResourceLoader::resourceURL($icon);
            $class = strtolower(Convert::raw2htmlname(str_replace('\\', '-', $class ?? '')) ?? '');
            return ".icon.icon-16.icon-{$class} { background-image: url('{$iconURL}'); } ";
        }
        return '';
    }

    /**
     * Return the web font icon class name for this interface icon. Uses the
     * built in SilveStripe webfont. {@see menu_icon_for_class()} for providing
     * a background image.
     *
     * @param string $class .
     * @return string
     */
    public static function menu_icon_class_for_class($class)
    {
        return Config::inst()->get($class, 'menu_icon_class');
    }

    /**
     * @throws HTTPResponse_Exception
     */
    public function show(HTTPRequest $request): HTTPResponse
    {
        if ($request->param('ID')) {
            $this->setCurrentRecordID($request->param('ID'));
        }
        return $this->getResponseNegotiator()->respond($request);
    }

    public function getResponseNegotiator(): PjaxResponseNegotiator
    {
        if (!$this->responseNegotiator) {
            $this->responseNegotiator = new PjaxResponseNegotiator(
                [
                    'CurrentForm' => function () {
                        return $this->getEditForm()->forTemplate();
                    },
                    'Content' => function () {
                        return $this->renderWith($this->getTemplatesWithSuffix('_Content'));
                    },
                    'Breadcrumbs' => function () {
                        return $this->renderWith([
                            'type' => 'Includes',
                            'SilverStripe\\Admin\\CMSBreadcrumbs'
                        ]);
                    },
                    'ValidationResult' => function () {
                        return $this->prepareDataForPjax([
                            'isValid' => true,
                            'messages' => []
                        ]);
                    },
                    'default' => function () {
                        return $this->renderWith($this->getViewer('show'));
                    }
                ],
                $this->getResponse()
            );
        }
        return $this->responseNegotiator;
    }

    //------------------------------------------------------------------------------------------//
    // Main UI components

    /**
     * Returns the main menu of the CMS.  This is also used by init()
     * to work out which sections the user has access to.
     *
     * @param bool $cached
     * @return SS_List
     */
    public function MainMenu($cached = true)
    {
        if (!isset($this->_cache_MainMenu) || !$cached) {
            // Don't accidentally return a menu if you're not logged in - it's used to determine access.
            if (!Security::getCurrentUser()) {
                return new ArrayList();
            }

            // Encode into DO set
            $menu = new ArrayList();
            $menuItems = CMSMenu::get_viewable_menu_items();

            // extra styling for custom menu-icons
            $menuIconStyling = '';

            if ($menuItems) {
                foreach ($menuItems as $code => $menuItem) {
                    // alternate permission checks (in addition to LeftAndMain->canView())
                    if (isset($menuItem->controller)
                        && $this->hasMethod('alternateMenuDisplayCheck')
                        && !$this->alternateMenuDisplayCheck($menuItem->controller)
                    ) {
                        continue;
                    }

                    $linkingmode = "link";

                    if ($menuItem->controller && get_class($this) == $menuItem->controller) {
                        $linkingmode = "current";
                    } elseif (strpos($this->Link() ?? '', $menuItem->url ?? '') !== false) {
                        if ($this->Link() == $menuItem->url) {
                            $linkingmode = "current";

                            // default menu is the one with a blank {@link url_segment}
                        } elseif (singleton($menuItem->controller)->config()->get('url_segment') == '') {
                            if ($this->Link() == AdminRootController::admin_url()) {
                                $linkingmode = "current";
                            }
                        } else {
                            $linkingmode = "current";
                        }
                    }

                    // already set in CMSMenu::populate_menu(), but from a static pre-controller
                    // context, so doesn't respect the current user locale in _t() calls - as a workaround,
                    // we simply call LeftAndMain::menu_title() again
                    // if we're dealing with a controller
                    if ($menuItem->controller) {
                        $title = LeftAndMain::menu_title($menuItem->controller);
                    } else {
                        $title = $menuItem->title;
                    }

                    // Provide styling for custom $menu-icon. Done here instead of in
                    // CMSMenu::populate_menu(), because the icon is part of
                    // the CMS right pane for the specified class as well...
                    $iconClass = '';
                    $hasCSSIcon = false;
                    if ($menuItem->controller) {
                        $menuIcon = LeftAndMain::menu_icon_for_class($menuItem->controller);

                        if (!empty($menuIcon)) {
                            $menuIconStyling .= $menuIcon;
                            $hasCSSIcon = true;
                        } else {
                            $iconClass = LeftAndMain::menu_icon_class_for_class($menuItem->controller);
                        }
                    } else {
                        $iconClass = $menuItem->iconClass;
                    }

                    $menu->push(new ArrayData([
                        "MenuItem" => $menuItem,
                        "AttributesHTML" => $menuItem->getAttributesHTML(),
                        "Title" => $title,
                        "Code" => $code,
                        "Icon" => strtolower($code ?? ''),
                        "IconClass" => $iconClass,
                        "HasCSSIcon" => $hasCSSIcon,
                        "Link" => $menuItem->url,
                        "LinkingMode" => $linkingmode
                    ]));
                }
            }
            if ($menuIconStyling) {
                Requirements::customCSS($menuIconStyling);
            }

            $this->_cache_MainMenu = $menu;
        }

        return $this->_cache_MainMenu;
    }

    public function Menu()
    {
        return $this->renderWith($this->getTemplatesWithSuffix('_Menu'));
    }

    /**
     * @return ArrayData A single menu entry (see {@link MainMenu})
     */
    public function MenuCurrentItem()
    {
        $items = $this->MainMenu();
        return $items->find('LinkingMode', 'current');
    }

    /**
     * Return appropriate template candidates for this class, with the given suffix using
     * {@link SSViewer::get_templates_by_class()}
     */
    public function getTemplatesWithSuffix(string $suffix): array
    {
        return SSViewer::get_templates_by_class(get_class($this), $suffix, __CLASS__);
    }

    public function Content()
    {
        return $this->renderWith($this->getTemplatesWithSuffix('_Content'));
    }

    /**
     * Render $PreviewPanel content
     *
     * @return DBHTMLText
     */
    public function PreviewPanel()
    {
        $template = $this->getTemplatesWithSuffix('_PreviewPanel');
        // Only render sections with preview panel
        $engine = $this->getTemplateEngine();
        if ($engine->hasTemplate($template)) {
            return $this->renderWith($template);
        }
        return null;
    }

    /**
     * Get the class of the model which is managed by this controller.
     * @return class-string<DataObject>
     */
    public function getModelClass(): string
    {
        return static::config()->get('model_class') ?? '';
    }

    /**
     * Get dataobject from the current ID
     *
     * @param int|DataObject $id ID or object
     */
    public function getRecord($id): ?DataObject
    {
        $className = $this->getModelClass();
        if (!$className) {
            return null;
        }
        if ($id instanceof $className) {
            return $id;
        }
        if ($id === 'root') {
            return DataObject::singleton($className);
        }
        if (is_numeric($id)) {
            return DataObject::get_by_id($className, $id);
        }
        return null;
    }

    /**
     * @param bool $unlinked
     * @return ArrayList<ArrayData>
     */
    public function Breadcrumbs($unlinked = false)
    {
        $items = new ArrayList([
            new ArrayData([
                'Title' => $this->menu_title(),
                'Link' => ($unlinked) ? false : $this->Link()
            ])
        ]);

        return $items;
    }

    /**
     * Gets the current search filter for this request, if available
     *
     * @throws InvalidArgumentException
     * @return LeftAndMain_SearchFilter
     */
    protected function getSearchFilter()
    {
        if ($this->searchFilterCache) {
            return $this->searchFilterCache;
        }

        // Check for given FilterClass
        $params = $this->getRequest()->getVar('q');
        if (empty($params['FilterClass'])) {
            return null;
        }

        // Validate classname
        $filterClass = $params['FilterClass'];
        $filterInfo = new ReflectionClass($filterClass);
        if (!$filterInfo->implementsInterface(LeftAndMain_SearchFilter::class)) {
            throw new InvalidArgumentException(sprintf('Invalid filter class passed: %s', $filterClass));
        }

        return $this->searchFilterCache = Injector::inst()->createWithArgs($filterClass, [$params]);
    }

    /**
     * Save handler
     */
    public function save(array $data, Form $form): HTTPResponse
    {
        $request = $this->getRequest();
        $className = $this->getModelClass();

        // Existing or new record?
        $id = $data['ID'];
        if (is_numeric($id) && $id > 0) {
            $record = DataObject::get_by_id($className, $id);
            if ($record && !$record->canEdit()) {
                return Security::permissionFailure($this);
            }
            if (!$record || !$record->ID) {
                $this->httpError(404, "Bad record ID #" . (int)$id);
            }
        } else {
            if (!DataObject::singleton($className)->canCreate()) {
                return Security::permissionFailure($this);
            }
            $record = $this->getNewItem($id, false);
        }

        // save form data into record
        $form->saveInto($record, true);
        $record->write();
        $this->extend('onAfterSave', $record);
        $this->setCurrentRecordID($record->ID);

        $message = _t(__CLASS__ . '.SAVEDUP', 'Saved.');
        if ($this->getSchemaRequested()) {
            $schemaId = Controller::join_links($this->Link('schema/DetailEditForm'), $id);
            // Ensure that newly created records have all their data loaded back into the form.
            $form->loadDataFrom($record);
            $form->setMessage($message, 'good');
            $response = $this->getSchemaResponse($schemaId, $form);
        } else {
            $response = $this->getResponseNegotiator()->respond($request);
        }

        $response->addHeader('X-Status', rawurlencode($message ?? ''));
        return $response;
    }

    /**
     * Create new item.
     *
     * @param string|int $id
     * @param bool $setID
     * @return DataObject
     */
    public function getNewItem($id, $setID = true)
    {
        $class = $this->getModelClass();
        $object = Injector::inst()->create($class);
        if ($setID) {
            $object->ID = $id;
        }
        return $object;
    }

    public function delete(array $data, Form $form): HTTPResponse
    {
        $className = $this->getModelClass();

        $id = $data['ID'];
        $record = DataObject::get_by_id($className, $id);
        if ($record && !$record->canDelete()) {
            return Security::permissionFailure();
        }
        if (!$record || !$record->ID) {
            $this->httpError(404, "Bad record ID #" . (int)$id);
        }

        $record->delete();

        $this->getResponse()->addHeader(
            'X-Status',
            rawurlencode(_t(__CLASS__ . '.DELETED', 'Deleted.') ?? '')
        );
        return $this->getResponseNegotiator()->respond(
            $this->getRequest(),
            ['currentform' => [$this, 'EmptyForm']]
        );
    }


    /**
     * Retrieves an edit form, either for display, or to process submitted data.
     * Also used in the template rendered through {@link Right()} in the $EditForm placeholder.
     *
     * This is a "pseudo-abstract" method, usually connected to a {@link getEditForm()}
     * method in an entwine subclass. This method can accept a record identifier,
     * selected either in custom logic, or through {@link currentRecordID()}.
     * The form usually construct itself from {@link DataObject->getCMSFields()}
     * for the specific managed subclass defined in {@link LeftAndMain::getModelClass()}.
     *
     * @param HTTPRequest $request Passed if executing a HTTPRequest directly on the form.
     * If empty, this is invoked as $EditForm in the template
     * @return Form Should return a form regardless wether a record has been found.
     *  Form might be readonly if the current user doesn't have the permission to edit
     *  the record.
     */
    public function EditForm($request = null)
    {
        return $this->getEditForm();
    }

    /**
     * Calls {@link SiteTree->getCMSFields()} by default to determine the form fields to display.
     *
     * @param int $id
     * @param FieldList $fields
     * @return Form
     */
    public function getEditForm($id = null, $fields = null)
    {
        if (!$id) {
            $id = $this->currentRecordID();
        }

        // Check record exists
        $record = $this->getRecord($id);
        if (!$record) {
            return $this->EmptyForm();
        }

        // Check if this record is viewable
        if ($record && !$record->canView()) {
            $response = Security::permissionFailure($this);
            $this->setResponse($response);
            return null;
        }

        $fields = $fields ?: $record->getCMSFields();
        if (!$fields) {
            throw new LogicException(
                "getCMSFields() returned null  - it should return a FieldList object.
                Perhaps you forgot to put a return statement at the end of your method?"
            );
        }

        // Add hidden fields which are required for saving the record
        // and loading the UI state
        if (!$fields->dataFieldByName('ClassName')) {
            $fields->push(new HiddenField('ClassName'));
        }

        $modelClass = $this->getModelClass();
        if ($modelClass::has_extension(Hierarchy::class)
            && !$fields->dataFieldByName('ParentID')
        ) {
            $fields->push(new HiddenField('ParentID'));
        }

        // Added in-line to the form, but plucked into different view by frontend scripts.
        if ($record instanceof CMSPreviewable || $record->has_extension(CMSPreviewable::class)) {
            $navField = new LiteralField('SilverStripeNavigator', $this->getSilverStripeNavigator($record));
            $navField->setAllowHTML(true);
            $fields->push($navField);
        }

        if ($record->hasMethod('getAllCMSActions')) {
            $actions = $record->getAllCMSActions();
        } else {
            $actions = $record->getCMSActions();
            // add default actions if none are defined
            if (!$actions || !$actions->count()) {
                if ($record->hasMethod('canEdit') && $record->canEdit()) {
                    $actions->push(
                        FormAction::create('save', _t(__CLASS__ . '.SAVE', 'Save'))
                            ->addExtraClass('btn btn-primary')
                            ->addExtraClass('font-icon-add-circle')
                    );
                }
                if ($record->hasMethod('canDelete') && $record->canDelete()) {
                    $actions->push(
                        FormAction::create('delete', _t(__CLASS__ . '.DELETE', 'Delete'))
                            ->addExtraClass('btn btn-secondary')
                    );
                }
            }
        }

        $negotiator = $this->getResponseNegotiator();
        $form = Form::create(
            $this,
            "EditForm",
            $fields,
            $actions
        )->setHTMLID('Form_EditForm');
        $form->addExtraClass('cms-edit-form');
        $form->loadDataFrom($record);
        $form->setTemplate($this->getTemplatesWithSuffix('_EditForm'));
        $form->setAttribute('data-pjax-fragment', 'CurrentForm');
        $form->setValidationResponseCallback(function (ValidationResult $errors) use ($negotiator, $form) {
            $request = $this->getRequest();
            if ($request->isAjax() && $negotiator) {
                $result = $form->forTemplate();

                return $negotiator->respond($request, [
                    'CurrentForm' => function () use ($result) {
                        return $result;
                    },
                    'ValidationResult' => function () use ($errors) {
                        return $this->prepareDataForPjax([
                            'isValid' => $errors->isValid(),
                            'messages' => $errors->getMessages()
                        ]);
                    }
                ]);
            }
            return null;
        });

        // Announce the capability so the frontend can decide whether to allow preview or not.
        if ($record instanceof CMSPreviewable || $record->has_extension(CMSPreviewable::class)) {
            $form->addExtraClass('cms-previewable');
        }
        $form->addExtraClass('fill-height');
        $form->setValidator($record->getCMSCompositeValidator());

        // Check if this form is readonly
        if (!$record->canEdit()) {
            $readonlyFields = $form->Fields()->makeReadonly();
            $form->setFields($readonlyFields);
        }
        return $form;
    }

    /**
     * Returns a placeholder form, used by {@link getEditForm()} if no record is selected.
     * Our javascript logic always requires a form to be present in the CMS interface.
     *
     * @return Form
     */
    public function EmptyForm()
    {
        $form = Form::create(
            $this,
            "EditForm",
            new FieldList(),
            new FieldList()
        )->setHTMLID('Form_EditForm');
        $form->unsetValidator();
        $form->addExtraClass('cms-edit-form');
        $form->addExtraClass('root-form');
        $form->setTemplate($this->getTemplatesWithSuffix('_EditForm'));
        $form->setAttribute('data-pjax-fragment', 'CurrentForm');

        return $form;
    }

    /**
     * Renders a panel containing tools which apply to all displayed
     * "content" (mostly through {@link EditForm()}), for example a tree navigation or a filter panel.
     * Auto-detects applicable templates by naming convention: "<controller classname>_Tools",
     * and takes the most specific template (see {@link getTemplatesWithSuffix()}).
     * To explicitly disable the panel in the subclass, simply create a more specific, empty template.
     *
     * @return string HTML
     */
    public function Tools()
    {
        $templates = $this->getTemplatesWithSuffix('_Tools');
        $engine = $this->getTemplateEngine();
        if ($engine->hasTemplate($templates)) {
            $viewer = SSViewer::create($templates, $this->getTemplateEngine());
            return $viewer->process($this);
        } else {
            return false;
        }
    }

    /**
     * Renders a panel containing tools which apply to the currently displayed edit form.
     * The main difference to {@link Tools()} is that the panel is displayed within
     * the element structure of the form panel (rendered through {@link EditForm}).
     * This means the panel will be loaded alongside new forms, and refreshed upon save,
     * which can mean a performance hit, depending on how complex your panel logic gets.
     * Any form fields contained in the returned markup will also be submitted with the main form,
     * which might be desired depending on the implementation details.
     *
     * @return string HTML
     */
    public function EditFormTools()
    {
        $templates = $this->getTemplatesWithSuffix('_EditFormTools');
        $engine = $this->getTemplateEngine();
        if ($engine->hasTemplate($templates)) {
            $viewer = SSViewer::create($templates, $this->getTemplateEngine());
            return $viewer->process($this);
        } else {
            return false;
        }
    }

    /**
     * Batch Actions Handler
     */
    public function batchactions()
    {
        return new CMSBatchActionHandler($this, 'batchactions', $this->getModelClass());
    }

    /**
     * @return Form
     */
    public function BatchActionsForm()
    {
        $actions = $this->batchactions()->batchActionList();
        // Placeholder action
        $actionsMap = ['-1' => _t(__CLASS__ . '.DropdownBatchActionsDefault', 'Choose an action...')];
        foreach ($actions as $action) {
            $actionsMap[$action->Link] = $action->Title;
        }

        $form = new Form(
            $this,
            'BatchActionsForm',
            new FieldList(
                new HiddenField('csvIDs'),
                DropdownField::create(
                    'Action',
                    false,
                    $actionsMap
                )
                    ->setAttribute('autocomplete', 'off')
                    ->setAttribute(
                        'data-placeholder',
                        _t(__CLASS__ . '.DropdownBatchActionsDefault', 'Choose an action...')
                    )
            ),
            new FieldList(
                FormAction::create('submit', _t(__CLASS__ . '.SUBMIT_BUTTON_LABEL', "Go"))
                    ->addExtraClass('btn-outline-secondary')
            )
        );
        $form->addExtraClass('cms-batch-actions form--no-dividers');
        $form->unsetValidator();

        $this->extend('updateBatchActionsForm', $form);
        return $form;
    }

    public function printable()
    {
        $form = $this->getEditForm($this->currentRecordID());
        if (!$form) {
            return false;
        }

        $form->transform(new PrintableTransformation());
        $form->setActions(null);

        Requirements::clear();
        Requirements::css('silverstripe/admin: dist/css/LeftAndMain_printable.css');
        return [
            "PrintForm" => $form
        ];
    }

    /**
     * Used for preview controls, mainly links which switch between different states of the page.
     *
     * @return DBHTMLText
     */
    public function getSilverStripeNavigator(?DataObject $record = null)
    {
        if (!$record) {
            $record = $this->currentRecord();
        }
        if ($record && (($record instanceof CMSPreviewable) || $record->has_extension(CMSPreviewable::class))) {
            $navigator = new SilverStripeNavigator($record);
            return $navigator->renderWith($this->getTemplatesWithSuffix('_SilverStripeNavigator'));
        }
        return null;
    }

    /**
     * Identifier for the currently shown record,
     * in most cases a database ID. Inspects the following
     * sources (in this order):
     * - GET/POST parameter named 'ID'
     * - URL parameter named 'ID'
     */
    public function currentRecordID(): ?int
    {
        $id = null;
        if ($this->recordID) {
            $id = $this->recordID;
        } elseif ($this->getRequest()->requestVar('ID') && is_numeric($this->getRequest()->requestVar('ID'))) {
            $id = (int) $this->getRequest()->requestVar('ID');
        } elseif ($this->getRequest()->requestVar('CMSMainCurrentRecordID') && is_numeric($this->getRequest()->requestVar('CMSMainCurrentRecordID'))) {
            // see GridFieldDetailForm::ItemEditForm
            $id = (int) $this->getRequest()->requestVar('CMSMainCurrentRecordID');
        } elseif (isset($this->urlParams['ID']) && is_numeric($this->urlParams['ID'])) {
            $id = (int) $this->urlParams['ID'];
        } elseif (is_numeric($this->getRequest()->param('ID'))) {
            $id = (int) $this->getRequest()->param('ID');
        }
        $this->extend('updateCurrentRecordID', $id);
        return $id;
    }

    /**
     * Sets the ID for the current record which can be retrieved later through {@link currentRecordID()}.
     * Keep in mind that setting an ID through GET/POST or as a URL parameter will overrule this value.
     */
    public function setCurrentRecordID(?int $id): void
    {
        $this->recordID = $id;
    }

    /**
     * Uses {@link getRecord()} and {@link currentRecordID()}
     * to get the currently selected record.
     */
    public function currentRecord(): ?DataObject
    {
        return $this->getRecord($this->currentRecordID());
    }

    /**
     * Compares a given record to the currently selected one (if any).
     * Used for marking the current tree node.
     */
    public function isCurrentRecord(DataObject $record): bool
    {
        return ($record->ID == $this->currentRecordID());
    }

    /**
     * @return string
     */
    protected function sessionNamespace()
    {
        $override = $this->config()->get('session_namespace');
        return $override ? $override : static::class;
    }

    /**
     * URL to a previewable record which is shown through this controller.
     * The controller might not have any previewable content, in which case
     * this method returns FALSE.
     *
     * @return string|bool
     */
    public function LinkPreview()
    {
        return false;
    }

    /**
     * Return the version number of this application, ie. 'CMS: 4.2.1'
     *
     * @return string
     */
    public function CMSVersion()
    {
        return $this->getVersionProvider()->getVersion();
    }

    /**
     * Return the version number of the CMS in the 'major.minor' format, e.g. '4.2'
     * Will handle 4.10.x-dev by removing .x-dev
     *
     * @return string
     */
    public function CMSVersionNumber()
    {
        $moduleName = array_keys($this->getVersionProvider()->getModules())[0];
        $lockModules = $this->getVersionProvider()->getModuleVersionFromComposer([$moduleName]);
        if (!isset($lockModules[$moduleName])) {
            return '';
        }
        $version = $lockModules[$moduleName];
        if (preg_match('#^([0-9]+)\.([0-9]+)#', $version ?? '', $m)) {
            return $m[1] . '.' . $m[2];
        }
        return $version;
    }

    /**
     * @return array
     */
    public function SwitchView()
    {
        $page = $this->currentRecord();
        if (!$page) {
            return null;
        }
        $nav = SilverStripeNavigator::get_for_record($page);
        return $nav['items'];
    }

    /**
     * @return SiteConfig
     */
    public function SiteConfig()
    {
        return class_exists(SiteConfig::class) ? SiteConfig::current_site_config() : null;
    }

    /**
     * Returns help_links in a format readable by a template
     * @return ArrayList
     */
    public function getHelpLinks()
    {
        $helpLinks = $this->config()->get('help_links');
        $formattedLinks = [];

        // Setting the `help_links` config to `false` means no help links will show
        if (is_array($helpLinks)) {
            foreach ($helpLinks as $key => $value) {
                $translationKey = str_replace(' ', '', $key ?? '');

                $formattedLinks[] = [
                    /** @phpstan-ignore translation.key (we need the key to be dynamic here) */
                    'Title' => _t(__CLASS__ . '.' . $translationKey, $key),
                    'URL' => $value
                ];
            }
        }

        return ArrayList::create($formattedLinks);
    }

    /**
     * @return string
     */
    public function ApplicationLink()
    {
        return $this->config()->get('application_link');
    }

    /**
     * Get the application name.
     *
     * @return string
     */
    public function getApplicationName()
    {
        return $this->config()->get('application_name');
    }

    /**
     * @return string
     */
    public function Title()
    {
        $app = $this->getApplicationName();

        return ($section = $this->SectionTitle()) ? sprintf('%s - %s', $app, $section) : $app;
    }

    /**
     * Return the title of the current section. Either this is pulled from
     * the current panel's menu_title or from the first active menu
     *
     * @return string
     */
    public function SectionTitle()
    {
        $title = $this->menu_title();
        if ($title) {
            return $title;
        }

        foreach ($this->MainMenu() as $menuItem) {
            if ($menuItem->LinkingMode != 'link') {
                return $menuItem->Title;
            }
        }
        return null;
    }

    /**
     * Generate a logout url with BackURL to the CMS
     *
     * @return string
     */
    public function LogoutURL()
    {
        return Controller::join_links(Security::logout_url(), '?' . http_build_query([
            'BackURL' => AdminRootController::admin_url(),
        ]));
    }

    /**
     * Same as {@link ModelData->CSSClasses()}, but with a changed name
     * to avoid problems when using {@link ModelData->customise()}
     * (which always returns "ArrayData" from the $original object).
     *
     * @return string
     */
    public function BaseCSSClasses()
    {
        return $this->CSSClasses(Controller::class);
    }

    /**
     * @return string
     */
    public function Locale()
    {
        return DBField::create_field('Locale', i18n::get_locale());
    }

    public function providePermissions()
    {
        $perms = [
            "CMS_ACCESS_LeftAndMain" => [
                'name' => _t(__CLASS__ . '.ACCESSALLINTERFACES', 'Access to all CMS sections'),
                'category' => _t(__CLASS__ . '.CMS_ACCESS_CATEGORY', 'CMS Access'),
                'help' => _t(__CLASS__ . '.ACCESSALLINTERFACESHELP', 'Overrules more specific access settings.'),
                'sort' => -100
            ]
        ];

        // Add any custom ModelAdmin subclasses. Can't put this on ModelAdmin itself
        // since its marked abstract, and needs to be singleton instanciated.
        foreach (ClassInfo::subclassesFor(ModelAdmin::class) as $i => $class) {
            if ($class === ModelAdmin::class) {
                continue;
            }
            if (ClassInfo::classImplements($class, TestOnly::class)) {
                continue;
            }

            // Check if modeladmin has explicit required_permission_codes option.
            // If a modeladmin is namespaced you can apply this config to override
            // the default permission generation based on fully qualified class name.
            $code = $class::getRequiredPermissions();

            if (!$code) {
                continue;
            }
            // Get first permission if multiple specified
            if (is_array($code)) {
                $code = reset($code);
            }
            $title = LeftAndMain::menu_title($class);
            $perms[$code] = [
                // Item in permission selection identifying the admin section. Example: Access to 'Files & Images'
                'name' => _t(
                    __CLASS__ . '.ACCESS',
                    "Access to '{title}' section",
                    ['title' => $title]
                ),
                'category' => _t(__CLASS__ . '.CMS_ACCESS_CATEGORY', 'CMS Access')
            ];
        }

        return $perms;
    }

    /**
     * Set the SilverStripe version provider to use
     *
     * @param VersionProvider $provider
     * @return $this
     */
    public function setVersionProvider(VersionProvider $provider)
    {
        $this->versionProvider = $provider;
        return $this;
    }

    /**
     * Get the SilverStripe version provider
     *
     * @return VersionProvider
     */
    public function getVersionProvider()
    {
        return $this->versionProvider;
    }

    /**
     * Get the HTTP error message if one has occurred during HandleRequest.
     */
    public function getHttpErrorMessage(): string
    {
        return $this->httpErrorMessage ?? '';
    }

    /**
     * Set the HTTP error message when one occurs during HandleRequest.
     * Called by {@link LeftAndMainErrorExtension}
     * @internal
     */
    public function setHttpErrorMessage(string $message): LeftAndMain
    {
        $this->httpErrorMessage = $message;
        return $this;
    }
}
