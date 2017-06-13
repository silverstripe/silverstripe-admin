import React from 'react';
import { Component } from 'react';

class MobileMenuToggle extends Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();

    if (typeof this.props.onClick === 'function') {
      this.props.onClick(e);
    }
  }

  render() {
    const classes = ['cms-mobile-menu-toggle'];
    if (this.props.isOpen) {
      classes.push('cms-mobile-menu-toggle--open');
    }

    return (
      <button
        className={classes.join(' ')}
        href="#toggle-mobile-menu"
        onClick={this.handleClick}
        aria-controls={this.props.controls}
        aria-expanded={!!this.props.isOpen}
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </button>
    );
  }
}

MobileMenuToggle.propTypes = {
  isOpen: React.PropTypes.bool,
  onClick: React.PropTypes.func.isRequired,
  controls: React.PropTypes.string,
};

export default MobileMenuToggle;
