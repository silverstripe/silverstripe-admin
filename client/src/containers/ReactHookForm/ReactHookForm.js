import React, { useMemo, createContext } from 'react';
import { useForm } from 'react-hook-form';

export const ReactHookFormContext = createContext({});

const ReactHookForm = (props) => {
  // useForm() is called outside of the useMemo() hook because you cannot have a hook
  // inside of another hoook
  const {
    register,
    handleSubmit,
    watch,
    formState,
    control
  } = useForm();

  // useMemo() prevents the context from being recreated on every render
  const value = useMemo(() => ({
    register,
    handleSubmit,
    watch,
    formState,
    control,
  }), []);

  return <ReactHookFormContext.Provider value={value}>
    {props.children}
  </ReactHookFormContext.Provider>;
};

export default ReactHookForm;
