import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadUsedOn } from 'state/usedOn/usedOnActions';

const provideUsedOnData = (UsedOnTable) => {
  class UsedOnDataProvider extends Component {
    componentDidMount() {
      this.loadUsedOn();
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.identifier !== this.props.identifier) {
        this.loadUsedOn(nextProps);
      }
    }

    loadUsedOn(props = this.props) {
      const {
        method,
        url,
      } = (props.data.readUsageEndpoint || {});

      props.loadUsedOn(props.identifier, method, url);
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

  const connectedUsedOnDataProvider = connect(mapStateToProps, { loadUsedOn })(UsedOnDataProvider);
  connectedUsedOnDataProvider.Component = UsedOnDataProvider;

  return connectedUsedOnDataProvider;
};

export default provideUsedOnData;
