import React from 'react';
import CompositeField, { defaultProps as compositeDefaultProps, getClassName as getCompositeFieldClassName } from 'components/CompositeField/CompositeField';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const defaultProps = {
  ...compositeDefaultProps,
  smallholder: true,
};

const getClassName = (_props = {}) => {
  const props = {
    ...defaultProps,
    ..._props,
  };

  return classnames(
    'field-group-component',
    { 'field-group-component__small-holder': props.smallholder },
    getCompositeFieldClassName(props)
  );
};

const FieldGroup = (_props) => {
  const props = {
    ...defaultProps,
    ..._props,
  };

  return (
    <CompositeField
      {...props}
      className={getClassName(props)}
      extraClass=""
    />
  );
};

// Field group is essentially a composite field, but wrapped with a typical field holder
// fieldHolder wrapping happens in the FormBuilder component

FieldGroup.propTypes = {
  ...CompositeField.propTypes,
  smallholder: PropTypes.bool
};

// Exported for use by HistoricElementView which overrides this method.
export { defaultProps, getClassName };
export default FieldGroup;
