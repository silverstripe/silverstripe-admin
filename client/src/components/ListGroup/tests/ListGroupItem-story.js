import React from 'react';
import ListGroupItem from 'components/ListGroup/ListGroupItem';

export default {
  title: 'Admin/ListGroupItem',
  component: ListGroupItem,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'ListGroupItem Component Description.'
      },
      canvas: {
        sourceState: 'shown',
      },
      controls: {
        sort: 'alpha',
      }
    }
  },
};

export const Items = (args) => (
  <div>
    <ListGroupItem>Item one</ListGroupItem>
    <ListGroupItem {...args}>Item two (active)</ListGroupItem>
    <ListGroupItem>Item three</ListGroupItem>
  </div>
);
Items.args = {
  className: 'active'
};
