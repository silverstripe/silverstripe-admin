import React, { Component } from 'react';
import { TabContent, Nav, NavItem, NavLink } from 'reactstrap';

class Tabs extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: this.getDefaultActiveKey()
    };
  }

  /**
   * Returns props for the container component
   *
   * @returns {object}
   */
  getContainerProps() {
    const {
      className,
      extraClass,
      id,
      } = this.props;
    const combinedClassName = `${className} ${extraClass}`;

    return {
      className: combinedClassName,
      id,
    };
  }

  /**
   * Determines a default tab to be opened and validates the given default tab.
   * Replaces the given default tab if it is invalid with a valid tab.
   *
   * @returns {string}
   */
  getDefaultActiveKey() {
    let active = null;

    if (typeof this.props.defaultActiveKey === 'string') {
      const activeChild = React.Children.toArray(this.props.children)
        .find((child) => child.props.name === this.props.defaultActiveKey);

      if (activeChild) {
        active = activeChild.props.name;
      }
    }

    if (typeof active !== 'string') {
      React.Children.forEach(this.props.children, (child) => {
        if (typeof active !== 'string') {
          active = child.props.name;
        }
      });
    }

    return active;
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  /**
   * Render an individual link for the tabset
   *
   * @param {object} child
   * @returns {Component}
   */
  renderTab(child) {
    if (child.props.title === null) {
      return null;
    }
    const classNames = `${this.state.activeTab === child.props.name ? 'active ' : ''}${child.props.tabClassName ? child.props.tabClassName : ''}`;

    return (
      <NavItem>
        <NavLink
          onClick={() => { this.toggle(child.props.name); }}
          disabled={child.props.disabled}
          className={classNames}
        >
          {child.props.title}
        </NavLink>
      </NavItem>
    );
  }

  /**
   * Builds the tabset navigation links, will hide the links if there is only one child
   *
   * @returns {Component}
   */
  renderNav() {
    const tabs = React.Children
      .map(this.props.children, this.renderTab, this);

    if (tabs.length <= 1) {
      return null;
    }

    return (
      <Nav tabs role="tablist">
        {tabs}
      </Nav>
    );
  }

  render() {
    const containerProps = this.getContainerProps();
    const nav = this.renderNav();

    return (
      <div {...containerProps}>
        <div className="wrapper">
          { nav }
          <TabContent activeTab={this.state.activeTab}>
            {this.props.children}
          </TabContent>
        </div>
      </div>
    );
  }
}

Tabs.propTypes = {
  id: React.PropTypes.string.isRequired,
  defaultActiveKey: React.PropTypes.string,
  extraClass: React.PropTypes.string,
};

Tabs.defaultProps = {
  className: '',
  extraClass: '',
};

export default Tabs;
