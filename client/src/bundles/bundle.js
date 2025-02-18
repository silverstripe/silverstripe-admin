/* eslint-disable
 import/no-webpack-loader-syntax,
 import/no-extraneous-dependencies,
 import/no-unresolved
 */

// Legacy translation handler
import 'i18n.js';

// Expose fields (see webpack config for matching "externals" config)
import 'expose-loader?exposes=SilverStripeComponent!lib/SilverStripeComponent';
import 'expose-loader?exposes=Backend!lib/Backend';
import 'expose-loader?exposes=schemaFieldValues!lib/schemaFieldValues';
import 'expose-loader?exposes=FormAlert!components/FormAlert/FormAlert';
import 'expose-loader?exposes=Injector!lib/Injector';
import 'expose-loader?exposes=reduxFieldReducer!lib/reduxFieldReducer';
import 'expose-loader?exposes=getFormState!lib/getFormState';
import 'expose-loader?exposes=getJsonErrorMessage!lib/getJsonErrorMessage';
import 'expose-loader?exposes=PopoverField!components/PopoverField/PopoverField';
import 'expose-loader?exposes=FieldHolder!components/FieldHolder/FieldHolder';
import 'expose-loader?exposes=Form!components/Form/Form';
import 'expose-loader?exposes=FormConstants!components/Form/FormConstants';
import 'expose-loader?exposes=FormAction!components/FormAction/FormAction';
import 'expose-loader?exposes=SchemaActions!state/schema/SchemaActions';
import 'expose-loader?exposes=ToastsActions!state/toasts/ToastsActions';
import 'expose-loader?exposes=FileStatusIcon!components/FileStatusIcon/FileStatusIcon';
import 'expose-loader?exposes=FormBuilder!components/FormBuilder/FormBuilder';
import 'expose-loader?exposes=FormBuilderLoader!containers/FormBuilderLoader/FormBuilderLoader';
import 'expose-loader?exposes=Modal!components/Modal/Modal';
import 'expose-loader?exposes=FormBuilderModal!components/FormBuilderModal/FormBuilderModal';
import 'expose-loader?exposes=FileSchemaModalHandler!containers/InsertLinkModal/fileSchemaModalHandler';
import 'expose-loader?exposes=InsertLinkModal!containers/InsertLinkModal/InsertLinkModal';
import 'expose-loader?exposes=SudoMode!containers/SudoMode/SudoMode';
import 'expose-loader?exposes=RecordsActions!state/records/RecordsActions';
import 'expose-loader?exposes=GridField!components/GridField/GridField';
import 'expose-loader?exposes=GridFieldCell!components/GridField/GridFieldCell';
import 'expose-loader?exposes=GridFieldHeader!components/GridField/GridFieldHeader';
import 'expose-loader?exposes=GridFieldHeaderCell!components/GridField/GridFieldHeaderCell';
import 'expose-loader?exposes=GridFieldRow!components/GridField/GridFieldRow';
import 'expose-loader?exposes=GridFieldTable!components/GridField/GridFieldTable';
import 'expose-loader?exposes=Accordion!components/Accordion/Accordion';
import 'expose-loader?exposes=AccordionBlock!components/Accordion/AccordionBlock';
import 'expose-loader?exposes=Button!components/Button/Button';
import 'expose-loader?exposes=BackButton!components/Button/BackButton';
import 'expose-loader?exposes=HiddenField!components/HiddenField/HiddenField';
import 'expose-loader?exposes=ListGroup!components/ListGroup/ListGroup';
import 'expose-loader?exposes=ListGroupItem!components/ListGroup/ListGroupItem';
import 'expose-loader?exposes=Loading!components/Loading/Loading';
import 'expose-loader?exposes=CircularLoading!components/Loading/CircularLoading';
import 'expose-loader?exposes=TextField!components/TextField/TextField';
import 'expose-loader?exposes=LiteralField!components/LiteralField/LiteralField';
import 'expose-loader?exposes=Toolbar!components/Toolbar/Toolbar';
import 'expose-loader?exposes=Breadcrumb!components/Breadcrumb/Breadcrumb';
import 'expose-loader?exposes=ResizeAware!components/ResizeAware/ResizeAware';
import 'expose-loader?exposes=TabsActions!state/tabs/TabsActions';
import 'expose-loader?exposes=Tag!components/Tag/Tag';
import 'expose-loader?exposes=TagList!components/Tag/TagList';
import 'expose-loader?exposes=CompactTagList!components/Tag/CompactTagList';
import 'expose-loader?exposes=Tip!components/Tip/Tip';
import 'expose-loader?exposes=Search!components/Search/Search';
import 'expose-loader?exposes=SearchToggle!components/Search/SearchToggle';
import 'expose-loader?exposes=TreeDropdownFieldNode!components/TreeDropdownField/TreeDropdownFieldNode';
import 'expose-loader?exposes=TreeDropdownField!components/TreeDropdownField/TreeDropdownField';
import 'expose-loader?exposes=BreadcrumbsActions!state/breadcrumbs/BreadcrumbsActions';
import 'expose-loader?exposes=RecordsActionTypes!state/records/RecordsActionTypes';
import 'expose-loader?exposes=UnsavedFormsActions!state/unsavedForms/UnsavedFormsActions';
import 'expose-loader?exposes=Badge!components/Badge/Badge';
import 'expose-loader?exposes=VersionedBadge!components/VersionedBadge/VersionedBadge';
import 'expose-loader?exposes=CheckboxSetField!components/CheckboxSetField/CheckboxSetField';
import 'expose-loader?exposes=Preview!components/Preview/Preview';
import 'expose-loader?exposes=ViewModeStates!state/viewMode/ViewModeStates';
import 'expose-loader?exposes=ViewModeActions!state/viewMode/ViewModeActions';
import 'expose-loader?exposes=ViewModeToggle!components/ViewModeToggle/ViewModeToggle';
import 'expose-loader?exposes=Focusedzone!components/Focusedzone/Focusedzone';
import 'expose-loader?exposes=EmotionCssCacheProvider!containers/EmotionCssCacheProvider/EmotionCssCacheProvider';
import 'expose-loader?exposes=Config!lib/Config';
import 'expose-loader?exposes=DataFormat!lib/DataFormat';
import 'expose-loader?exposes=ReactRouteRegister!lib/ReactRouteRegister';
import 'expose-loader?exposes=Router!lib/Router';
import 'expose-loader?exposes=ShortcodeSerialiser!lib/ShortcodeSerialiser';
import 'expose-loader?exposes=formatWrittenNumber!lib/formatWrittenNumber';
import 'expose-loader?exposes=withRouter!lib/withRouter';
import 'expose-loader?exposes=ssUrlLib!lib/urls';
import 'expose-loader?exposes=SearchableDropdownField!components/SearchableDropdownField/SearchableDropdownField';
import 'expose-loader?exposes=SudoModePasswordField!components/SudoModePasswordField/SudoModePasswordField';
import 'expose-loader?exposes=Paginator!components/Paginator/Paginator';

