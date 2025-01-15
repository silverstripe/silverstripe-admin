import React, { Component } from 'react';
import { FormGroup, InputGroup, InputGroupText, Label } from 'reactstrap';
import castStringToElement from 'lib/castStringToElement';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Tip, { tipShape, TIP_TYPES } from 'components/Tip/Tip';

function fieldHolder(Field) {
  class FieldHolder extends Component {
    /**
     * Gets the message from props or validation meta
     *
     * For object see castStringToElement
     *
     * @return {object|string|null}
     */
    getMessage() {
      let message = null;
      if (this.props.message && this.props.message.value) {
        message = this.props.message;
      }

      // If we have both meta and message, prefer meta only if form is dirty
      const meta = this.props.meta;
      if (meta && meta.error && meta.touched && (!message || meta.dirty)) {
        message = meta.error;
      }

      return message;
    }

    /**
     * Generates the properties for the field holder
     *
     * @returns {object}
     */
    getHolderProps() {
      // The extraClass property is defined on both the holder and element
      // for legacy reasons (same behaviour as PHP rendering)
      return {
        className: classnames({
          field: true,
          [this.props.extraClass]: true,
          readonly: this.props.readOnly,
          'form-group': true,
        }),
        id: this.props.holderId,
      };
    }

    /**
     * Build a FormAlert
     *
     * @returns {object}
     */
    renderMessage() {
      const message = this.getMessage();
      if (!message) {
        return null;
      }

      const classNames = classnames([
        'form__field-message',
        `form__field-message--${message.type}`,
      ]);
      const body = castStringToElement('div', message.value);
      return <div className={classNames}>{body}</div>;
    }

    /**
     * Build title label
     *
     * @returns {object}
     */
    renderLeftTitle() {
      const labelText = this.props.leftTitle
        ? this.props.leftTitle
        : this.props.title;

      if (!labelText || this.props.hideLabels) {
        return null;
      }

      return castStringToElement(
        Label,
        labelText,
        {
          className: 'form__field-label',
          for: this.props.id,
        }
      );
    }

    /**
     * Build title label
     *
     * @returns {object}
     */
    renderRightTitle() {
      if (!this.props.rightTitle || this.props.hideLabels) {
        return null;
      }

      return castStringToElement(
        Label,
        this.props.rightTitle,
        {
          className: 'form__field-label',
          for: this.props.id,
        }
      );
    }

    /**
     * Render the actual field, or input group wrapper with prefix and suffix
     *
     * @return {object}
     */
    renderField() {
      const hasMessage = Boolean(this.getMessage());
      const props = {
        ...this.props,
        extraClass: classnames(
          this.props.extraClass,
          { 'is-invalid': hasMessage }
        ),
      };

      const field = <Field {...props} />;
      let prefix = this.props.data && this.props.data.prefix ? this.props.data.prefix : '';
      let suffix = this.props.data && this.props.data.suffix ? this.props.data.suffix : '';
      if (!prefix && !suffix) {
        return field;
      }
      if (prefix !== '' && typeof prefix === 'string') {
        prefix = <InputGroupText>{prefix}</InputGroupText>;
      }
      if (suffix !== '' && typeof suffix === 'string') {
        suffix = <InputGroupText>{suffix}</InputGroupText>;
      }
      return (
        <InputGroup>
          {prefix}
          {field}
          {suffix}
        </InputGroup>
      );
    }

    /**
     * @returns {JSX.Element}
     */
    renderTitleTip() {
      if (!this.props.id || !this.props.titleTip || !this.props.titleTip.content) {
        return null;
      }
      return (
        <Tip
          id={`FieldHolder-${this.props.id}-titleTip`}
          content={this.props.titleTip.content}
          fieldTitle={this.props.title}
          type={TIP_TYPES.TITLE}
          icon="menu-help"
        />
      );
    }

    /**
     * Build description
     *
     * @returns {JSX.Element}
     */
    renderDescription() {
      if (this.props.description === null) {
        return null;
      }

      return castStringToElement(
        'div',
        this.props.description,
        { className: 'form__field-description' }
      );
    }

    render() {
      if (this.props.noHolder) {
        return this.renderField();
      }
      return (
        <FormGroup {...this.getHolderProps()}>
          {this.renderLeftTitle()}
          {this.renderTitleTip()}
          <div className="form__field-holder">
            {this.renderField()}
            {this.renderMessage()}
            {this.renderDescription()}
          </div>
          {this.renderRightTitle()}
        </FormGroup>
      );
    }
  }

  FieldHolder.propTypes = {
    leftTitle: PropTypes.any,
    rightTitle: PropTypes.any,
    title: PropTypes.any,
    extraClass: PropTypes.string,
    holderId: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.any,
    hideLabels: PropTypes.bool,
    message: PropTypes.shape({
      extraClass: PropTypes.string,
      value: PropTypes.any,
      type: PropTypes.string,
    }),
    data: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.shape({
        prefix: PropTypes.string,
        suffix: PropTypes.string,
      }),
    ]),
    titleTip: PropTypes.shape(tipShape)
  };

  FieldHolder.defaultProps = {
    className: '',
    extraClass: '',
    leftTitle: null,
    rightTitle: null,
    title: '',
    description: null,
    hideLabels: false,
    noHolder: false,
    message: null,
    data: {},
  };

  return FieldHolder;
}

export default fieldHolder;
