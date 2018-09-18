import React, { Component } from 'react';
import { TabContent, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { setActiveTab } from 'state/tabs/TabsActions';

class Tabs extends Component {
  constructor(props) {
    super(props);

    this.handleSetActiveTab = this.handleSetActiveTab.bind(this);
    this.renderTab = this.renderTab.bind(this);
  }

  componentDidMount() {
    this.handleSetActiveTab(this.getDefaultActiveKey());
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

    return {
      className: classnames([className, extraClass]),
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

  /**
   * Set the active tab
   *
   * @param activeTab
   */
  handleSetActiveTab(activeTab) {
    const { onSetActiveTab } = this.props;

    if (this.props.activeTab !== activeTab) {
      onSetActiveTab(activeTab);
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
    const classNames = classnames({
      active: this.props.activeTab === child.props.name,
      [child.props.tabClassName]: child.props.tabClassName,
    });

    return (
      <NavItem>
        <NavLink
          onClick={() => (this.handleSetActiveTab(child.props.name))}
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
      .map(this.props.children, this.renderTab);

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
    const { hideNav, children, activeTab } = this.props;

    const containerProps = this.getContainerProps();
    const nav = hideNav ? null : this.renderNav();

    return (
      <div {...containerProps}>
        <div className="wrapper">
          {nav}
          <TabContent activeTab={activeTab}>
            {children}
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
  hideNav: React.PropTypes.bool,
  activeTab: React.PropTypes.string,
  onSetActiveTab: React.PropTypes.func,
};

Tabs.defaultProps = {
  className: '',
  extraClass: '',
  hideNav: false,
};

function mapStateToProps(state) {
  const {
    activeTab,
  } = state.tabs;

  return {
    activeTab,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSetActiveTab(activeTab) {
      dispatch(setActiveTab(activeTab));
    },
  };
}

export { Tabs as Component };
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tabs);
