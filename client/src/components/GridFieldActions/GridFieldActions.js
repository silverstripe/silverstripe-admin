import React, { PureComponent } from 'react';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import DropdownAction from './DropdownAction';
// import i18n from 'i18n';

class GridFieldActions extends PureComponent {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  // doAction(e) {
  //   $('.grid-field .action:button').entwine('ss').onclick(e);
  // }

  renderMultipleActions(schema) {
    const groupedActions = schema.reduce((groups, action) => {
      const groupsList = groups;
      const groupName = action.group;

      if (!groupsList[groupName]) {
        groupsList[groupName] = [];
      }
      groupsList[groupName].push(action);
      return groupsList;
    }, []);

    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle className="action-menu__toggle">
          Actions
        </DropdownToggle>
        <DropdownMenu right>
          {Object.keys(groupedActions).map(
            (group, index) => [
              index !== 0 && <DropdownItem divider />,
              groupedActions[group].map((action) =>
                (<DropdownAction
                  data={action.data}
                  title={action.title}
                  type={action.type}
                  url={action.url}
                />)
              )
            ]
          )}
        </DropdownMenu>
      </Dropdown>
    );
  }

  renderSingleAction(action) {
    const { type, url, title } = action;
    const buttonType = type === 'Submit' ? 'submit' : undefined;
    return (
      <Button
        type={buttonType}
        href={url}
        color="secondary"
      >
        {title}
      </Button>
    );
  }

  render() {
    const { schema } = this.props;
    if (schema.length > 1) {
      return this.renderMultipleActions(schema);
    } else if (schema.length === 1) {
      return this.renderSingleAction(schema[0]);
    }
    return null;
  }
}

export default GridFieldActions;
