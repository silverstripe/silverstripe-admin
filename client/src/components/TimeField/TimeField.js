import React from 'react';
import SilverStripeComponent from 'lib/SilverStripeComponent';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import { FormControl } from 'react-bootstrap-ss';
import { TextField } from '../TextField/TextField';
import moment from 'moment';
import modernizr from 'modernizr';

class TimeField extends TextField {

  constructor(props) {
    super(props);
  }

  render() {
    return super.render();
  }

  getInputProps() {
    console.log('---', this.props.value, this.getDisplayValue());
    const props = {};
    Object.assign(props, super.getInputProps());
    Object.assign(props, { value: this.getDisplayValue(), type: 'time' });
    return props;
  }

  isMultiline() {
    return false;
  }

  getDisplayValue() {
    return this.props.value;
    return this.convertToLocalTime(this.props.value);
    // return this.props.value;
    if (modernizr.inputtypes.date) {
      return this.props.value;
    }
    else {
      return this.convertToLocalTime(this.props.value);
    }
  }

  convertToLocalTime(isoTime) {
    moment.locale(this.props.lang);
    let localTime = '';
    if (isoTime) {
      const timeObject = moment(isoTime);
      console.log('--- is valid', timeObject.isValid());
      if (timeObject.isValid()) {
        localTime = dateObject.format('L');
      }
    }
    return localTime;
  }

}

TimeField.propTypes = {
  lang: React.PropTypes.string
}

export { TimeField };

export default fieldHolder(TimeField);
