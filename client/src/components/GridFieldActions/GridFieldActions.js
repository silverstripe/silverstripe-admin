import React, { PureComponent } from 'react';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import GridFieldDropdownAction from './GridFieldDropdownAction';
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

  renderMultipleActions(schema) {
    const groupedActions = schema.reduce((groups, action) => {
      const groupsList = groups;
      const groupName = action.group ? action.group : 'Default';

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
        <DropdownMenu className="action-menu__dropdown" right>
          {Object.keys(groupedActions).map(
            (group, index) => [
              index !== 0 && <DropdownItem divider />,
              groupedActions[group].map((action) =>
                (<GridFieldDropdownAction
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
    const { type, title, data } = action;
    let { url } = action;
    let buttonType;
    if (type === 'submit') {
      buttonType = 'submit';
      url = undefined; // If url is defined reactstrap forces it to render as a link
    }
    let classNames = 'action';
    if (data && data.classNames) {
      classNames = `action ${data.classNames}`;
    }
    return (
      <Button
        className={classNames}
        type={buttonType}
        href={url}
        data-url={data['data-url']}
        name={data.name}
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

const actionShape = GridFieldDropdownAction.propTypes;
actionShape.group = React.PropTypes.string;

GridFieldActions.propTypes = React.PropTypes.arrayOf(
  React.PropTypes.shape(actionShape)
).isRequired;

export default GridFieldActions;
