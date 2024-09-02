import i18n from 'i18n';

/**
 * Function to create an HTTP error message from JSON returned from the PHP method `LeftAndMain::jsonError()`
 *
 * This is function should be be used in the call to catch() when using `lib/Backend`
 *
 * NOTE: The function in the the call to catch() must be async
 * and the call to this method must use await i.e. `const message = await getJsonErrorMessage(err);`
 *
 * This function is not defined in `lib/Backend` itself because it breaks mocking `lib/Backend`
 * in jest tests
 *
 * @param err - The first param of the function in call to catch() i.e. `.catch(aysnc (err) => {...})`
 */
export default async (err) => {
  let message = null;
  try {
    const errorJson = await err.response.json();
    message = errorJson.errors[0].value;
  } catch (e) {
    // noop
  }
  if (!message) {
    message = i18n._t('Admin.UNKNOWN_ERROR', 'An unknown error has occurred.');
  }
  return message;
};
