import React from 'react';
import SilverStripeComponent from 'lib/SilverStripeComponent';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import { FormControl } from 'react-bootstrap-ss';
import { TextField } from '../TextField/TextField';
import moment from 'moment';
import modernizr from 'modernizr';

class DateField extends TextField {

  constructor(props) {
    super(props);
  }

  render() {
    return super.render();
  }

  getInputProps() {
    const props = {};

    let val = this.props.value;
    if (!modernizr.inputtypes.date || this.props.readOnly) {
      val = this.getLocalisedValue();
    }

    Object.assign(props, super.getInputProps(), {
      type: 'date',
      defaultValue: val
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
    if (modernizr.inputtypes.date) {
      isoValue = enteredValue;
    }
    else {
      isoValue = this.convertToIso(enteredValue);
    }

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(isoValue);
    }
  }

  convertToIso(localDate) {
    moment.locale(this.props.lang);
    let isoDate = '';

    if (localDate) {
      // Input value can be in local format 'L' or ISO format
      const dateObject = moment(localDate, ['L', 'YYYY-MM-DD']);
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
        localDate = dateObject.format('L');
      }
    }
    return localDate;
  }

}

DateField.propTypes = {
  lang: React.PropTypes.string
}

export { DateField };

export default fieldHolder(DateField);
