import React, { useEffect } from 'react';
import FormAlert from 'components/FormAlert/FormAlert';
import PropTypes from 'prop-types';

const Form = (props) => {
  let formRef = null;

  useEffect(() => {
    if (!props.autoFocus) {
      return;
    }
    if (formRef) {
      const input = formRef.querySelector('input:not([type=hidden]), select, textarea');
      if (input) {
        input.focus();
        if (input.select) {
          input.select();
        }
      }
    }
  }, []);

  /**
   * Generates a list of messages if any are available
   *
   * @returns {Array|null}
   */
  const renderMessages = () => {
    const { FormAlertComponent } = props;
    if (Array.isArray(props.messages)) {
      return props.messages.map((message, index) => (
        <FormAlertComponent
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className={!index ? 'message-box--panel-top' : ''}
          {...message}
        />
      ));
    }
    return null;
  };

  const handleSubmit = (event, ...args) => {
    // Ensure submitting a nested form doesn't submit the parent form
    event.stopPropagation();
    // Pass submission handling up the component stack
    props.handleSubmit(event, ...args);
  };

  const valid = props.valid !== false;
  const fields = props.mapFieldsToComponents(props.fields);
  const actions = props.mapActionsToComponents(props.actions);
  const messages = renderMessages();
  const FormTag = props.formTag;

  const className = ['form'];
  if (valid === false) {
    className.push('form--invalid');
  }
  if (props.attributes && props.attributes.className) {
    className.push(props.attributes.className);
  }
  const formProps = {
    ...props.attributes,
    onSubmit: handleSubmit,
    className: className.join(' '),
  };

  return <FormTag
    {...formProps}
    ref={(form) => {
      formRef = form;
      props.setDOM(form);
    }}
    role="form"
  >
    {fields &&
      <fieldset {...props.fieldHolder}>
        {messages}
        {props.afterMessages}
        {fields}
      </fieldset>
    }
    { actions && actions.length
      ? <div {...props.actionHolder}>
        {actions}
      </div>
      : null
    }
  </FormTag>;
};

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
