import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import ListGroupItem from 'components/ListGroup/ListGroupItem';

storiesOf('Admin/ListGroupItem', module)
  .add('Items', () => (
    <div>
      <ListGroupItem>Item one</ListGroupItem>
      <ListGroupItem className="active">Item two (active)</ListGroupItem>
      <ListGroupItem>Item three</ListGroupItem>
    </div>
  ));
