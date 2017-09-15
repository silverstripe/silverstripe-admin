import React, { Component, PropTypes } from 'react';
import { action } from '@storybook/addon-actions';

const triggerAction = action('change');
export default class ValueTracker extends Component {
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
    const children = React.Children.map(this.props.story(), (child) => (
      React.cloneElement(child, {
        value: this.state.value === null ? child.props.value : this.state.value,
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
  story: PropTypes.func.isRequired,
  value: PropTypes.any,
};

ValueTracker.defaultProps = {
  value: null,
};
