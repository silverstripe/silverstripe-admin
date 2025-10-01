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
    //
    // ignore linting rule because following the recommended replacement caused behat failures
    // eslint-disable-next-line react/no-access-state-in-setstate
    window.setTimeout(() => this.setState({ isOpen: !this.state.isOpen }), 0);
  }

  render() {
    const {
      dropdownToggleProps,
      dropdownMenuProps,
      dropdownToggleClassNames,
      dropdownToggleChildren,
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
    const toggleText = i18n._t('Admin.ACTIONS', 'View actions');

    return (
      <Dropdown
        className={classnames('action-menu', className)}
        isOpen={this.state.isOpen}
        toggle={this.toggle}
        {...restProps}
      >
        <DropdownToggle className={toggleClassName} title={toggleText} aria-label={toggleText} {...dropdownToggleProps} >
          {dropdownToggleChildren}
        </DropdownToggle>
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
  dropdownToggleChildren: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
};

ActionMenu.defaultProps = {
  className: '',
  dropdownToggleClassNames: [
    'action-menu__toggle',
    'btn',
    'btn--no-text',
    'btn--icon-xl',
  ],
  dropdownToggleProps: {},
  dropdownToggleChildren: <span className="font-icon-dot-3" aria-hidden="true" />,
  dropdownMenuProps: {},
};

export default ActionMenu;
