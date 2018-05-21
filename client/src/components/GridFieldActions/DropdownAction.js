import React, { PureComponent } from 'react';
import { DropdownItem } from 'reactstrap';

class DropdownAction extends PureComponent {
  render() {
    const { type, title, data } = this.props;
    let { url } = this.props;
    let classNames = 'action';
    if (data.classNames) {
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
      data-url={data['data-url']}
      href={url}
      id={data.id}
      name={data.name}
      tag={elementType}
    >
      {title}
    </DropdownItem>
  );
  }
}


DropdownAction.propTypes = {
  data: React.PropTypes.object,
  title: React.PropTypes.string,
  type: React.PropTypes.string,
  url: React.PropTypes.string,
};

export default DropdownAction;
