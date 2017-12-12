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
require('expose-loader?HiddenField!components/HiddenField/HiddenField');
require('expose-loader?ListGroup!components/ListGroup/ListGroup');
require('expose-loader?ListGroupItem!components/ListGroup/ListGroupItem');
require('expose-loader?TextField!components/TextField/TextField');
require('expose-loader?LiteralField!components/LiteralField/LiteralField');
require('expose-loader?Toolbar!components/Toolbar/Toolbar');
require('expose-loader?Breadcrumb!components/Breadcrumb/Breadcrumb');
require('expose-loader?TreeDropdownFieldNode!components/TreeDropdownField/TreeDropdownFieldNode');
require('expose-loader?TreeDropdownFieldMenu!components/TreeDropdownField/TreeDropdownFieldMenu');
require('expose-loader?TreeDropdownField!components/TreeDropdownField/TreeDropdownField');
require('expose-loader?BreadcrumbsActions!state/breadcrumbs/BreadcrumbsActions');
require('expose-loader?RecordsActionTypes!state/records/RecordsActionTypes');
require('expose-loader?UnsavedFormsActions!state/unsavedForms/UnsavedFormsActions');
require('expose-loader?Badge!components/Badge/Badge');
require('expose-loader?Preview!components/Preview/Preview');
require('expose-loader?Focusedzone!components/Focusedzone/Focusedzone');
require('expose-loader?Config!lib/Config');
require('expose-loader?DataFormat!lib/DataFormat');
require('expose-loader?ReactRouteRegister!lib/ReactRouteRegister');
require('expose-loader?Router!lib/Router');
require('expose-loader?TinyMCEActionRegistrar!lib/TinyMCEActionRegistrar');
require('expose-loader?ShortcodeSerialiser!lib/ShortcodeSerialiser');
require('expose-loader?formatWrittenNumber!lib/formatWrittenNumber');


// Legacy CMS
require('../legacy/sspath.js');
require('../legacy/ssui.core.js');
require('../legacy/LeftAndMain.js');
require('../legacy/LeftAndMain.ActionTabSet.js');
require('../legacy/LeftAndMain.Panel.js');
require('../legacy/LeftAndMain.Tree.js');
require('../legacy/LeftAndMain.Content.js');
require('../legacy/LeftAndMain.EditForm.js');
require('../legacy/LeftAndMain.Menu.js');
require('../legacy/LeftAndMain.MobileMenuToggle.js');
require('../legacy/LeftAndMain.Preview.js');
require('../legacy/LeftAndMain.BatchActions.js');
require('../legacy/LeftAndMain.FieldHelp.js');
require('../legacy/LeftAndMain.FieldDescriptionToggle.js');
require('../legacy/LeftAndMain.TreeDropdownField.js');
require('../legacy/AddToCampaignForm.js');
require('../legacy/SecurityAdmin.js');
require('../legacy/ModelAdmin.js');

// Legacy form fields
// Fields used by core legacy UIs, or available to users
// To do: determine better way of using webpack to pull in optional javascript
require('../legacy/ConfirmedPasswordField.js');
require('../legacy/SelectionGroup.js');
require('../legacy/DateField.js');
require('../legacy/ToggleCompositeField.js');
require('../legacy/TreeDropdownField/TreeDropdownFieldEntwine.js');
require('../legacy/DateField.js');
require('../legacy/DatetimeField.js');
require('../legacy/HtmlEditorField.js');
require('../legacy/TabSet.js');
require('../legacy/GridField.js');

require('boot');
