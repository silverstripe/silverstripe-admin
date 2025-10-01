import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
        className="grid-field__icon-action btn--icon-lg"
        onClick={this.handleClick}
      >
        <span className={`font-icon-${this.props.icon}`} aria-hidden="true" />
      </button>
    );
  }
}

GridFieldAction.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default GridFieldAction;
