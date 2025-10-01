import Button from 'components/Button/Button';
import i18n from 'i18n';
import Config from 'lib/Config';
import backend from 'lib/Backend';
import PropTypes from 'prop-types';
import React, { createRef, useState } from 'react';
import { InputGroup, Input, FormGroup, Label, FormFeedback } from 'reactstrap';

/**
 * A password field that allows the user to enter their password to activate sudo mode.
 * This will make an XHR request to the server to activate sudo mode.
 * The page will be reloaded if the request is successful.
 */
function SudoModePasswordField(props) {
  const {
    onSuccess,
    autocomplete,
    initiallyCollapsed,
    verifyMessage,
    sectionTitle,
  } = props;
  const passwordFieldRef = createRef();
  const [responseMessage, setResponseMessage] = useState('');
  const [showVerify, setShowVerify] = useState(false);

  const clientConfig = Config.getSection('SilverStripe\\Admin\\SudoModeController');

  let verifyMessageValue = verifyMessage;
  if (!verifyMessageValue) {
    if (sectionTitle) {
      verifyMessageValue = i18n.inject(
        i18n._t(
          'Admin.SUDO_MODE_PASSWORD_FIELD_VERIFY_SECTION_TITLE',
          '\"{sectionTitle}\" is protected and is in read-only mode. Before editing please verify that it\'s you first.'
        ),
        { sectionTitle }
      );
    } else {
      verifyMessageValue = i18n._t(
        'Admin.SUDO_MODE_PASSWORD_FIELD_VERIFY',
        'This section is protected and is in read-only mode. Before editing please verify that it\'s you first.'
      );
    }
  }
  const helpLink = clientConfig.helpLink;
  if (helpLink) {
    verifyMessageValue = <>
      {verifyMessageValue}
      <a href={helpLink} className="sudo-mode-password-field__notice-help" target="_blank" rel="noopener noreferrer">
        { i18n._t('Admin.WHATS_THIS', 'What is this?') }
      </a>
    </>;
  }

  /**
   * Handle clicking the button to confirm the sudo mode notice
   * and trigger the verify form to be rendered.
   */
  function handleConfirmClick() {
    setShowVerify(true);
  }

  /**
   * Handle clicking the button to verify the sudo mode password
   */
  async function handleVerifyClick() {
    const url = clientConfig.endpoints.activate;
    if (url === null) {
      // Allow a null url to be set to prevent an XHR request for testing purposes
      setResponseMessage('Invalid password message');
      return;
    }
    const fetcher = backend.createEndpointFetcher({
      url: clientConfig.endpoints.activate,
      method: 'post',
      payloadFormat: 'urlencoded',
      responseFormat: 'json',
    });
    const data = {
      Password: passwordFieldRef.current.value,
    };
    const headers = {
      'X-SecurityID': Config.get('SecurityID'),
    };
    fetcher(data, headers)
      .then(() => onSuccess())
      .catch(async (err) => {
        const responseJson = await err.response.json();
        setResponseMessage(responseJson.message);
      });
  }

  /**
   * Treat pressing enter on the password field the same as clicking the
   * verify button.
   */
  function handleVerifyKeyDown(evt) {
    if (evt.key === 'Enter') {
      // Prevent the form from submitting
      evt.stopPropagation();
      evt.preventDefault();
      // Trigger the button click
      handleVerifyClick();
    }
  }

  /**
   * Renders a confirmation notice to the user that they will need to verify themselves
   * to enter sudo mode.
   */
  function renderConfirm() {
    return <div className="sudo-mode__notice sudo-mode-password-field__notice--required">
      <p className="sudo-mode-password-field__notice-message">
        { verifyMessageValue }
      </p>
      { !showVerify && (
        <Button
          className="sudo-mode-password-field__notice-button"
          color="info"
          onClick={() => handleConfirmClick()}
          icon="lock"
        >
          { i18n._t('Admin.VERIFY_TO_CONTINUE', 'Verify to continue') }
        </Button>
      ) }
    </div>;
  }

  /**
   * Renders the password verification form to enter sudo mode
   */
  function renderVerify() {
    const inputProps = {
      type: 'password',
      name: 'SudoModePassword',
      id: 'SudoModePassword',
      className: 'no-change-track',
      autoComplete: autocomplete,
      onKeyDown: (evt) => handleVerifyKeyDown(evt),
      innerRef: passwordFieldRef,
      autoFocus: true,
    };
    const validationProps = responseMessage ? { valid: false, invalid: true } : {};
    return <div className="sudo-mode-password-field__verify">
      <FormGroup className="sudo-mode-password-field__verify-form-group form-group">
        <Label for="SudoModePassword">
          { i18n._t('Admin.ENTER_PASSWORD', 'Enter your password') }
        </Label>
        <InputGroup>
          <Input {...inputProps} {...validationProps} />
          <Button
            className="sudo-mode-password-field__verify-button"
            color="info"
            onClick={() => handleVerifyClick()}
          >
            { i18n._t('Admin.VERIFY', 'Verify') }
          </Button>
          <FormFeedback>{ responseMessage }</FormFeedback>
        </InputGroup>
      </FormGroup>
    </div>;
  }

  const expanded = !initiallyCollapsed || showVerify;

  // Render the component
  return <div className="sudo-mode-password-field">
    { !expanded && <div className="sudo-mode-password-field__expander alert alert-info panel">
      <div className="sudo-mode-password-field__expander-text-container">{ verifyMessageValue }</div>
      <div className="sudo-mode-password-field__expander-button-container">
        <Button
          className="sudo-mode-password-field__expander-button"
          color="info"
          onClick={() => handleConfirmClick()}
          icon="lock"
        >
          { i18n._t('Admin.VERIFY', 'Verify') }
        </Button>
      </div>
    </div>}
    { expanded && <div className="sudo-mode-password-field__inner alert alert-info panel panel--padded">
      { renderConfirm() }
      { showVerify && renderVerify() }
    </div> }
  </div>;
}

SudoModePasswordField.propTypes = {
  verifyMessage: PropTypes.string,
  onSuccess: PropTypes.func.isRequired,
  autocomplete: PropTypes.string.isRequired,
  initiallyCollapsed: PropTypes.bool.isRequired,
  sectionTitle: PropTypes.string.isRequired,
};

export { SudoModePasswordField as Component };

export default SudoModePasswordField;
