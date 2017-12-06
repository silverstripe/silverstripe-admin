import { Field as ReduxFormField } from 'redux-form';
import Injector from 'lib/Injector';
import TextField from 'components/TextField/TextField';
import HiddenField from 'components/HiddenField/HiddenField';
import DateField from 'components/DateField/DateField';
import TimeField from 'components/TimeField/TimeField';
import DatetimeField from 'components/DatetimeField/DatetimeField';
import CheckboxField from 'components/CheckboxField/CheckboxField';
import CheckboxSetField from 'components/CheckboxSetField/CheckboxSetField';
import OptionsetField from 'components/OptionsetField/OptionsetField';
import GridField from 'components/GridField/GridField';
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
import ReduxForm from 'containers/Form/Form';

export default () => {
  Injector.component.registerMany({
    TextField,
    HiddenField,
    DateField,
    TimeField,
    DatetimeField,
    CheckboxField,
    CheckboxSetField,
    OptionsetField,
    GridField,
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
    ReduxForm,
    ReduxFormField,
    Form,
    FormBuilderModal,
    NotFoundComponent,
  });
};
