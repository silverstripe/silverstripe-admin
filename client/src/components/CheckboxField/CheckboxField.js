import React from 'react';
import OptionField from '../OptionsetField/OptionField';
import fieldHolder from 'components/FieldHolder/FieldHolder';

const CheckboxField = (props) => {
  // Build standard checkbox with fieldholder
  const FieldHolder = fieldHolder(OptionField);

  // set to not show field holder labels, as checkbox already generates a label
  return <FieldHolder {...props} type="checkbox" hideLabels />;
};

export default CheckboxField;
