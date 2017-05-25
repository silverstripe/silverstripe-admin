import injector from '../injector/injector';
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

/**
 * TODO remove when dependency injector for javascript is incorporated
 *
 * This is to contain all the fields used by the injector, rather than clutter up the boot/index.js
 */
class BootInjector {
  start() {
    injector.register('TextField', TextField);
    injector.register('HiddenField', HiddenField);
    injector.register('DateField', DateField);
    injector.register('TimeField', TimeField);
    injector.register('DatetimeField', DatetimeField);
    injector.register('CheckboxField', CheckboxField);
    injector.register('CheckboxSetField', CheckboxSetField);
    injector.register('OptionsetField', OptionsetField);
    injector.register('GridField', GridField);
    injector.register('FieldGroup', FieldGroup);
    injector.register('SingleSelectField', SingleSelectField);
    injector.register('PopoverField', PopoverField);
    injector.register('HeaderField', HeaderField);
    injector.register('LiteralField', LiteralField);
    injector.register('HtmlReadonlyField', HtmlReadonlyField);
    injector.register('LookupField', LookupField);
    injector.register('CompositeField', CompositeField);
    injector.register('Tabs', Tabs);
    injector.register('TabItem', TabItem);
    injector.register('FormAction', FormAction);
    injector.register('LabelField', LabelField);
    injector.register('TreeDropdownField', TreeDropdownField);
  }
}

export default new BootInjector();
