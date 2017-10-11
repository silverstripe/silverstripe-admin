import React from 'react';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import { Component as TextField } from '../TextField/TextField';
import moment from 'moment';
import modernizr from 'modernizr';
import i18n from 'i18n';

const localFormat = 'L';

class DateField extends TextField {
  render() {
    return super.render();
  }

  hasNativeSupport() {
    return modernizr.inputtypes.date;
  }

  getInputProps() {
    const placeholder = i18n.inject(
      i18n._t('Admin.FormatExample', 'Example: {format}'),
      { format: moment().endOf('month').format(localFormat) }
    );
    const props = {};

    let val = this.props.value;

    if (!this.props.data.html5 || (this.hasNativeSupport() && this.props.data.html5)) {
      val = this.props.value;
    } else {
      val = this.getLocalisedValue();
    }

    Object.assign(props, super.getInputProps(), {
      type: this.props.data.html5 ? 'date' : 'text',
      // `parse()` of redux-form `Field` should be used for parsing the
      // localised input value to iso format to pass to redux store but `Field`
      // is not accessible in this context.
      defaultValue: val,
      placeholder,
    });

    // Reset value so `defaultValue` is used
    delete props.value;

    return props;
  }

  getLocalisedValue() {
    return this.convertToLocalised(this.props.value);
  }

  isMultiline() {
    return false;
  }

  /**
   * Handles changes to the text field's value.
   *
   * @param {Event} event
   */
  handleChange(event) {
    const enteredValue = event.target.value;
    let isoValue = '';

    // When browser support input=date the date value is already in iso format
    // and html5 is enabled
    if (!this.props.data.html5 || (this.hasNativeSupport() && this.props.data.html5)) {
      isoValue = enteredValue;
    } else {
      isoValue = this.convertToIso(enteredValue);
    }

    if (typeof this.props.onChange === 'function') {
      this.triggerChange(isoValue);
    }
  }

  triggerChange(value) {
    this.props.onChange(value);
  }

  convertToIso(localDate) {
    moment.locale(this.props.lang);
    let isoDate = '';

    if (localDate) {
      // Input value can be in local format 'L' or ISO format
      const dateObject = moment(localDate, [localFormat, 'YYYY-MM-DD']);
      if (dateObject.isValid()) {
        isoDate = dateObject.format('YYYY-MM-DD');
      }
    }

    return isoDate;
  }

  convertToLocalised(isoDate) {
    moment.locale(this.props.lang);
    let localDate = '';
    if (isoDate) {
      const dateObject = moment(isoDate);
      if (dateObject.isValid()) {
        localDate = dateObject.format(localFormat);
      }
    }
    return localDate;
  }
}

DateField.propTypes = {
  lang: React.PropTypes.string,
  data: React.PropTypes.shape({
    html5: React.PropTypes.boolean,
  }),
};

DateField.defaultProps = {
  data: {},
};

export { DateField as Component };

export default fieldHolder(DateField);
