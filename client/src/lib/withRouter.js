import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// Essentially a polyfill for the old withRouter hoc that came with react-router-dom
// This should really be replaced by using the hooks directly instead of as props but
// refactoring for that would take way longer than just adding this polyfill
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
