import React from 'react';
import { action } from '@storybook/addon-actions';
import ValueTracker from 'stories/ValueTracker';
import { Component as PopoverOptionSetToggle } from '../PopoverOptionSetToggle';
import { jsxDecorator } from 'storybook-addon-jsx';

const buttons = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => ({
    content: `Button ${letter}`,
    key: letter,
    onClick: (event) => action(`'Button ${letter}' Clicked`)(event),
}));

const icons = [
    'block-back',
    'block-banner',
    'block-carousel',
    'block-content',
    'block-file',
    'block-file-list',
    'block-form',
    'block-layout',
    'block-media',
];

const iconButtons = buttons.map((button) => ({
    ...button,
    className: `font-icon-${
        icons[Math.floor(Math.random() * icons.length)]
    }`,
}));

const customButtons = [
    {
        content: <span>Links? <a href="//example.com">Link</a></span>,
        key: 'link',
    },
    {
        content: <span style={{ color: 'red' }}>Red Text</span>,
        key: 'style',
    },
];

const handleSearch = (term, set) => set.filter(
    ({ content }) => content.toLowerCase() === `button ${term.toLowerCase()}`
);


export default {
    title: 'Admin/PopoverOptionSet',
    component: PopoverOptionSetToggle,
    decorators: [
        jsxDecorator,
        (Story) => <ValueTracker><Story/></ValueTracker>
    ],
    argTypes: {
        buttons: {
            control: 'object',
            options: { ...buttons }
        },
        id: {
            control: 'text'
        },
        disableSearch: {
            control: 'boolean'
        }
    }
};

export const SimpleExample = {
    args: {
        buttons,
        id: 'Sample',
        disableSearch: true,
    }
};

export const WithIcons = (args) => (
    <PopoverOptionSetToggle {...args} />
);
WithIcons.args = {
    ...SimpleExample.args,
    buttons: iconButtons
};

export const ComplexContent = (args) => (
    <>
        <div>
            Note that supplying JSX as content will mean that search will have to be disabled or you must implement a custom search function
        </div>
        <PopoverOptionSetToggle {...args} />
    </>
);
ComplexContent.args = {
    ...SimpleExample.args,
    buttons: customButtons
};

export const CustomSearch = (args) => (
    <>
        <div>
            This custom search function will ignore the Button prefix on each button
        </div>
        <PopoverOptionSetToggle {...args} />
    </>
);
CustomSearch.args = {
    ...SimpleExample.args,
    buttons,
    onSearch: handleSearch,
    searchPlaceholder: 'Custom search placeholder'
};
