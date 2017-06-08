import React from 'react';
import { Component } from 'react';
import * as mobileMenuActions from 'state/mobileMenu/MobileMenuActions';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { provideInjector } from 'lib/Injector';

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
      <button className={classes.join(' ')}
        href="#toggle-mobile-menu"
        onClick={this.handleClick}
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
};

export default MobileMenuToggle;
