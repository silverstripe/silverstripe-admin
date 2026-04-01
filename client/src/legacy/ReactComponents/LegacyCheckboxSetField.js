import React, { Component } from 'react';
import OptionField from 'components/OptionsetField/OptionField';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import PropTypes from 'prop-types';

// a group of check boxes
class CheckboxSet extends Component {
  constructor(props) {
    super(props);

    this.getItemKey = this.getItemKey.bind(this);
    this.getOptionProps = this.getOptionProps.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getValues = this.getValues.bind(this);
  }

  /**
   * Generates a unique key for an item
   *
   * @param {object} item
   * @param {int} index
   * @returns {string} key
   */
  getItemKey(item, index) {
    return `${this.props.id}-${item.value || `empty${index}`}`;
  }

  /**
   * Gets the array of values possible, converts to array if it is not.
   *
   * @returns {Array} values
   */
  getValues() {
    let values = this.props.value;

    if (!Array.isArray(values)) {
      if (typeof values === 'string') {
        values = values.length ? [values] : [];
      }
      if (typeof values === 'number') {
        values = [values];
      }
    }

    if (values) {
      // casting all to string because of numeric strings being casted to numbers
      return values.map((value) => `${value}`);
    }
    return [];
  }

  /**
   * Fetches properties for an item
   *
   * @param {object} item
   * @param {int} index
   * @returns {object} properties
   */
  getOptionProps(item, index) {
    const values = this.getValues();
    const key = this.getItemKey(item, index);

    return {
      key,
      id: key,
      name: this.props.name,
      className: this.props.itemClass,
      disabled: item.disabled || this.props.disabled,
      readOnly: this.props.readOnly,
      onChange: this.handleChange,
      value: values.indexOf(`${item.value}`) > -1,
      title: item.title,
      role: 'option',
      type: 'checkbox',
    };
  }

  /**
   * Handler for sorting what the value of the field will be, this flows on from the
   * OptionField (single checkbox) event handler and adding or removing the corresponding value the
   * single checkbox represented to suit the multiple checkbox group.
   *
   * @param {Event} event
   * @param {object} field
   */
  handleChange(event, field) {
    if (typeof this.props.onChange === 'function') {
      const oldValue = this.getValues();
      const value = this.props.source
        .filter((item, index) => {
          if (this.getItemKey(item, index) === field.id) {
            return field.value === 1;
          }
          return oldValue.indexOf(`${item.value}`) > -1;
        })
        .map((item) => `${item.value}`);

      this.props.onChange(event, { id: this.props.id, value });
    }
  }

  render() {
    if (!this.props.source) {
      return null;
    }
    return (
      <div role="listbox">
        { this.props.source.map((item, index) => (
          <OptionField {...this.getOptionProps(item, index)} hideLabels />
        )) }
      </div>
    );
  }
}

CheckboxSet.propTypes = {
  className: PropTypes.string,
  extraClass: PropTypes.string,
  itemClass: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  source: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.any,
    disabled: PropTypes.bool,
  })),
  onChange: PropTypes.func,
  value: PropTypes.any,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
};

CheckboxSet.defaultProps = {
  // React considers "undefined" as an uncontrolled component.
  extraClass: '',
  className: '',
  value: [],
};

export { CheckboxSet as Component };

const CheckboxSetField = (props) => {
  const FieldHolder = fieldHolder(CheckboxSet);
  return <FieldHolder {...props} />;
};

export default CheckboxSetField;
