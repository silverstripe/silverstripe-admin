import React from 'react';
import SilverStripeComponent from 'lib/SilverStripeComponent';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import { FormControl } from 'react-bootstrap-ss';
import { DateField } from '../DateField/DateField';
import moment from 'moment';
import modernizr from 'modernizr';

class DateTimeField extends DateField {

  getInputProps() {
    const props = {};
    Object.assign(props, super.getInputProps());
    Object.assign(props, {
      type: this.props.html5 ? 'datetime-local' : 'text'
    });
    return props;
  }

  isMultiline() {
    return false;
  }

  hasNativeSupport() {
    return modernizr.inputtypes['datetime-local'];
  }

  triggerChange(value) {
    // html5 `datetime-local` input doesn't retain second digits if they're
    // `00` but that will failed the back-end validation. So add `:00` to the
    // value if they're missing.
    if(/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(value)) {
      value = value + ':00';
    }

    this.props.onChange(value);
  }

  convertToLocalised(isoTime) {
    moment.locale(this.props.lang);
    let localTime = '';
    if (isoTime) {
      const timeObject = moment(isoTime);
      if (timeObject.isValid()) {
        localTime = timeObject.format('L LT');
      }
    }
    return localTime;
  }

  convertToIso(localTime) {
    moment.locale(this.props.lang);
    let isoTime = '';
    if(localTime) {
      // Input value can be in local format 'L' or ISO format
      const timeObject = moment(localTime, ['L LT', moment.ISO_8601]);
      if(timeObject.isValid()) {
        isoTime = timeObject.format('YYYY-MM-DDTHH:mm:ss');
      }
    }
    return isoTime
  }

}

export { DateTimeField };

export default fieldHolder(DateTimeField);
