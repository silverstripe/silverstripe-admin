import React, { Component } from 'react';
import classnames from 'classnames';

class GridFieldCell extends Component {
  constructor(props) {
    super(props);

    this.handleDrillDown = this.handleDrillDown.bind(this);
  }

  handleDrillDown(event) {
    if (typeof this.props.onDrillDown === 'function') {
      this.props.onDrillDown(event);
    }
  }

  render() {
    const classNames = ['grid-field__cell', this.props.className];

    const {
      onDrillDown,
      ...props
    } = this.props;

    return (
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      <td
        {...props}
        className={classnames(classNames)}
        onClick={this.handleDrillDown}
      />
    );
  }
}

GridFieldCell.PropTypes = {
  className: React.PropTypes.string,
  onDrillDown: React.PropTypes.func,
};

export default GridFieldCell;
