import React from 'react';
import { Component } from 'react';
import * as mobileMenuActions from 'state/mobileMenu/MobileMenuActions';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { provideInjector } from 'lib/Injector';
import MobileMenuToggle from './MobileMenuToggle';

/**
 * Container for `MobileMenuToggle`
 */

class MobileMenuToggleContainer extends Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return <MobileMenuToggle isOpen={this.props.isOpen} onClick={this.handleClick} />;
  }

  handleClick(e) {
    e.preventDefault();
    this.props.actions.schema.toggleMobileMenu();
  }
}

function mapStateToProps(state) {
  return {
    isOpen: state.mobileMenu.isOpen,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      schema: bindActionCreators(mobileMenuActions, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileMenuToggleContainer);
