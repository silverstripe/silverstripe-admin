import React, { PureComponent, PropTypes } from 'react';
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
    if (this.props.toggleCallback) {
      this.props.toggleCallback(event);
    }

    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const {
      dropdownToggleProps,
      dropdownMenuProps,
      dropdownToggleClassName,
      className,
      ...restProps
    } = this.props;

    const toggleClassName = classnames(
      dropdownToggleClassName,
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

ActionMenu.PropTypes = {
  toggleCallback: PropTypes.func,
  dropdownToggleClassName: PropTypes.arrayOf(PropTypes.string),
};

ActionMenu.defaultProps = {
  className: '',
  dropdownToggleClassName: [
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
