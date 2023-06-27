import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import i18n from 'i18n';
import classnames from 'classnames';

class ActionMenu extends PureComponent {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle(event) {
    const { toggleCallback } = this.props;
    if (toggleCallback) {
      toggleCallback(event);
    }

    // Force setting state to the end of the execution queue to clear a potential race condition
    // with entwine click handlers
    window.setTimeout(() => this.setState((prevState) => ({ isOpen: !prevState.isOpen })), 0);
  }

  render() {
    const {
      dropdownToggleProps,
      dropdownMenuProps,
      dropdownToggleClassNames,
      className,
      // remove props that we don't want to pass through to Dropdown
      toggleCallback, // eslint-disable-line no-unused-vars
      ...restProps
    } = this.props;

    const toggleClassName = classnames(
      dropdownToggleClassNames,
      dropdownToggleProps.className
    );
    const menuClassName = classnames('action-menu__dropdown', dropdownMenuProps.className);

    return (
      <Dropdown
        className={classnames('action-menu', className)}
        isOpen={this.state.isOpen}
        toggle={this.toggle}
        {...restProps}
      >
        <DropdownToggle className={toggleClassName} aria-label={i18n._t('Admin.ACTIONS', 'View actions')} {...dropdownToggleProps} />
        <DropdownMenu className={menuClassName} {...dropdownMenuProps}>
          {this.props.children}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

ActionMenu.propTypes = {
  toggleCallback: PropTypes.func,
  dropdownToggleClassNames: PropTypes.arrayOf(PropTypes.string),
};

ActionMenu.defaultProps = {
  className: '',
  dropdownToggleClassNames: [
    'action-menu__toggle',
    'btn',
    'btn--no-text',
    'btn--icon-xl',
    'font-icon-dot-3'
  ],
  dropdownToggleProps: {},
  dropdownMenuProps: {},
};

export default ActionMenu;
