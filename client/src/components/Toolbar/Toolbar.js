import React from 'react';
import PropTypes from 'prop-types';
import BackButton from 'components/Button/BackButton';

/**
 * Display a toolbar with some children, usually a breadcrumb or some actions.
 */
const Toolbar = ({ showBackButton, children, onBackButtonClick }) => {
  const onClick = (e) => {
    e.preventDefault();
    if (typeof onBackButtonClick === 'function') {
      onBackButtonClick(e);
    }
  };

  return (
    <div className="toolbar toolbar--north">
      <div className="toolbar__navigation fill-width">
        {showBackButton && <BackButton onClick={onClick} className="toolbar__back-button" />}
        {children}
      </div>
    </div>
  );
};

Toolbar.propTypes = {
  onBackButtonClick: PropTypes.func,
  showBackButton: PropTypes.bool
};

Toolbar.defaultProps = {
  showBackButton: false,
};

export default Toolbar;
