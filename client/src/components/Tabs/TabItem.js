import React, { Component } from 'react';
import { Fade, TabPane } from 'reactstrap';

class TabItem extends Component {
  /**
   * Fetches the properties for the tab content
   *
   * @returns {object} properties
   */
  getTabProps() {
    const {
      name,
      className,
      extraClass,
      disabled,
      } = this.props;

    return {
      tabId: name,
      className: `${className} ${extraClass}`,
      disabled,
    };
  }

  /**
   * Checks if the tab is the active tab
   *
   * @returns {bool} active
   */
  isActive() {
    return this.context.activeTabId === this.props.name;
  }

  render() {
    const tabProps = this.getTabProps();
    return (
      <TabPane {...tabProps}>
        <Fade in={this.isActive()}>
          {this.props.children}
        </Fade>
      </TabPane>
    );
  }
}

TabItem.propTypes = {
  name: React.PropTypes.string.isRequired,
  extraClass: React.PropTypes.string,
  tabClassName: React.PropTypes.string,
};

TabItem.defaultProps = {
  className: '',
  extraClass: '',
};

TabItem.contextTypes = {
  activeTabId: React.PropTypes.string
};

export default TabItem;
