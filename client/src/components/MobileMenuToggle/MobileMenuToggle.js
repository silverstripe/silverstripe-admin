import React from 'react';
import { Component } from 'react';

class MobileMenuToggle extends Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.open = false;
  }

  handleClick(e) {
    e.preventDefault();
    this.open = !this.open;
    this.forceUpdate();
  }

  render() {
    const classes = ['cms-mobile-menu-toggle'];
    if (this.open) {
      classes.push('cms-mobile-menu-toggle--open');
    }

    return (
      <a className={classes.join(' ')}
        href="#toggle-mobile-menu"
        onClick={this.handleClick}
      >
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </a>
    );
  }
}

export default MobileMenuToggle;

