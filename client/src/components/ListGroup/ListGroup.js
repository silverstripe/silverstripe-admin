import React from 'react';
import PropTypes from 'prop-types';
import ListGroupItem from './ListGroupItem';

const ListGroup = (props) => (
  <div className="list-group">
    {props.items.map((item) => <ListGroupItem {...item} />)}
  </div>
);

ListGroup.propTypes = {
  items: PropTypes.array,
};

export default ListGroup;
