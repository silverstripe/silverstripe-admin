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
    Object.assign(props, super.getInputProps());
    Object.assign(props, { value: this.getDisplayValue(), type: 'date' });
    return props;
  }

  getDisplayValue() {
    // return this.props.value;
    if (modernizr.inputtypes.date) {
      return this.props.value;
    }
    else {
      return this.convertToLocalDate(this.props.value);
    }
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
    const localDate = event.target.value;
    let isoDate = '';

    // When browser support input=date the date value is already in iso format
    if (modernizr.inputtypes.date) {
      isoDate = localDate;
    }
    else {
      isoDate = this.convertToIsoDate(localDate);
    }

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event, { id: this.props.id, value: isoDate });
    }
  }

  convertToIsoDate(localDate) {
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

  convertToLocalDate(isoDate) {
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
