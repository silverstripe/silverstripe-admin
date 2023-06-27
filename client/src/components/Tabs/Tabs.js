import React, { useMemo } from 'react';
import { TabContent } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Actions from 'state/tabs/TabsActions';
import useTabContext, { TabContext } from 'hooks/useTabContext';
import TabNav from './TabNav';
import getDefaultActiveKey from './getDefaultActiveKey';

/**
 * Displays a tab set that cam be used to break up a form into smaller chunks.
 * @param {boolean} hideNav
 * @param {JSX.Element} children
 * @param {string?} activeTab
 * @param {string?} className
 * @param {string?} extraClass
 * @param {string} id
 * @param {function} activateTab
 * @param {string?} defaultActiveKey
 * @returns {JSX.Element}
 * @constructor
 */
function Tabs({
  hideNav, children, activeTab, className, extraClass, id, activateTab, defaultActiveKey
}) {
  const containerProps = { className: classnames([className, extraClass]), id };
  const currentTab = activeTab || getDefaultActiveKey(defaultActiveKey, children);
  const tabContext = useTabContext();
  const isOnActiveTab = tabContext ? tabContext.isOnActiveTab : undefined;
  const nextTabContext = useMemo(() => (
    {
      activeTab: currentTab,
      isOnActiveTab
    }),
  [activeTab, isOnActiveTab]
  );

  return (
    <div {...containerProps}>
      <div className="wrapper">
        {!hideNav && <TabNav currentTab={currentTab} onToggle={activateTab}>{children}</TabNav>}
        <TabContent activeTab={currentTab}>
          <TabContext.Provider value={nextTabContext}>
            {children}
          </TabContext.Provider>
        </TabContent>
      </div>
    </div>
  );
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
