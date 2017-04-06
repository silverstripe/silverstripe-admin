import React from 'react';
import SilverStripeComponent from 'lib/SilverStripeComponent';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import { FormControl } from 'react-bootstrap-ss';
import { TextField } from '../TextField/TextField';
import moment from 'moment';
import modernizr from 'modernizr';

class DateTimeField extends TextField {

  constructor(props) {
    super(props);
  }

  render() {
    return super.render();
  }

  getInputProps() {
    const props = {};
    Object.assign(props, super.getInputProps());
    Object.assign(props, { type: 'datetime-local' });
    return props;
  }

  isMultiline() {
    return false;
  }

}

DateTimeField.propTypes = {
  lang: React.PropTypes.string
}

export { DateTimeField };

export default fieldHolder(DateTimeField);
