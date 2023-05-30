import React from 'react';
import actionListMaker from '../../../stories/actionListMaker';
import { jsxDecorator } from 'storybook-addon-jsx';

import NumberField from 'components/NumberField/NumberField';

const tagActions = actionListMaker('onClick', 'onChange');

export default {
    title: 'Admin/NumberField',
    component: NumberField,
    decorators: [
        jsxDecorator,
        (Story) => <div><Story/></div>
    ],
    argTypes: {
        title: {
            control: 'text'
        },
        value: {
            control: 'number'
        },
        placeholder: {
            control: 'text'
        },
        description: {
            control: 'text'
        },
        disabled: {
            control: 'boolean'
        },
        message: {
            type: {
                control: 'select',
                options: ['', 'error']
              },
            value: {
                control: 'text'
              }
        }
    }
};

export const _NumberField = {
    args: {
        title: 'My Number Field',
        value: '42',
        placeholder: 'What is the answer to life, the universe, and everything?',
        description: 'You can add descriptions here',
        disabled: false,
        message: {
            type: 'error',
            value: ''
        },
        ...tagActions
    }
};
