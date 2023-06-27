import React, { Component } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';

const triggerAction = action('change');
class ValueTracker extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    let value = props.value;
    // fallback to using a value the child was given
    if (value === null) {
      React.Children.forEach(this.props.children, (child) => {
        if (value === null || typeof value === 'undefined') {
          value = child.props.value;
        }
      });
    }
    this.state = {
      value,
    };
  }

  handleChange(event, { value } = {}) {
    const state = (typeof value === 'undefined')
      ? event
      : value;

    // eslint-disable-next-line no-console
    if (typeof value === 'undefined' && console.warn) {
      // eslint-disable-next-line no-console
      console.warn(`Only value was given, good idea to give event and id as well: "${this.props.name}"`);
    }

    if (typeof state !== 'object') {
      triggerAction(state);
    } else {
      triggerAction(JSON.stringify(state));
    }
    this.setState({
      value: state,
    });
  }

  render() {
    const children = React.Children.map(this.props.children, (child) => (
      React.cloneElement(child, {
        value: this.state.value,
        onChange: (...args) => {
          if (child.props.onChange) {
            child.props.onChange(...args);
          }
          this.handleChange(...args);
        },
      })
    ));
    return <div>{children}</div>;
  }
}

ValueTracker.propTypes = {
  children: PropTypes.any,
  value: PropTypes.any,
};

ValueTracker.defaultProps = {
  value: null,
};

export default ValueTracker;
