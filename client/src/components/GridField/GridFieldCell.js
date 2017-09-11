import React, { Component } from 'react';

class GridFieldCell extends Component {
  constructor(props) {
    super(props);

    this.handleDrillDown = this.handleDrillDown.bind(this);
  }

  handleDrillDown(event) {
    if (typeof this.props.handleDrillDown === 'undefined') {
      return;
    }

    this.props.handleDrillDown(event);
  }

  render() {
    const classNames = ['grid-field__cell'];

    if (typeof this.props.className !== 'undefined') {
      classNames.push(this.props.className);
    }

    const props = {
      className: classNames.join(' '),
      onClick: this.handleDrillDown,
    };

    return (
      <td {...props}>{this.props.children}</td>
    );
  }
}

GridFieldCell.PropTypes = {
  className: React.PropTypes.string,
  width: React.PropTypes.number,
  handleDrillDown: React.PropTypes.func,
};

export default GridFieldCell;
