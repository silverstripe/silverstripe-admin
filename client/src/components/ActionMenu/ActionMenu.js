import React, { PureComponent } from 'react';
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

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const { dropdownToggleProps, dropdownMenuProps, ...restProps } = this.props;
    let { className } = this.props;
    className = classnames('action-menu', className);

    const toggleClassName = classnames(
      'action-menu__toggle',
      'btn',
      'btn--icon-xl',
      'btn--no-text',
      'font-icon-dot-3',
      dropdownToggleProps.className
    );
    const menuClassName = classnames('action-menu__dropdown', dropdownMenuProps.className);

    return (
      <Dropdown
        className={className}
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


ActionMenu.defaultProps = {
  className: '',
  dropdownToggleProps: {},
  dropdownMenuProps: {},
};

export default ActionMenu;
