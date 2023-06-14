import React from 'react';
import ActionMenu from 'components/ActionMenu/ActionMenu';
import { DropdownItem } from 'reactstrap';

export default {
  title: 'Admin/ActionMenu',
  component: ActionMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'ActionMenu Component description.'
      },
      canvas: {
        sourceState: 'shown',
      },
      controls: {
        sort: 'alpha',
      }
    }
  },
  argTypes: {}
};

export const Single = () => (
  <ActionMenu>
    <DropdownItem>Item One</DropdownItem>
    <DropdownItem>Item Two</DropdownItem>
    <DropdownItem>Item Three</DropdownItem>
  </ActionMenu>
);
