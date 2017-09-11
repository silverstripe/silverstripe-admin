export default function getFormState(state) {
  const formState = state.form && state.form.formState;
  return formState || {};
}
