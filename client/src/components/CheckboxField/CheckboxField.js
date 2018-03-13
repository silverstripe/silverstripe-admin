import React from 'react';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import OptionField from 'components/OptionsetField/OptionField';

// Build inner field
const CheckboxField = (props) => (
  <OptionField {...props} type="checkbox" />
);

// Build holder
const CheckboxWithHolder = (props) => {
  const FieldHolder = fieldHolder(CheckboxField);
  // set to not show field holder labels, as checkbox already generates a label
  return <FieldHolder {...props} hideLabels />;
};

export { CheckboxField as Component };

export default CheckboxWithHolder;
