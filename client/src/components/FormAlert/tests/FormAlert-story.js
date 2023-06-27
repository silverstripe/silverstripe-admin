import React from 'react';
import FormAlert from 'components/FormAlert/FormAlert';

export default {
  title: 'Admin/FormAlert',
  component: FormAlert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Generates a bootstrap alert box, with state closing handled optionally.
        _NOTE:_ For other properties, please refer to the [reactstrap Alert](https://reactstrap.github.io/components/alerts/) documentation.`
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
    extraClass: {
      description: 'Extra classes the component should have.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    value: {
      description: 'The content to show.',
      control: 'text',
      table: {
        type: { summary: 'any' },
        defaultValue: { summary: '' },
      }
    },
    type: {
      description: ' The kind of alert box to show, defines appearance, accepts the following: `success`, `warning`, `danger`, `info`',
      control: 'select',
      options: [
        'success',
        'warning',
        'danger',
        'info'
      ],
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'info' },
      }
    },
    onClosed: {
      description: 'For manual handling of showing and hiding the message, used in conjunction with `visible`.',
      table: {
        type: { summary: 'function' },
      }
    },
    visible: {
      description: 'Manual set whether the message is hidden or shown.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: false },
      }
    },
    closeLabel: {
      description: 'The label for the screen reader close button. Providing a value for this will make the alert "dismissible."',
      control: 'string',
      table: {
        type: { summary: 'string' },
      }
    }
  }
};

export const _FormAlert = (args) => <FormAlert {...args} />;
_FormAlert.args = {
  type: 'success',
  value: "This is a 'success'/'good' alert"
};

export const Types = () => (
  <div>
    <FormAlert type="success" value="This is a 'success'/'good' alert" />
    <FormAlert type="info" value="This is a 'info' alert" />
    <FormAlert type="warning" value="This is a 'warning' alert" />
    <FormAlert type="danger" value="This is a 'danger' alert" />
  </div>
);

export const Dismissable = () => (
  <div>
    <FormAlert
      type="success"
      value="This is an alert that can be dismissed"
      closeLabel="close"
    />
    <FormAlert
      type="danger"
      value="This is an alert that can be dismissed"
      closeLabel="close"
    />
  </div>
);
