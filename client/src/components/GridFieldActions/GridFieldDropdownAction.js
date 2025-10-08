import React, { PureComponent } from 'react';
import { DropdownItem } from 'reactstrap';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class GridFieldDropdownAction extends PureComponent {
  render() {
    const { type, title, data } = this.props;
    let { url } = this.props;

    const classNames = classnames('action', data.classNames);
    let elementType = null;

    switch (type) {
      case 'submit':
      case 'button':
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
        type={elementType === 'button' ? 'button' : undefined}
        data-url={data['data-url']}
        data-action-state={data['data-action-state']}
        name={data.name}
      >
        {data.icon && <span className={`font-icon-${data.icon}`} aria-hidden="true" />}
        {title}
      </DropdownItem>
    );
  }
}

GridFieldDropdownAction.propTypes = {
  data: PropTypes.object,
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['submit', 'link']),
  url: PropTypes.string,
};

export default GridFieldDropdownAction;
