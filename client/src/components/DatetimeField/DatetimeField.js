import React, { useState } from 'react';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import moment from 'moment';
import modernizr from 'modernizr';
import i18n from 'i18n';
import {
  Component as DateField,
  asHTML5 as asHTML5DateField,
  getLocalisedValue as getLocalisedValueDateField,
  handleChange as handleDateFieldChange,
  moment as momentDateField,
} from '../DateField/DateField';
import { getInputProps as getInputFieldProps, render } from '../InputField/InputField';

const localFormat = 'L LT';
const dateOnlyLocalFormat = 'L';

const hasNativeSupport = (props) => props.modernizr.inputtypes['datetime-local'];

const asHTML5 = (props) => asHTML5DateField(props, hasNativeSupport);

const triggerChange = (props, event, value) => {
  // html5 `datetime-local` input doesn't retain second digits if they're
  // `00` but that will failed the back-end validation. So add `:00` to the
  // value if they're missing.
  if (/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(value)) {
    props.onChange(event, { id: props.id, value: `${value}:00` });
  } else {
    props.onChange(event, { id: props.id, value });
  }
};

const convertToLocalised = (props, isoTime) => {
  moment.locale(props.lang);
  let localTime = '';
  if (isoTime) {
    const timeObject = momentDateField(props, hasNativeSupport, isoTime);
    if (timeObject.isValid()) {
      localTime = timeObject.format(localFormat);
    }
  }
  return localTime;
};

const convertToIso = (props, localTime) => {
  moment.locale(props.lang);
  let isoTime = '';
  if (localTime) {
    // Input value can be in local format 'L LT', date-only local format 'L', or ISO format.
    // These are tried in order with strict parsing, since lenient parsing against an array of
    // formats of different lengths can produce inconsistent results (e.g. a date-only value
    // matching against 'L LT' and being treated as invalid instead of falling back to 'L').
    let timeObject = momentDateField(props, hasNativeSupport, localTime, localFormat, true);
    if (!timeObject.isValid()) {
      // No time was entered - default it to the start of the day (00:00:00)
      timeObject = momentDateField(props, hasNativeSupport, localTime, dateOnlyLocalFormat, true);
      if (timeObject.isValid()) {
        timeObject.startOf('day');
      }
    }
    if (!timeObject.isValid()) {
      timeObject = momentDateField(props, hasNativeSupport, localTime, moment.ISO_8601, true);
    }
    if (timeObject.isValid()) {
      isoTime = timeObject.format('YYYY-MM-DDTHH:mm:ss');
    }
  }
  return isoTime;
};

const getLocalisedValue = (props) => getLocalisedValueDateField(props, convertToLocalised);

const handleChange = (props, event) => {
  handleDateFieldChange(props, event, asHTML5, convertToIso, triggerChange);
};

const getInputProps = (props, handleChangeFn = handleChange) => {
  const placeholder = i18n.inject(
    i18n._t('Admin.FormatExample', 'Example: {format}'),
    { format: momentDateField(props, hasNativeSupport).endOf('month').format(localFormat) }
  );
  // Mirror DateField value handling since this component no longer delegates to DateField.getInputProps().
  const value = asHTML5(props)
    ? props.value
    : getLocalisedValue(props);
  const type = asHTML5(props) ? 'datetime-local' : 'text';
  const inputProps = getInputFieldProps(props, handleChangeFn);
  return {
    ...inputProps,
    type,
    value,
    placeholder,
  };
};

const DatetimeField = (_props) => {
  const defaultProps = {
    attributes: {},
    className: '',
    data: {},
    extraClass: '',
    modernizr,
    type: 'text',
    value: '',
  };
  const props = {
    ...defaultProps,
    ..._props,
  };

  // The native `datetime-local` input only reports a value once both the date and time are
  // filled in - an incomplete entry (e.g. a date without a time) is reported as an empty
  // value with no way to recover what was typed. Rather than letting that empty value
  // silently clear the field (and get dropped from e.g. a search), we detect the incomplete
  // state via the input's validity and warn the user instead.
  const [incomplete, setIncomplete] = useState(false);
  const handleChangeWithIncompleteCheck = (nextProps, event) => {
    if (asHTML5(nextProps)) {
      const target = event.target;
      const isIncomplete = Boolean(!target.value && target.validity && target.validity.badInput);
      if (isIncomplete !== incomplete) {
        setIncomplete(isIncomplete);
      }
      if (isIncomplete) {
        return;
      }
    } else if (incomplete) {
      setIncomplete(false);
    }
    handleChange(nextProps, event);
  };

  const inputProps = getInputProps(props, handleChangeWithIncompleteCheck);
  const field = render(props, inputProps);
  if (!incomplete) {
    return field;
  }
  const message = i18n._t(
    'Admin.DATETIME_INCOMPLETE',
    'Please enter both a date and a time'
  );
  return (
    <>
      {field}
      <div className="form__field-message form__field-message--error">{message}</div>
    </>
  );
};

DatetimeField.propTypes = DateField.propTypes;

export { DatetimeField as Component };

export default fieldHolder(DatetimeField);
