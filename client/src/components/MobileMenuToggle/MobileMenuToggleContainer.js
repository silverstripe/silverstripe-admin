import React from 'react';
import { Component } from 'react';
import * as mobileMenuActions from 'state/mobileMenu/MobileMenuActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MobileMenuToggle from './MobileMenuToggle';

/**
 * Container for `MobileMenuToggle`
 */

class MobileMenuToggleContainer extends Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.actions.schema.toggleMobileMenu();
  }

  render() {
    return (
      <MobileMenuToggle
        isOpen={this.props.isOpen}
        onClick={this.handleClick}
        controls={this.props.controls}
      />);
  }
}

MobileMenuToggleContainer.propTypes = {
  isOpen: React.PropTypes.bool,
  actions: React.PropTypes.object,
  controls: React.PropTypes.string,
};

MobileMenuToggleContainer.defaultProps = {
  isOpen: false,
};

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
