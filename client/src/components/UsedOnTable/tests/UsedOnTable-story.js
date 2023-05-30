import React from 'react';
import { Component as UsedOnTable } from 'components/UsedOnTable/UsedOnTable';

export default {
    title: 'Admin/UsedOnTable',
};

export const LoadingState = () => <UsedOnTable loading />;

LoadingState.story = {
    name: 'Loading state',
};

export const NoOwners = () => <UsedOnTable usedOn={[]} />;

NoOwners.story = {
    name: 'No owners',
};

export const WithOwners = () => (
    <UsedOnTable
      usedOn={[
        {
            id: 'a',
            title: 'Entry A item',
            type: 'Home Page',
            state: null,
            link: 'http://www.google.co.nz',
        },
        {
            id: 'b',
            title: 'Entry B parent',
            type: 'Group',
            state: 'draft',
            link: null,
        },
        {
            id: 'c',
            title: 'Entry C child',
            type: 'Gallery',
            state: 'modified',
            link: 'http://www.google.co.nz',
        },
        {
            id: 'd',
            title: 'Vrooooommmm',
            type: 'Car',
            state: 'draft',
            link: 'http://www.google.co.nz',
        },
    ]}
    />
);

WithOwners.story = {
    name: 'With owners',
};
