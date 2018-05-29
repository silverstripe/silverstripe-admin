import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import ActionMenu from 'components/ActionMenu/ActionMenu';
import { DropdownItem } from 'reactstrap';

storiesOf('Admin/ActionMenu', module)
  .add('Single', () => (
    <ActionMenu>
      <DropdownItem>
        Item One
      </DropdownItem>
      <DropdownItem>
        Item Two
      </DropdownItem>
      <DropdownItem>
        Item Three
      </DropdownItem>
    </ActionMenu>
  ));
