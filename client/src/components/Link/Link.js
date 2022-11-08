import React from 'react';
import PropTypes from 'prop-types';
import { useInRouterContext, Link as RouterLink } from 'react-router-dom';

/**
 * This component can be used whenever a component which needs a relative link
 * might be rendered in both context within a router (e.g. asset admin) and
 * contexts without a router (e.g. inside an image upload modal).
 */
function Link({ children, href, ...props }) {
  const hasRouter = useInRouterContext();
  const LinkComponent = hasRouter ? RouterLink : 'a';

  return (
    <LinkComponent
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      to={hasRouter ? href : undefined}
      href={hasRouter ? undefined : href}
    >
      {children}
    </LinkComponent>
  );
}

Link.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

export default Link;
