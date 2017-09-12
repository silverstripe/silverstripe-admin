import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';

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
    const classes = classnames({
      'cms-mobile-menu-toggle': true,
      'cms-mobile-menu-toggle--open': this.props.isOpen,
    });

    return (
      <button
        className={classes}
        href="#toggle-mobile-menu"
        onClick={this.handleClick}
        aria-controls={this.props.controls}
        aria-expanded={Boolean(this.props.isOpen)}
      >
        <span />
        <span />
        <span />
        <span />
      </button>
    );
  }
}

MobileMenuToggle.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  controls: PropTypes.string,
};

MobileMenuToggle.defaultProps = {
  controls: '',
};

export default MobileMenuToggle;
