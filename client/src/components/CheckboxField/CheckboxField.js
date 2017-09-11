import React, { Component } from 'react';
import OptionField from '../OptionsetField/OptionField';
import fieldHolder from 'components/FieldHolder/FieldHolder';

class CheckboxField extends Component {
  render() {
    // Build standard checkbox with fieldholder
    const FieldHolder = fieldHolder(OptionField);

    // set to not show field holder labels, as checkbox already generates a label
    return <FieldHolder {...this.props} type="checkbox" hideLabels />;
  }
}

export default CheckboxField;
