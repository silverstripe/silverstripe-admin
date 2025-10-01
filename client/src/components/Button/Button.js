import React from 'react';
import { Button as BaseButton } from 'reactstrap';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Button = ({ icon, className, noText, children, ...props }) =>
  (<BaseButton
    className={classnames(className, { 'btn--no-text': noText })}
    aria-label={noText ? children : undefined}
    {...props}
  >
    {icon && <span className={`font-icon-${icon}`} aria-hidden="true" />}
    {noText ? undefined : children}
  </BaseButton>);

Button.propTypes = {
  ...BaseButton.propTypes,
  noText: PropTypes.bool,
  icon: PropTypes.string,
};

Button.defaultProps = {
  ...BaseButton.defaultProps,
  noText: false
};

export default Button;
