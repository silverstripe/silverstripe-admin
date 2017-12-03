import React, { Component, PropTypes } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';

const triggerAction = action('change');
class ValueTracker extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: props.value,
    };
  }

  handleChange(event, { value }) {
    triggerAction(value);
    this.setState({
      value,
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
  value: '',
};

export default ValueTracker;
