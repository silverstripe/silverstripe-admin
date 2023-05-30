import React from 'react';
import { jsxDecorator } from 'storybook-addon-jsx';
import { action } from '@storybook/addon-actions';

import { Component as Breadcrumb } from 'components/Breadcrumb/Breadcrumb';


// Simple values to displays in the select fields.
const icons = [
    '',
    'font-icon-edit-list',
    'font-icon-calendar',
    'font-icon-p-home',
    'font-icon-cart',
];
const levels = [
    'First',
    'Second',
    'Third',
    'Fourth',
    'Fifth',
    'Sixth',
    'Seventh',
    'Eighth',
];

// Build an action to handle the click on the crumbs
const crumbAction = (event) => {
    event.preventDefault();
    return action('onClick')(event);
};
crumbAction.toString = () => 'onClick';

/**
 * This method can be used to build an array of breadcrumbs
 * @param {int} position 0-based index of the level
 * @param {string} rank Textual representation of the rank level
 * @param {string} icon class to applu to the icon
 * @returns {Object[]}
 */
const buildBreadCrumb = (position, rank, icon) => {
    const level = levels[position];
    let crumb = [
        {
            text: `${level} level`,
            href: '#',
            onClick: crumbAction,
        },
    ];

    if (level === rank) {
        crumb[0].icon = { className: icon };
    } else {
        crumb = crumb.concat(buildBreadCrumb(position + 1, rank, icon));
    }

    return crumb;
};

export default {
    title: 'Admin/Breadcrumb',
    component: Breadcrumb,
    decorators: [
        jsxDecorator
    ],
    argTypes: {
      levels: {
        control: 'select',
        options: levels
      },
      icons: {
        control: 'select',
        options: icons
      },
    },
    args: {
        levels: 'First',
        icons: ''
    }
};

export const _Breadcrumb = (args) => {
    // eslint-disable-next-line no-shadow
    const { levels, icons } = args;
    return (<Breadcrumb crumbs={buildBreadCrumb(0, levels, icons)}/>);
};

