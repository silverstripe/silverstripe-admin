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
    console.log('------- this is time field');
    return super.render();
  }

  getInputProps() {
    const props = {};
    Object.assign(props, super.getInputProps());
    Object.assign(props, { type: 'time' });
    return props;
  }

  isMultiline() {
    return false;
  }

}

TimeField.propTypes = {
  lang: React.PropTypes.string
}

export { TimeField };

export default fieldHolder(TimeField);
