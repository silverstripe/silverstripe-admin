import React from 'react';
import ListGroupItem from 'components/ListGroup/ListGroupItem';

export default {
    title: 'Admin/ListGroupItem',
};

export const Items = () => (
    <div>
        <ListGroupItem>Item one</ListGroupItem>
        <ListGroupItem className="active">Item two (active)</ListGroupItem>
        <ListGroupItem>Item three</ListGroupItem>
    </div>
);
