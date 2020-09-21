import { Field as ReduxFormField } from 'redux-form';
import Injector from 'lib/Injector';
import ActionMenu from 'components/ActionMenu/ActionMenu';
import Badge from 'components/Badge/Badge';
import Button from 'components/Button/Button';
import BackButton from 'components/Button/BackButton';
import TextField from 'components/TextField/TextField';
import HiddenField from 'components/HiddenField/HiddenField';
import DateField from 'components/DateField/DateField';
import TimeField from 'components/TimeField/TimeField';
import DatetimeField from 'components/DatetimeField/DatetimeField';
import CheckboxField from 'components/CheckboxField/CheckboxField';
import CheckboxSetField from 'components/CheckboxSetField/CheckboxSetField';
import OptionsetField from 'components/OptionsetField/OptionsetField';
import GridField from 'components/GridField/GridField';
import GridFieldActions from 'components/GridFieldActions/GridFieldActions';
import SingleSelectField from 'components/SingleSelectField/SingleSelectField';
import PopoverField from 'components/PopoverField/PopoverField';
import HeaderField from 'components/HeaderField/HeaderField';
import LiteralField from 'components/LiteralField/LiteralField';
import HtmlReadonlyField from 'components/HtmlReadonlyField/HtmlReadonlyField';
import LookupField from 'components/LookupField/LookupField';
import CompositeField from 'components/CompositeField/CompositeField';
import LabelField from 'components/LabelField/LabelField';
import Tabs from 'components/Tabs/Tabs';
import TabItem from 'components/Tabs/TabItem';
import FormAction from 'components/FormAction/FormAction';
import FieldGroup from 'components/FieldGroup/FieldGroup';
import TreeDropdownField from 'components/TreeDropdownField/TreeDropdownField';
import FormBuilderModal from 'components/FormBuilderModal/FormBuilderModal';
import NotFoundComponent from 'components/NotFoundComponent/NotFoundComponent';
import Form from 'components/Form/Form';
import FormAlert from 'components/FormAlert/FormAlert';
import Preview from 'components/Preview/Preview';
import ReduxForm from 'containers/Form/Form';
import UsedOnTable from 'components/UsedOnTable/UsedOnTable';
import Loading from 'components/Loading/Loading';
import VersionedBadge from 'components/VersionedBadge/VersionedBadge';
import ViewModeToggle from 'components/ViewModeToggle/ViewModeToggle';
import ResizeAware from 'components/ResizeAware/ResizeAware';
import Tag from 'components/Tag/Tag';
import TagList from 'components/Tag/TagList';
import CompactTagList from 'components/Tag/CompactTagList';
import Tip from 'components/Tip/Tip';
import Search from 'components/Search/Search';
import SearchToggle from 'components/Search/SearchToggle';
import HtmlEditorField from 'components/HtmlEditorField/HtmlEditorField';
import NumberField from 'components/NumberField/NumberField';
import PopoverOptionSet from 'components/PopoverOptionSet/PopoverOptionSet';
import ToastsContainer from 'containers/ToastsContainer/ToastsContainer';

export default () => {
  Injector.component.registerMany({
    ActionMenu,
    Badge,
    Button,
    BackButton,
    TextField,
    HiddenField,
    DateField,
    TimeField,
    DatetimeField,
    CheckboxField,
    CheckboxSetField,
    OptionsetField,
    GridField,
    GridFieldActions,
    FieldGroup,
    SingleSelectField,
    PopoverField,
    HeaderField,
    LiteralField,
    HtmlReadonlyField,
    LookupField,
    CompositeField,
    Tabs,
    TabItem,
    FormAction,
    LabelField,
    TreeDropdownField,
    Preview,
    ReduxForm,
    ReduxFormField,
    Form,
    FormAlert,
    FormBuilderModal,
    NotFoundComponent,
    UsedOnTable,
    Loading,
    VersionedBadge,
    ViewModeToggle,
    ResizeAware,
    Tag,
    TagList,
    CompactTagList,
    Tip,
    Search,
    SearchToggle,
    HtmlEditorField,
    NumberField,
    PopoverOptionSet,
    ToastsContainer,
  });
};
