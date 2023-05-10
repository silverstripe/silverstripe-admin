import React, { Component } from 'react';
import FormAlert from 'components/FormAlert/FormAlert';
import PropTypes from 'prop-types';

class Form extends Component {
  componentDidMount() {
    if (!this.props.autoFocus) {
      return;
    }

    if (this.form) {
      const input = this.form.querySelector('input:not([type=hidden]), select, textarea');
      if (input) {
        input.focus();
        if (input.select) {
          input.select();
        }
      }
    }
  }

  /**
   * Generates a list of messages if any are available
   *
   * @returns {Array|null}
   */
  renderMessages() {
    const { FormAlertComponent } = this.props;
    if (Array.isArray(this.props.messages)) {
      return this.props.messages.map((message, index) => (
        <FormAlertComponent
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className={!index ? 'message-box--panel-top' : ''}
          {...message}
        />
      ));
    }
    return null;
  }

  render() {
    const valid = this.props.valid !== false;
    const fields = this.props.mapFieldsToComponents(this.props.fields);
    const actions = this.props.mapActionsToComponents(this.props.actions);
    const messages = this.renderMessages();
    const FormTag = this.props.formTag;

    const className = ['form'];
    if (valid === false) {
      className.push('form--invalid');
    }
    if (this.props.attributes && this.props.attributes.className) {
      className.push(this.props.attributes.className);
    }
    const formProps = {
      ...this.props.attributes,
      onSubmit: this.props.handleSubmit,
      className: className.join(' '),
    };

    return (
      <FormTag
        {...formProps}
        ref={(form) => { this.form = form; this.props.setDOM(form); }}
        role="form"
      >
        {fields &&
          <fieldset {...this.props.fieldHolder}>
            {messages}
            {this.props.afterMessages}

            {fields}
          </fieldset>
        }

        { actions && actions.length
          ?
            <div {...this.props.actionHolder}>
              {actions}
            </div>
          : null
        }
      </FormTag>
    );
  }
}

Form.propTypes = {
  autoFocus: PropTypes.bool,
  setDOM: PropTypes.func,
  valid: PropTypes.bool,
  actions: PropTypes.array,
  fieldHolder: PropTypes.shape({
    className: PropTypes.string
  }),
  actionHolder: PropTypes.shape({
    className: PropTypes.string
  }),
  extraClass: PropTypes.string,
  afterMessages: PropTypes.node,
  attributes: PropTypes.shape({
    action: PropTypes.string.isRequired,
    className: PropTypes.string,
    encType: PropTypes.string,
    id: PropTypes.string,
    method: PropTypes.string.isRequired,
  }),
  fields: PropTypes.array.isRequired,
  // props is named `handleSubmit` as it is recieved from redux-form
  handleSubmit: PropTypes.func,
  mapActionsToComponents: PropTypes.func.isRequired,
  mapFieldsToComponents: PropTypes.func.isRequired,
  messages: PropTypes.arrayOf(PropTypes.shape({
    extraClass: PropTypes.string,
    value: PropTypes.any,
    type: PropTypes.string,
  })),
  formTag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  FormAlertComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
};

Form.defaultProps = {
  setDOM: () => null,
  formTag: 'form',
  actionHolder: {
    className: 'btn-toolbar'
  },
  FormAlertComponent: FormAlert
};

export { Form as Component };

export default Form;
