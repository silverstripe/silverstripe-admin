import React from 'react';
import { jsxDecorator } from 'storybook-addon-jsx';
import Tip, { TIP_IMPORTANCE_LEVELS, TIP_TYPES } from 'components/Tip/Tip';
import { FormGroup, Input, InputGroup } from 'reactstrap';

const inputProps = {
  name: 'MyField',
  id: 'MyField',
  title: 'Field title',
  placeholder: 'Placeholder text',
};

const importanceLevels = Object.keys(TIP_IMPORTANCE_LEVELS).reduce(
  (accumulator, key) => ({
    ...accumulator,
    [`TIP_IMPORTANCE_LEVELS.${key}`]: TIP_IMPORTANCE_LEVELS[key],
  }),
  {}
);

export default {
  title: 'Admin/Tip',
  component: Tip,
  decorators: [jsxDecorator],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `The Tip UI allows you to provide extra context on the purpose of a field. It is designed to be applied to an InputGroup.
        You can use it with an \`InputField\` by passing the relevant configuration in the \`tip\` prop.
        See the \`addTip\` method in \`TextField.php\` for an explanation on how to add Tips from the backend.
        **Note:** The Tip UI will visually conflict with prefix / suffix rendering, as they use the same input-grou
        functionality and this can't be stacked.`
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
      description: 'A unique identifier for this instance of the tip.',
      control: 'text',
      table: {
        type: { summary: 'string|number' },
        defaultValue: { summary: '' },
      }
    },
    content: {
      description: 'The text to render in the popover. Should be plaintext - HTML will not be parsed.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '' },
      }
    },
    icon: {
      description: 'An icon from the icon font to use. See the Icon reference in the Pattern Library UI. Defaults to `lamp`.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'lamp' },
      }
    },
    importance: {
      description: `Should be specified as \`'normal'\` or \`'high'\` (defaults to \`'normal'\`). Designates the colour used for
      the icon, and the accessible label of the toggle. Allowed values are defined in the exported \`TIP_IMPORTANCE_LEVELS\`
      constant in \`Tip.js\`.`,
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'lamp' },
      }
    },
    fieldTitle: {
      description: 'A title for the field it relates to, which will be read aloud for screenreaders.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'lamp' },
      }
    },
  }
};

export const _TitleTip = () => (
  <FormGroup>
    {inputProps.title}
    <Tip
      id={`FieldHolder-${inputProps.id}-titleTip`}
      content="Example tip contents"
      icon="attention"
      fieldTitle={inputProps.title}
      type={TIP_TYPES.TITLE}
    />
    <div className="form__field-holder">
      <Input {...inputProps} />
    </div>
  </FormGroup>
);

export const _InputGroupTip = (args) => (
  <InputGroup>
    <Input {...inputProps} />
    <Tip {...args} />
  </InputGroup>
);

_InputGroupTip.args = {
  id: 'input-group-tip-field',
  content: 'Example tip contents',
  fieldTitle: inputProps.title,
  icon: 'lamp',
  importance: 'normal',
  type: TIP_TYPES.INPUT_GROUP
};

_InputGroupTip.argsType = {
  icon: {
    control: 'inline-radio',
    options: ['lamp', 'attention', 'flag'],
  },
  importance: {
    control: 'inline-radio',
    options: importanceLevels
  }
};
