import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ListGroupItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    if (this.props.onClick) {
      this.props.onClick(event, this.props.onClickArg);
    }
  }

  render() {
    const className = `list-group-item ${this.props.className}`;
    return (
      <a role="button" tabIndex={0} className={className} onClick={this.handleClick}>
        {this.props.children}
      </a>
    );
  }
}

ListGroupItem.propTypes = {
  onClickArg: PropTypes.any,
  onClick: PropTypes.func,
};

export default ListGroupItem;
