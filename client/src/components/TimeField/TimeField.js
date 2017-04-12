import React from 'react';
import SilverStripeComponent from 'lib/SilverStripeComponent';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import { FormControl } from 'react-bootstrap-ss';
import { DateField } from '../DateField/DateField';
import moment from 'moment';
import modernizr from 'modernizr';

class TimeField extends DateField {

  getInputProps() {
    const props = {};
    Object.assign(props, super.getInputProps());
    Object.assign(props, {
      type: this.props.html5 ? 'time' : 'text',
    });
    return props;
  }

  isMultiline() {
    return false;
  }

  hasNativeSupport() {
    return modernizr.inputtypes.time;
  }

  convertToLocalised(isoTime) {
    let localTime = '';
    if (isoTime) {
      const timeObject = moment(isoTime, "HH:mm:ss");
      if (timeObject.isValid()) {
        localTime = timeObject.format('LT');
      }
    }
    return localTime;
  }

  convertToIso(localTime) {
    let isoTime = '';
    if(localTime) {
      const timeObject = moment(localTime, "LT");
      if(timeObject.isValid()) {
        isoTime = timeObject.format("HH:mm:ss");
      }
    }
    return isoTime
  }

}

export { TimeField };

export default fieldHolder(TimeField);
