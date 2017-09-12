import React, { Component } from 'react';
import OptionField from 'components/OptionsetField/OptionField';
import fieldHolder from 'components/FieldHolder/FieldHolder';

class OptionsetField extends Component {
  constructor(props) {
    super(props);

    this.getItemKey = this.getItemKey.bind(this);
    this.getOptionProps = this.getOptionProps.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Generates a unique key for an item
   *
   * @param {object} item
   * @param {int} index
   * @returns {string} key
   */
  getItemKey(item, index) {
    const value = item.value || `empty${index}`;
    return `${this.props.id}-${value}`;
  }

  /**
   * Fetches the properties for the individual fields.
   *
   * @param {object} item
   * @param {int} index
   * @returns {object} properties
   */
  getOptionProps(item, index) {
    const key = this.getItemKey(item, index);

    return {
      key,
      id: key,
      name: this.props.name,
      className: `${this.props.itemClass} option-val--${item.value}`,
      disabled: item.disabled || this.props.disabled,
      readOnly: this.props.readOnly,
      onChange: this.handleChange,
      value: `${this.props.value}` === `${item.value}`,
      title: item.title,
      type: 'radio',
    };
  }

  /**
   * Handler for sorting what the value of the field will be
   *
   * @param {Event} event
   * @param {object} field
   */
  handleChange(event, field) {
    if (typeof this.props.onChange === 'function') {
      if (field.value === 1) {
        const sourceItem = this.props.source
          .find((item, index) => this.getItemKey(item, index) === field.id);

        this.props.onChange(sourceItem.value);
      }
    }
  }

  render() {
    if (!this.props.source) {
      return null;
    }
    return (
      <div>
        { this.props.source.map((item, index) => (
          <OptionField {...this.getOptionProps(item, index)} />
        )) }
      </div>
    );
  }
}

OptionsetField.propTypes = {
  extraClass: React.PropTypes.string,
  itemClass: React.PropTypes.string,
  id: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  source: React.PropTypes.arrayOf(React.PropTypes.shape({
    value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    title: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    disabled: React.PropTypes.bool,
  })),
  onChange: React.PropTypes.func,
  value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
  readOnly: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
};

OptionsetField.defaultProps = {
  // React considers "undefined" as an uncontrolled component.
  extraClass: '',
  className: '',
  itemClass: '',
};

export { OptionsetField as Component };

export default fieldHolder(OptionsetField);
