import React, { Component } from 'react';

class ListGroupItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    if (this.props.handleClick) {
      this.props.handleClick(event, this.props.handleClickArg);
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
  handleClickArg: React.PropTypes.any,
  handleClick: React.PropTypes.func,
};

export default ListGroupItem;
