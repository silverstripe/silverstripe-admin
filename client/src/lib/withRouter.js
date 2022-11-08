import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

// Essentially a polyfill for the old withRouter hoc that came with react-router-dom
// This should really be replaced by using the hooks directly in components that need
// it instead of as props but refactoring for that would take way longer than just
// polyfilling and refactoring to use the new API exposed by this HOC
export default function withRouter(ComponentToWrap) {
  function ComponentWithRouterProp(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return (
      <ComponentToWrap
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }
  return ComponentWithRouterProp;
}

// Anything which uses withRouter should accept a prop named "router" with this typing
export const routerPropTypes = PropTypes.shape({
  location: PropTypes.shape({
    pathname: PropTypes.string,
    query: PropTypes.object,
    search: PropTypes.string,
  }),
  navigate: PropTypes.func,
  params: PropTypes.object,
});
