import React from 'react';
import { reduxForm } from 'redux-form';
import { inject } from 'lib/Injector';
import getFormState from 'lib/getFormState';
import PropTypes from 'prop-types';

const InjectableForm = (props) => {
  const FormComponent = props.formComponent;
  const newProps = {
    ...props,
  };
  delete newProps.formComponent;

  return <FormComponent {...newProps} />;
};

InjectableForm.propTypes = {
  formComponent: PropTypes.elementType.isRequired,
};

const InjectedForm = inject(
  ['Form'],
  (formComponent) => ({ formComponent })
)(InjectableForm);

export default reduxForm({
  getFormState,
  destroyOnUnmount: false,
})(InjectedForm);
