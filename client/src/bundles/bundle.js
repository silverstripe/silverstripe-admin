/* eslint-disable
 import/no-webpack-loader-syntax,
 import/no-extraneous-dependencies,
 import/no-unresolved
 */
// Legacy translation handler
require('i18n.js');

// Expose fields (see webpack config for matching "externals" config)
require('expose-loader?SilverStripeComponent!lib/SilverStripeComponent');
require('expose-loader?Backend!lib/Backend');
require('expose-loader?schemaFieldValues!lib/schemaFieldValues');
require('expose-loader?FormAlert!components/FormAlert/FormAlert');
require('expose-loader?Injector!lib/Injector');
require('expose-loader?reduxFieldReducer!lib/reduxFieldReducer');
require('expose-loader?getFormState!lib/getFormState');
require('expose-loader?PopoverField!components/PopoverField/PopoverField');
require('expose-loader?FieldHolder!components/FieldHolder/FieldHolder');
require('expose-loader?Form!components/Form/Form');
require('expose-loader?FormConstants!components/Form/FormConstants');
require('expose-loader?FormAction!components/FormAction/FormAction');
require('expose-loader?SchemaActions!state/schema/SchemaActions');
require('expose-loader?ToastsActions!state/toasts/ToastsActions');
require('expose-loader?FileStatusIcon!components/FileStatusIcon/FileStatusIcon');
require('expose-loader?FormBuilder!components/FormBuilder/FormBuilder');
require('expose-loader?FormBuilderLoader!containers/FormBuilderLoader/FormBuilderLoader');
require('expose-loader?FormBuilderModal!components/FormBuilderModal/FormBuilderModal');
require('expose-loader?FileSchemaModalHandler!containers/InsertLinkModal/fileSchemaModalHandler');
require('expose-loader?InsertLinkModal!containers/InsertLinkModal/InsertLinkModal');
require('expose-loader?RecordsActions!state/records/RecordsActions');
require('expose-loader?GridField!components/GridField/GridField');
require('expose-loader?GridFieldCell!components/GridField/GridFieldCell');
require('expose-loader?GridFieldHeader!components/GridField/GridFieldHeader');
require('expose-loader?GridFieldHeaderCell!components/GridField/GridFieldHeaderCell');
require('expose-loader?GridFieldRow!components/GridField/GridFieldRow');
require('expose-loader?GridFieldTable!components/GridField/GridFieldTable');
require('expose-loader?Accordion!components/Accordion/Accordion');
require('expose-loader?AccordionBlock!components/Accordion/AccordionBlock');
require('expose-loader?Button!components/Button/Button');
require('expose-loader?BackButton!components/Button/BackButton');
require('expose-loader?HiddenField!components/HiddenField/HiddenField');
require('expose-loader?ListGroup!components/ListGroup/ListGroup');
require('expose-loader?ListGroupItem!components/ListGroup/ListGroupItem');
require('expose-loader?Loading!components/Loading/Loading');
require('expose-loader?TextField!components/TextField/TextField');
require('expose-loader?LiteralField!components/LiteralField/LiteralField');
require('expose-loader?Toolbar!components/Toolbar/Toolbar');
require('expose-loader?Breadcrumb!components/Breadcrumb/Breadcrumb');
require('expose-loader?ResizeAware!components/ResizeAware/ResizeAware');
require('expose-loader?TabsActions!state/tabs/TabsActions');
require('expose-loader?Tag!components/Tag/Tag');
require('expose-loader?TagList!components/Tag/TagList');
require('expose-loader?CompactTagList!components/Tag/CompactTagList');
require('expose-loader?Tip!components/Tip/Tip');
require('expose-loader?Search!components/Search/Search');
require('expose-loader?SearchToggle!components/Search/SearchToggle');
require('expose-loader?TreeDropdownFieldNode!components/TreeDropdownField/TreeDropdownFieldNode');
require('expose-loader?TreeDropdownFieldMenu!components/TreeDropdownField/TreeDropdownFieldMenu');
require('expose-loader?TreeDropdownField!components/TreeDropdownField/TreeDropdownField');
require('expose-loader?BreadcrumbsActions!state/breadcrumbs/BreadcrumbsActions');
require('expose-loader?RecordsActionTypes!state/records/RecordsActionTypes');
require('expose-loader?UnsavedFormsActions!state/unsavedForms/UnsavedFormsActions');
require('expose-loader?Badge!components/Badge/Badge');
require('expose-loader?Button!components/Button/Button');
require('expose-loader?BackButton!components/Button/BackButton');
require('expose-loader?VersionedBadge!components/VersionedBadge/VersionedBadge');
require('expose-loader?CheckboxSetField!components/CheckboxSetField/CheckboxSetField');
require('expose-loader?Preview!components/Preview/Preview');
require('expose-loader?ViewModeStates!state/viewMode/ViewModeStates');
require('expose-loader?ViewModeActions!state/viewMode/ViewModeActions');
require('expose-loader?ViewModeToggle!components/ViewModeToggle/ViewModeToggle');
require('expose-loader?Focusedzone!components/Focusedzone/Focusedzone');
require('expose-loader?Config!lib/Config');
require('expose-loader?DataFormat!lib/DataFormat');
require('expose-loader?ReactRouteRegister!lib/ReactRouteRegister');
require('expose-loader?Router!lib/Router');
require('expose-loader?TinyMCEActionRegistrar!lib/TinyMCEActionRegistrar');
require('expose-loader?ShortcodeSerialiser!lib/ShortcodeSerialiser');
require('expose-loader?formatWrittenNumber!lib/formatWrittenNumber');
require('expose-loader?withDragDropContext!lib/withDragDropContext');

// Legacy CMS
require('../legacy/sspath');
require('../legacy/ssui.core');
require('../legacy/LeftAndMain');
require('../legacy/LeftAndMain.ActionTabSet');
require('../legacy/LeftAndMain.Panel');
require('../legacy/LeftAndMain.Tree');
require('../legacy/LeftAndMain.Content');
require('../legacy/LeftAndMain.EditForm');
require('../legacy/LeftAndMain.Menu');
require('../legacy/LeftAndMain.MobileMenuToggle');
require('../legacy/LeftAndMain.Preview');
require('../legacy/LeftAndMain.BatchActions');
require('../legacy/LeftAndMain.FieldHelp');
require('../legacy/LeftAndMain.FieldDescriptionToggle');
require('../legacy/LeftAndMain.TreeDropdownField');
require('../legacy/AddToCampaignForm');
require('../legacy/SecurityAdmin');
require('../legacy/ModelAdmin');
require('../legacy/ToastsContainer');

// Legacy form fields
// Fields used by core legacy UIs, or available to users
// To do: determine better way of using webpack to pull in optional javascript
require('../legacy/ConfirmedPasswordField');
require('../legacy/SelectionGroup');
require('../legacy/DateField');
require('../legacy/ToggleCompositeField');
require('../legacy/TreeDropdownField/TreeDropdownFieldEntwine');
require('../legacy/UsedOnTable/UsedOnTableEntwine');
require('../legacy/DateField');
require('../legacy/DatetimeField');
require('../legacy/HtmlEditorField');
require('../legacy/TabSet');
require('../legacy/GridField');

require('boot');
