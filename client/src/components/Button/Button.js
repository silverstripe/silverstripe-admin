import React from 'react';
import { Button as BaseButton } from 'reactstrap';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import IconHOC from './IconHOC';

const Button = ({ className, noText, children, ...props }) =>
  (<BaseButton
    className={classnames(className, { 'btn--no-text': noText })}
    aria-label={noText ? children : undefined}
    {...props}
  >{noText ? undefined : children}</BaseButton>);

Button.propTypes = {
  ...BaseButton.propTypes,
  noText: PropTypes.bool
};

Button.defaultProps = {
  ...BaseButton.defaultProps,
  noText: false
};

export default IconHOC(Button);
