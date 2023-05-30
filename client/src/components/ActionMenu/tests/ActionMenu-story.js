import React from 'react';
import ActionMenu from 'components/ActionMenu/ActionMenu';
import { DropdownItem } from 'reactstrap';

export default {
    title: 'Admin/ActionMenu',
};

export const Single = () => (
    <ActionMenu>
        <DropdownItem>Item One</DropdownItem>
        <DropdownItem>Item Two</DropdownItem>
        <DropdownItem>Item Three</DropdownItem>
    </ActionMenu>
);
