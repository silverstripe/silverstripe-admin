import { jsxDecorator } from 'storybook-addon-jsx';
import Modal from 'components/Modal/Modal';
import Button from 'components/Button/Button';
import React from 'react';

export default {
  title: 'Admin/Modal',
  component: Modal,
  decorators: [
    jsxDecorator
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Display content in a modal.'
      },
      canvas: {
        sourceState: 'shown',
      },
    }
  },
  argTypes: {
    size: {
      description: 'Size of the Modal in pixel',
      options: ['sm', 'lg', 'xl'],
      control: { type: 'select' },
    },
    title: {
      description: 'Title of the modal',
      control: 'text',
    },
    isOpen: {
      description: 'If the modal is open or not.',
      control: 'boolean',
    },
    className: {
      description: 'Any extra classes to apply for the Modal.',
      control: 'text',
    },
  }
};

/** Test message */
export const _Modal = {
  args: {
    title: 'Hello World!',
    className: '',
    isOpen: false,
    size: '',
  },
  render: (args, { onClosed }) => (
    <Modal {...args} onClosed={onClosed}>
      <div className="modal-body">
        <p>The quick brown fox jumps over the lazy dog.</p>
      </div>
      <div className="modal-footer">
        <Button color="primary">Do something</Button>
      </div>
    </Modal>
  ),
};
