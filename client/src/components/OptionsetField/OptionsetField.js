import React from 'react';
import OptionField from 'components/OptionsetField/OptionField';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import PropTypes from 'prop-types';

const OptionsetField = (_props) => {
  const defaultProps = {
    // React considers "undefined" as an uncontrolled component.
    extraClass: '',
    className: '',
    itemClass: '',
  };
  const props = {
    ...defaultProps,
    ..._props,
  };

  /**
   * Generates a unique key for an item
   *
   * @param {object} item
   * @param {int} index
   * @returns {string} key
   */
  const getItemKey = (item, index) => {
    const value = item.value || `empty${index}`;
    return `${props.id}-${value}`;
  };

  /**
   * Handler for sorting what the value of the field will be
   *
   * @param {Event} event
   * @param {object} field
   */
  const handleChange = (event, field) => {
    if (typeof props.onChange === 'function') {
      if (field.value === 1) {
        const sourceItem = props.source
          .find((item, index) => getItemKey(item, index) === field.id);

        props.onChange(event, { id: props.id, value: sourceItem.value });
      }
    }
  };

  /**
   * Fetches the properties for the individual fields.
   *
   * @param {object} item
   * @param {int} index
   * @returns {object} properties
   */
  const getOptionProps = (item, index) => {
    const key = getItemKey(item, index);

    return {
      key,
      id: key,
      name: props.name,
      className: `${props.itemClass} option-val--${item.value}`,
      disabled: item.disabled || props.disabled,
      readOnly: props.readOnly,
      onChange: handleChange,
      value: `${props.value}` === `${item.value}`,
      title: item.title,
      type: 'radio',
      role: 'option',
    };
  };

  if (!props.source) {
    return null;
  }
  return (
    <div role="listbox">
      { props.source.map((item, index) => (
        <OptionField {...getOptionProps(item, index)} hideLabels />
      )) }
    </div>
  );
};

OptionsetField.propTypes = {
  extraClass: PropTypes.string,
  itemClass: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  source: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool,
  })),
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
};

export { OptionsetField as Component };

export default fieldHolder(OptionsetField);
