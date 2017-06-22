import React from 'react';
import { Component } from 'react';
import classNames from 'classnames';

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
    const classes = classNames({
      'cms-mobile-menu-toggle': true,
      'cms-mobile-menu-toggle--open': this.props.isOpen,
    });

    return (
      <button
        className={classes}
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
  isOpen: React.PropTypes.bool.isRequired,
  onClick: React.PropTypes.func.isRequired,
  controls: React.PropTypes.string,
};

MobileMenuToggle.defaultProps = {
  isOpen: false,
  controls: '',
};

export default MobileMenuToggle;