// Legacy CMS
import '../legacy/jquery.changetracker';
import '../legacy/sspath';
import '../legacy/ssui.core';
import '../legacy/LeftAndMain';
import '../legacy/LeftAndMain.ActionTabSet';
import '../legacy/LeftAndMain.Panel';
import '../legacy/LeftAndMain.Tree';
import '../legacy/LeftAndMain.Content';
import '../legacy/LeftAndMain.EditForm';
import '../legacy/LeftAndMain.Menu';
import '../legacy/LeftAndMain.MobileMenuToggle';
import '../legacy/LeftAndMain.Preview';
import '../legacy/LeftAndMain.BatchActions';
import '../legacy/LeftAndMain.FieldHelp';
import '../legacy/LeftAndMain.FieldDescriptionToggle';
import '../legacy/LeftAndMain.TreeDropdownField';
import '../legacy/SecurityAdmin';
import '../legacy/ModelAdmin';
import '../legacy/ToastsContainer';

// Legacy form fields
// Fields used by core legacy UIs, or available to users
// To do: determine better way of using webpack to pull in optional javascript
import '../legacy/ConfirmedPasswordField';
import '../legacy/SelectionGroup';
import '../legacy/DateField';
import '../legacy/ToggleCompositeField';
import '../legacy/SudoModePasswordField/SudoModePasswordFieldEntwine';
import '../legacy/TreeDropdownField/TreeDropdownFieldEntwine';
import '../legacy/UsedOnTable/UsedOnTableEntwine';
import '../legacy/DatetimeField';
import '../legacy/HtmlEditorField';
import '../legacy/TabSet';
import '../legacy/GridField';
import '../legacy/SearchableDropdownField/SearchableDropdownFieldEntwine';

import 'boot';
