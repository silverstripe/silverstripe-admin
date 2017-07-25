import React from 'react';
import SilverStripeComponent from 'lib/SilverStripeComponent';
import castStringToElement from 'lib/castStringToElement';
import classnames from 'classnames';

class FormAction extends SilverStripeComponent {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    let title = this.props.title;

    if (this.getSavedTitle() && !this.props.changed) {
      title = this.getSavedTitle();
    }
    return (
      <button {...this.getButtonProps()}>
        {this.getLoadingIcon()}
        {castStringToElement('span', title)}
      </button>
    );
  }

  /**
   * Get props for the button
   *
   * @returns {Object}
   */
  getButtonProps() {
    // Merge attributes
    return Object.assign({},
      typeof this.props.attributes === 'undefined' ? {} : this.props.attributes,
      {
        id: this.props.id,
        name: this.props.name,
        className: this.getButtonClasses(),
        disabled: this.props.disabled,
        onClick: this.handleClick,
      }
    );
  }

  /**
   * Returns the necessary button classes based on the given props
   *
   * @returns string
   */
  getButtonClasses() {
    const buttonClasses = {
      btn: true,
      'btn--no-text': (typeof this.props.title !== 'string'),
      'btn--loading': this.props.loading,
      disabled: this.props.disabled,
    };
    // Add 'type' class
    const style = this.getButtonStyle();

    if (style) {
      buttonClasses[`btn-${style}`] = true;
    }

    const savedClasses = this.getSavedClasses();
    if (savedClasses && this.props.changed) {
      savedClasses.split(' ').forEach((cl) => {
        buttonClasses[`btn-${cl}`] = true;
      });
    }

    // Add icon class
    const icon = this.getIcon();
    const savedIcon = this.getSavedIcon();
    if (this.isConstructive() && !this.props.changed && savedIcon) {
      buttonClasses[`font-icon-${savedIcon}`] = true;
    } else if (icon) {
      buttonClasses[`font-icon-${icon}`] = true;
    }

    if (typeof this.props.extraClass === 'string') {
      buttonClasses[this.props.extraClass] = true;
    }

    return classnames(buttonClasses);
  }

  /**
   * @return {boolean}
   */
  isConstructive() {
    const extraClasses = this.props.extraClass.split(' ');
    return (
      this.props.name === 'action_save' ||
      extraClasses.find(className => className === 'ss-ui-action-constructive')
    );
  }

  /**
   * Gets the bootstrap classname for this action
   *
   * @return {String}
   */
  getButtonStyle() {
    // Add 'type' class
    if (typeof this.props.data.buttonStyle !== 'undefined') {
      return this.props.data.buttonStyle;
    }

    if (typeof this.props.buttonStyle !== 'undefined') {
      return this.props.buttonStyle;
    }

    const extraClasses = this.props.extraClass.split(' ');

    // defined their own `btn-${something}` class
    if (extraClasses.find((className) => className.indexOf('btn-') > -1)) {
      return null;
    }

    if (this.isConstructive()) {
      return 'primary';
    }

    return 'secondary';
  }

  /**
   * Get icon name
   *
   * @returns {String}
   */
  getIcon() {
    // In case this is specified directly
    return this.props.icon || this.props.data.icon || null;
  }

  /**
   * Get saved title
   *
   * @return {String}|null
   */
  getSavedTitle() {
    // In case this is specified directly
    return this.props.savedTitle || this.props.data.savedTitle || null;
  }

  getSavedIcon() {
    // In case this is specified directly
    return this.props.savedIcon || this.props.data.savedIcon || null;
  }

  getSavedClasses() {
    // In case this is specified directly
    return this.props.savedClasses || this.props.data.savedClasses || null;
  }

  /**
   * Returns markup for the loading icon
   *
   * @returns object|null
   */
  getLoadingIcon() {
    if (this.props.loading) {
      return (
        <div className="btn__loading-icon" >
          <span className="btn__circle btn__circle--1" />
          <span className="btn__circle btn__circle--2" />
          <span className="btn__circle btn__circle--3" />
        </div>
      );
    }

    return null;
  }

  /**
   * Event handler triggered when a user clicks the button.
   *
   * @param {Object} event
   * @return undefined
   */
  handleClick(event) {
    if (typeof this.props.handleClick === 'function') {
      this.props.handleClick(event, this.props.name || this.props.id);
    }
  }
}

FormAction.propTypes = {
  id: React.PropTypes.string,
  name: React.PropTypes.string,
  handleClick: React.PropTypes.func,
  title: React.PropTypes.string,
  // Action text when there's no changes detected in the form
  savedTitle: React.PropTypes.string,
  savedIcon: React.PropTypes.string,
  savedClasses: React.PropTypes.string,
  type: React.PropTypes.string,
  loading: React.PropTypes.bool,
  icon: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  changed: React.PropTypes.bool,
  data: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.shape({
      buttonStyle: React.PropTypes.string,
    }),
  ]),
  extraClass: React.PropTypes.string,
  attributes: React.PropTypes.object,
};

FormAction.defaultProps = {
  title: '',
  savedTitle: null,
  icon: '',
  extraClass: '',
  attributes: {},
  data: {},
  disabled: false,
  changed: false,
};

export default FormAction;
