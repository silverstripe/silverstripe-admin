import React, { Component } from 'react';
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  Popover,
  PopoverBody,
} from 'reactstrap';
import PropTypes from 'prop-types';

const tipImportanceColorMap = {
  normal: 'muted',
  high: 'danger',
};

const tipImportanceMessageMap = {
  normal: 'Tip',
  high: 'Important tip',
};

class InputField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tipOpen: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleTipToggle = this.handleTipToggle.bind(this);
  }

  /**
   * Fetches the properties for the input field
   *
   * @returns {object} properties
   */
  getInputProps() {
    const props = {
      className: `${this.props.className} ${this.props.extraClass}`,
      id: this.props.id,
      name: this.props.name,
      disabled: this.props.disabled,
      readOnly: this.props.readOnly,
      value: this.props.value || '',
      placeholder: this.props.placeholder,
      autoFocus: this.props.autoFocus,
      maxLength: this.props.data && this.props.data.maxlength,
      type: this.props.type ? this.props.type : null,
      onBlur: this.props.onBlur,
      onFocus: this.props.onFocus
    };

    if (this.props.attributes && !Array.isArray(this.props.attributes)) {
      Object.assign(props, this.props.attributes);
    }

    if (!this.props.readOnly) {
      Object.assign(props, {
        onChange: this.handleChange,
      });
    }

    return props;
  }

  /**
   * Handles changes to the input field's value.
   *
   * @param {Event} event
   */
  handleChange(event) {
    if (typeof this.props.onChange === 'function') {
      if (!event.target) {
        return;
      }
      this.props.onChange(event, { id: this.props.id, value: event.target.value });
    }
  }

  handleTipToggle() {
    this.setState((state) => ({ tipOpen: !state.tipOpen }));
  }

  renderTip() {
    const id = this.props.id || this.props.name;
    const title = this.props.title;
    const { icon = 'lamp', importance = 'normal', content } = this.props.tip;
    const { tipOpen } = this.state;

    const tipIconColor = tipImportanceColorMap[importance];
    const tipType = tipImportanceMessageMap[importance];

    return [
      (
        <Button
          color="outline-secondary"
          id={`${id}-tip`}
          onClick={this.handleTipToggle}
          className={`btn--no-text btn--last font-icon-${icon} text-${tipIconColor}`}
          aria-label={`${tipType} for ${title}`}
          aria-expanded={tipOpen}
        />
      ),
      (
        <Popover
          target={`${id}-tip`}
          placement="top-end"
          isOpen={tipOpen}
        >
          <PopoverBody aria-live="assertive" aria-relevant="additions">{content}</PopoverBody>
        </Popover>
      )
    ];
  }

  renderFieldWithTip() {
    return (
      <InputGroup>
        <Input {...this.getInputProps()} />
        <InputGroupAddon addonType="append">
          {this.renderTip()}
        </InputGroupAddon>
      </InputGroup>
    );
  }

  render() {
    if (this.props.tip) {
      return this.renderFieldWithTip();
    }

    return <Input {...this.getInputProps()} />;
  }
}

InputField.propTypes = {
  extraClass: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  autoFocus: PropTypes.bool,
  attributes: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  tip: PropTypes.shape({
    content: PropTypes.string.isRequired,
    importance: PropTypes.string,
    icon: PropTypes.string,
  }),
};

InputField.defaultProps = {
  // React considers "undefined" as an uncontrolled component.
  value: '',
  extraClass: '',
  className: '',
  type: 'text',
  attributes: {},
};

export { InputField as Component };

export default InputField;
