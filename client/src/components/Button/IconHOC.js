import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * Higher order component that adds a `icon` props to another component and translate
 * it to a matching class.
 *
 * @deprecated 3.2.0 Use an inner span with aria-hidden="true" instead.
 */
const IconHOC = (Component) => {
  const IconComponent = ({ icon, className, ...props }) =>
    (<Component
      className={classnames(className, icon && `font-icon-${icon}`)}
      {...props}
    />);

  IconComponent.propTypes = {
    ...Component.propTypes,
    icon: PropTypes.string
  };

  IconComponent.defaultProps = Component.defaultProps;
  IconComponent.displayName = Component.name;

  return IconComponent;
};

export default IconHOC;
