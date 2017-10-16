import React, { PropTypes, Component } from 'react';

class Toolbar extends Component {
  constructor(props) {
    super(props);

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  /**
   * Event handler for the back button.
   *
   * @param {Object} event
   */
  handleBackButtonClick(event) {
    if (typeof this.props.onBackButtonClick !== 'undefined') {
      this.props.onBackButtonClick(event);
      return;
    }

    event.preventDefault();
  }

  render() {
    const buttonClassNames = [
      'btn',
      'btn-secondary',
      'action',
      'font-icon-left-open-big',
      'toolbar__back-button',
      'btn--no-text',
    ];
    const backButtonProps = {
      className: buttonClassNames.join(' '),
      onClick: this.handleBackButtonClick,
      href: '#',
      type: 'button',
    };

    return (
      <div className="toolbar toolbar--north">
        <div className="toolbar__navigation fill-width">
          {this.props.showBackButton &&
          <button {...backButtonProps} />
          }
          {this.props.children}
        </div>
      </div>
    );
  }
}

Toolbar.propTypes = {
  onBackButtonClick: PropTypes.func,
  showBackButton: PropTypes.bool,
  breadcrumbs: PropTypes.array,
};

Toolbar.defaultProps = {
  showBackButton: false,
};

export default Toolbar;
