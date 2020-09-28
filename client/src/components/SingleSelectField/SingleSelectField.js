import React, { Component } from 'react';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import i18n from 'i18n';
import { Input } from 'reactstrap';
import PropTypes from 'prop-types';

class SingleSelectField extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Fetches the properties for the select field
   *
   * @returns {object} properties
   */
  getInputProps() {
    const props = {
      // @TODO Prevent entwine chosen applying chosen
      className: `${this.props.className} ${this.props.extraClass} no-chosen`,
      id: this.props.id,
      name: this.props.name,
      disabled: this.props.disabled,
    };

    if (!this.props.readOnly) {
      Object.assign(props, {
        onChange: this.handleChange,
        value: this.props.value,
      });
    } else {
      Object.assign(props, {
        disabled: true
      });
    }

    return props;
  }

  /**
   * Handles changes to the select field's value.
   *
   * @param {Event} event
   */
  handleChange(event) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(event, { id: this.props.id, value: event.target.value });
    }
  }

  render() {
    // .slice() to copy the array, because we could modify it with an empty item
    const options = (this.props.source)
      ? this.props.source.slice()
      : [];

    if (this.props.data.hasEmptyDefault && !options.find((item) => !item.value)) {
      options.unshift({
        value: '',
        title: this.props.data.emptyString,
        disabled: false,
      });
    }

    return (
      <Input type="select" {...this.getInputProps()}>
        { options.map((item, index) => {
          const key = `${this.props.name}-${item.value || `empty${index}`}`;
          const description = item.description || null;

          return (
            <option key={key} value={item.value} disabled={item.disabled} title={description}>
              {item.title}
            </option>
          );
        }) }
      </Input>
    );
  }
}

SingleSelectField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  source: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    disabled: PropTypes.bool,
  })),
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.shape({
      hasEmptyDefault: PropTypes.bool,
      emptyString: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ]),
};

SingleSelectField.defaultProps = {
  source: [],
  extraClass: '',
  className: '',
  data: {
    emptyString: i18n._t('Boolean.ANY', 'Any'),
  },
};

export { SingleSelectField as Component };

export default fieldHolder(SingleSelectField);
