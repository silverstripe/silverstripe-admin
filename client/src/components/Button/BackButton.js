import React from 'react';
import Button from 'components/Button/Button';
import classnames from 'classnames';
import i18n from 'i18n';

const BackButton = ({ className, ...props }) => (
  <Button
    className={classnames(className, 'back-button')}
    {...props}
  />
);

BackButton.propTypes = Button.propTypes;

BackButton.defaultProps = {
  ...Button.defaultProps,
  noText: true,
  icon: 'left-open-big',
  children: i18n._t('Admin.BACK', 'Back')
};

export default BackButton;
