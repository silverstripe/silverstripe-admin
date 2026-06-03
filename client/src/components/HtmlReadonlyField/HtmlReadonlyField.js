import React from 'react';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import { Input } from 'reactstrap';
import PropTypes from 'prop-types';

const HtmlReadonlyField = (_props) => {
  const defaultProps = {
    // React considers "undefined" as an uncontrolled component.
    extraClass: '',
    className: '',
  };
  const props = {
    ...defaultProps,
    ..._props,
  };

  /**
   * Fetches the properties for the text field
   *
   * @returns {object} properties
   */
  const getInputProps = () => ({
    // The extraClass property is defined on both the holder and element
    // for legacy reasons (same behaviour as PHP rendering)
    className: `${props.className} ${props.extraClass}`,
    id: props.id,
    name: props.name,
  });

  return (
    <Input
      plaintext
      tag="p"
      dangerouslySetInnerHTML={{ __html: props.value }}
      {...getInputProps()}
    />
  );
};

HtmlReadonlyField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  extraClass: PropTypes.string,
  value: PropTypes.string,
};

export { HtmlReadonlyField as Component };

export default fieldHolder(HtmlReadonlyField);
