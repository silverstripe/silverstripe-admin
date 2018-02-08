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
      } = props.data.readUsageEndpoint;

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
        readUsageEndpoint: PropTypes.shape({
          url: PropTypes.string,
          method: PropTypes.string,
        }),
      }),
    ]),
    usedOn: PropTypes.array,
  };

  const mapStateToProps = (state, props) => {
    const identifier = `${props.data.recordClass}#${props.data.recordId}`;
    const loading = state.usedOn.loading.includes(identifier);
    const usedOn = state.usedOn.usedOn[identifier] || null;

    return {
      identifier,
      loading,
      usedOn,
    };
  };

  return connect(mapStateToProps, { loadUsedOn })(UsedOnDataProvider);
};

export default provideUsedOnData;
