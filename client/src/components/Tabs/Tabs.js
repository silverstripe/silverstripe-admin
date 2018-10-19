import React, { Component } from 'react';
import { TabContent, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Actions from 'state/tabs/TabsActions';

class Tabs extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.renderTab = this.renderTab.bind(this);
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

  toggle(activeTab) {
    if (this.props.activeTab !== activeTab) {
      this.props.activateTab(activeTab);
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

    const currentTab = this.props.activeTab || this.getDefaultActiveKey();

    const classNames = classnames({
      active: currentTab === child.props.name,
      [child.props.tabClassName]: child.props.tabClassName,
    });

    return (
      <NavItem>
        <NavLink
          onClick={() => (this.toggle(child.props.name))}
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
          <TabContent activeTab={activeTab || this.getDefaultActiveKey()}>
            {children}
          </TabContent>
        </div>
      </div>
    );
  }
}

Tabs.propTypes = {
  id: PropTypes.string.isRequired,
  defaultActiveKey: PropTypes.string,
  extraClass: PropTypes.string,
  hideNav: PropTypes.bool,
  activateTab: PropTypes.func,
  activeTab: PropTypes.string,
};

Tabs.defaultProps = {
  className: '',
  extraClass: '',
  hideNav: false
};

export { Tabs as Component };

const createFieldID = (props) => `${props.formid}__${props.id}`;

function mapStateToProps(state, ownProps) {
  const fieldID = createFieldID(ownProps);
  const field = (state.tabs.fields[fieldID])
    ? state.tabs.fields[fieldID]
    : {
      activeTab: null,
    };

  return { ...field };
}

function mapDispatchToProps(dispatch, ownProps) {
  const fieldID = createFieldID(ownProps);
  return {
    activateTab(activeTab) {
      dispatch(Actions.activateTab(fieldID, activeTab));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tabs);
