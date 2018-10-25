import React from 'react';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import OptionField from 'components/OptionsetField/OptionField';

// Build inner field
const Checkbox = (props) => (
  <OptionField {...props} type="checkbox" />
);

// Build holder
const CheckboxField = (props) => {
  const FieldHolder = fieldHolder(Checkbox);
  // set to not show field holder labels, as checkbox already generates a label
  return <FieldHolder {...props} hideLabels />;
};

export { Checkbox as Component };

export default CheckboxField;
