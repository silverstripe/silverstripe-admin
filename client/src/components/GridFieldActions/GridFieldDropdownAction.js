import React, { PureComponent } from 'react';
import { DropdownItem } from 'reactstrap';

class GridFieldDropdownAction extends PureComponent {
  render() {
    const { type, title, data } = this.props;
    let { url } = this.props;
    let classNames = 'action';
    if (data && data.classNames) {
      classNames = `action ${data.classNames}`;
    }
    let elementType = null;
    switch (type) {
      case 'submit':
        elementType = 'button';
        url = undefined;
        break;
      case 'link':
        elementType = 'a';
        break;
      default:
        elementType = undefined;
        break;
    }
  return (
    <DropdownItem
      className={classNames}
      href={url}
      tag={elementType}
      type={elementType === 'button' ? 'submit' : undefined}
      data-url={data['data-url']}
      name={data.name}
    >
      {title}
    </DropdownItem>
  );
  }
}

GridFieldDropdownAction.propTypes = {
  data: React.PropTypes.object,
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.oneOf(['submit', 'link']),
  url: React.PropTypes.string,
};

export default GridFieldDropdownAction;
