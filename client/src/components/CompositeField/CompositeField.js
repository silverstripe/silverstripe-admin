import React from 'react';
import castStringToElement from 'lib/castStringToElement';
import PropTypes from 'prop-types';

const defaultProps = {
  className: '',
  extraClass: '',
};

/**
 * Builds the legend for a fieldset if it is defined
 *
 * @returns {Component|null}
 */
const getLegend = (data) => {
  if (data.tag === 'fieldset' && data.legend) {
    return castStringToElement(
      'legend',
      data.legend
    );
  }
  return null;
};

const getClassName = ({
  className = defaultProps.className,
  extraClass = defaultProps.extraClass,
} = defaultProps) => `${className} ${extraClass}`;

const CompositeField = (_props) => {
  const props = {
    ...defaultProps,
    ..._props,
  };
  const legend = getLegend(props.data);
  const Tag = props.data.tag || 'div';
  const resolvedClassName = getClassName({ className: props.className, extraClass: props.extraClass });

  return (
    <Tag className={resolvedClassName}>
      {legend}
      {props.children}
    </Tag>
  );
};

CompositeField.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({
      tag: PropTypes.string,
      legend: PropTypes.string,
    }),
  ]),
  extraClass: PropTypes.string,
};

export { CompositeField as Component };
// Exported for use by FieldGroup and HistoricElementView which derive this behaviour without class inheritance.
export { defaultProps, getClassName, getLegend };

export default CompositeField;
