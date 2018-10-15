import React from 'react';
import ListGroupItem from './ListGroupItem';
import PropTypes from 'prop-types';

const ListGroup = (props) => (
  <div className="list-group">
    {props.items.map((item) => <ListGroupItem {...item} />)}
  </div>
);

ListGroup.propTypes = {
  items: PropTypes.array,
};

export default ListGroup;
