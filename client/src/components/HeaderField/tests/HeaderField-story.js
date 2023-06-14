import HeaderField from 'components/HeaderField/HeaderField';
import { jsxDecorator } from 'storybook-addon-jsx';

export default {
  title: 'Admin/HeaderField',
  component: HeaderField,
  decorators: [
    jsxDecorator
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Generates a header field for displaying as a title.'
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
    data: {
      description: `Extra data that helps define this field uniquely.
      * headingLevel (number): The level depth for heading.
      * title (string) (required): Title to display.`,
      control: 'object',
      type: {
        required: true
      },
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{}' },
      }
    }
  }
};

export const Heading = {
  args: {
    id: 'my-hidden',
    extraClass: 'my-extra-class',
    data: {
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      headingLevel: 1
    }
  }
};
