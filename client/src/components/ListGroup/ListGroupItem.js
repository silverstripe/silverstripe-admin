import React, { Component } from 'react';

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
  onClickArg: React.PropTypes.any,
  handleClickArg: (props) => { if (props.handleClickArg) { throw new Error('handleClickArg: no longer used'); } },
  onClick: React.PropTypes.func,
  handleClick: (props) => { if (props.handleClick) { throw new Error('handleClick: no longer used'); } },
};

export default ListGroupItem;
