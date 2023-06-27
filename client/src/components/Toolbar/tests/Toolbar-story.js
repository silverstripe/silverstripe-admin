import React from 'react';
import Toolbar from 'components/Toolbar/Toolbar';

// Get around eslint 'Value must be omitted for boolean attributes'
export default {
  title: 'Admin/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'The main header for sections in the CMS.'
      },
      canvas: {
        sourceState: 'shown',
      },
      controls: {
        sort: 'alpha',
      },
    },
  },
  argTypes: {
    handleBackButtonClick: {
      description: 'Provides custom handling of back button clicks.',
      table: {
        type: { summary: 'function' },
      }
    },
    showBackButton: {
      description: 'If `true` a back button is displayed. This prop is `false` by default.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
      }
    },
  }
};

export const NoBackButton = args => <Toolbar {...args} />;
NoBackButton.args = {
  showBackButton: false,
};

export const BackButton = {
  args: {
    ...NoBackButton.args,
    showBackButton: true,
  }
};
