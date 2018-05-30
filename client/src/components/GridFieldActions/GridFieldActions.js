import React, { PureComponent } from 'react';
import { Button, DropdownItem } from 'reactstrap';
import GridFieldDropdownAction from './GridFieldDropdownAction';
import ActionMenu from '../ActionMenu/ActionMenu';
import classnames from 'classnames';

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
      const groupName = action.group;

      if (!groupName) { throw new Error(`Action: \"${action.title}\" has no group assigned`); }

      if (!groupsList[groupName]) {
        groupsList[groupName] = [];
      }

      groupsList[groupName].push(action);

      return groupsList;
    }, []);

    const dropdownMenuProps = { right: true };

    return (
      <ActionMenu dropdownMenuProps={dropdownMenuProps}>
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
      </ActionMenu>
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
    const classNames = classnames('action', data.classNames);
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
