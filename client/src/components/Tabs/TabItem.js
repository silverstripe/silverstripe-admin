import React from 'react';
import { TabPane } from 'reactstrap';
import PropTypes from 'prop-types';

const TabItem = ({ name, className, extraClass, disabled, children }) => (
  <TabPane tabId={name} className={`${className} ${extraClass}`} disabled={disabled}>
    {children}
  </TabPane>
);

TabItem.propTypes = {
  name: PropTypes.string.isRequired,
  extraClass: PropTypes.string,
  className: PropTypes.string,
};

TabItem.defaultProps = {
  className: '',
  extraClass: '',
};

export default TabItem;
