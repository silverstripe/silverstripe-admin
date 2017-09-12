import React, { Component } from 'react';

class GridFieldAction extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.onClick(event, this.props.record.ID);
  }

  render() {
    return (
      <button
        className={`grid-field__icon-action font-icon-${this.props.icon} btn--icon-large`}
        onClick={this.handleClick}
      />
    );
  }
}

GridFieldAction.PropTypes = {
  handleClick: (props) => { if (props.handleClick) { throw new Error('handleClick: no longer used'); } },
  Click: React.PropTypes.func.isRequired,
};

export default GridFieldAction;
