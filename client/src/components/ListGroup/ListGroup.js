import React from 'react';
import ListGroupItem from './ListGroupItem';

const ListGroup = (props) => (
  <div className="list-group">
    {props.items.map((item) => <ListGroupItem {...item} />)}
  </div>
);

ListGroup.propTypes = {
  items: React.PropTypes.array,
};

export default ListGroup;
