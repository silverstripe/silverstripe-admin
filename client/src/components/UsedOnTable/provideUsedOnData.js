import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loadUsedOn } from 'state/usedOn/usedOnActions';
import { injectTabContext } from 'hooks/useTabContext';

const provideUsedOnData = (UsedOnTable) => {
  class UsedOnDataProvider extends Component {
    componentDidMount() {
      this.haveFetchedData = false;
      if (this.props.forceFetch) {
        this.fetchDataFromEndpoint();
      }
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.identifier !== this.props.identifier) {
        this.fetchDataFromEndpoint(nextProps);
      }
    }

    componentDidUpdate() {
      const tabContext = this.props.tabContext;

      // If component is not in a tab, then just fetch data straight away
      if (!tabContext) {
        this.fetchDataFromEndpoint();
      }

      // Only fetch data if the current tab is active
      if (tabContext.isOnActiveTab) {
        this.fetchDataFromEndpoint();
      }
    }

    fetchDataFromEndpoint(props = this.props) {
      const { method, url } = (props.data.readUsageEndpoint || {});
      if (!this.haveFetchedData || this.props.forceFetch) {
        // see client/src/state/usedOn/usedOnActions.js
        props.loadUsedOn(props.identifier, method, url);
      }
      this.haveFetchedData = true;
    }

    render() {
      return <UsedOnTable {...this.props} />;
    }
  }

  UsedOnDataProvider.propTypes = {
    identifier: PropTypes.string,
    loading: PropTypes.bool,
    data: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.shape({
        recordClass: PropTypes.string,
        recordId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        readUsageEndpoint: PropTypes.shape({
          url: PropTypes.string,
          method: PropTypes.string,
        }),
      }),
    ]),
    usedOn: PropTypes.array,
    forceFetch: PropTypes.bool,
  };

  const mapStateToProps = (state, props) => {
    const {
      recordClass,
      recordId,
    } = props.data;

    const identifier = (recordClass && recordId) ? `${recordClass}#${recordId}` : '';
    const usedState = state.usedOn;
    const loading = usedState.loading.includes(identifier);
    const usedOn = usedState.usedOn[identifier] || null;
    const error = usedState.errors[identifier] || null;

    return {
      identifier,
      loading,
      usedOn,
      error,
    };
  };

  const ComponentWithTabContext = injectTabContext(UsedOnDataProvider);
  const connectedUsedOnDataProvider = connect(
    mapStateToProps,
    { loadUsedOn }
  )(ComponentWithTabContext);
  connectedUsedOnDataProvider.Component = ComponentWithTabContext;

  return connectedUsedOnDataProvider;
};

export default provideUsedOnData;
