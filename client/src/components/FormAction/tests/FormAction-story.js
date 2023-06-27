import React from 'react';
import FormAction from 'components/FormAction/FormAction';

export default {
  title: 'Admin/FormAction',
  component: FormAction,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Used for form actions. For example a submit button. See the pattern library for examples.'
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
    handleClick: {
      description: 'The handler for when a button is clicked.',
      table: {
        type: { summary: 'function' },
      }
    },
    label: {
      description: 'The text to display on the button.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    id: {
      description: 'The html id attribute.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    type: {
      description: "Used for the button's `type` attribute. Defaults to `button`.",
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    bootstrapButtonStyle: {
      description: 'The style of button to be shown, adds a class `btn-{style}` to the button. Defaults to `secondary`.',
      control: 'select',
      options: [
        'primary',
        'outline-secondary',
        'secondary',
        'outline-secondary',
        'link',
        'danger'
      ],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },

    icon: {
      description: 'The icon to be used on the button, adds `font-icon-{icon}` class to the button. See available icons [here](../../../../fonts/incon-reference.html).',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    loading: {
      description: 'If true, replaces the text/icon with a loading icon.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: '' },
      }
    },
    disabled: {
      description: 'If true, gives the button a visually disabled state and disables click events.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: '' },
      }
    },
    readOnly: {
      description: 'If true, will also cause the button to be disabled.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: '' },
      }
    },
    extraClass: {
      description: 'Add extra custom classes.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    }
  }
};

export const _FormAction = (args) => <FormAction {...args} />;
_FormAction.args = {
  title: 'Primary',
  data: { buttonStyle: 'primary' },
};

export const States = () => (
  <div>
    <FormAction title="Primary" data={{ buttonStyle: 'primary' }} />
    <FormAction title="Secondary" data={{ buttonStyle: 'secondary' }} />
    <FormAction title="Danger" data={{ buttonStyle: 'danger' }} />
    <FormAction title="Warning" data={{ buttonStyle: 'warning' }} />
    <FormAction title="Info" data={{ buttonStyle: 'info' }} />
    <FormAction title="Link" data={{ buttonStyle: 'link' }} />
  </div>
);

export const Outline = () => (
  <div>
    <FormAction title="Primary" data={{ buttonStyle: 'outline-primary' }} />
    <FormAction
      title="Secondary"
      data={{ buttonStyle: 'outline-secondary' }}
    />
    <FormAction title="Danger" data={{ buttonStyle: 'outline-danger' }} />
    <FormAction title="Warning" data={{ buttonStyle: 'outline-warning' }} />
    <FormAction title="Info" data={{ buttonStyle: 'outline-info' }} />
  </div>
);

export const Icons = () => (
  <div>
    <FormAction
      title="Rocket"
      icon="rocket"
      data={{ buttonStyle: 'primary' }}
    />
    <FormAction
      title="Upload"
      icon="save"
      data={{ buttonStyle: 'secondary' }}
    />
  </div>
);

export const Loading = () => (
  <div>
    <FormAction title="Loading" loading data={{ buttonStyle: 'primary' }} />
    <FormAction
      title="Loading"
      loading
      data={{ buttonStyle: 'secondary' }}
    />
  </div>
);

export const Disabled = (args) => (
  <div>
    <p>
      <FormAction
        {...args}
        title="Primary"
        disabled
        data={{ buttonStyle: 'primary' }}
      />
      <FormAction
        {...args}
        title="Secondary"
        disabled
        data={{ buttonStyle: 'secondary' }}
      />
      <FormAction
        {...args}
        title="Danger"
        disabled
        data={{ buttonStyle: 'danger' }}
      />
      <FormAction
        {...args}
        title="Warning"
        disabled
        data={{ buttonStyle: 'warning' }}
      />
      <FormAction {...args} title="Info" disabled data={{ buttonStyle: 'info' }} />
      <FormAction {...args} title="Link" disabled data={{ buttonStyle: 'link' }} />
    </p>
    <p>
      <FormAction
        {...args}
        title="Primary"
        disabled
        data={{ buttonStyle: 'outline-primary' }}
      />
      <FormAction
        {...args}
        title="Secondary"
        disabled
        data={{ buttonStyle: 'outline-secondary' }}
      />
      <FormAction
        {...args}
        title="Danger"
        disabled
        data={{ buttonStyle: 'outline-danger' }}
      />
      <FormAction
        {...args}
        title="Warning"
        disabled
        data={{ buttonStyle: 'outline-warning' }}
      />
      <FormAction
        {...args}
        title="Info"
        disabled
        data={{ buttonStyle: 'outline-info' }}
      />
    </p>
  </div>
);
