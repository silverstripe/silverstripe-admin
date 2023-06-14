import React from 'react';
import HtmlReadonlyField from 'components/HtmlReadonlyField/HtmlReadonlyField';

const htmlValue = `<div>Some <strong>HTML</strong>
  <span style='font-style: italic'>Content</span><br />
  That renders as HTML, not as an escaped string
</div>`;

export default {
  title: 'Admin/HtmlReadonlyField',
  component: HtmlReadonlyField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Generates a block of raw HTML content inside a Readonly styled box.
        _NOTE:_ For other properties, please refer to the [reactstrap Input](https://reactstrap.github.io/components/form/) documentation.`
      },
      canvas: {
        sourceState: 'shown',
      },
      controls: {
        sort: 'alpha',
      }
    }
  },
  argTypes: {
    id: {
      description: 'The ID for the component.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    extraClass: {
      description: 'Extra classes the component should have.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    name: {
      description: 'The name for the component.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    value: {
      description: 'The raw HTML content to generate.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    }
  }
};

const Template = args => <HtmlReadonlyField {...args} />;

export const _HtmlReadonlyField = Template.bind({});
_HtmlReadonlyField.args = {
  name: 'default',
  value: 'This is readonly'
};

export const HtmlValue = Template.bind({});
HtmlValue.args = {
  name: 'default',
  value: htmlValue
};
