import React from 'react';
import { jsxDecorator } from 'storybook-addon-jsx';

import Tip, { TIP_IMPORTANCE_LEVELS, TIP_TYPES } from 'components/Tip/Tip';
import ValueTracker from 'stories/ValueTracker';
import { FormGroup, Input, InputGroup, InputGroupAddon } from 'reactstrap';

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
    decorators: [
      jsxDecorator,
      (Story) => (<div style={{ margin: '5em', width: '30em' }}>
        <ValueTracker><Story/></ValueTracker>
      </div>),
    ]
};

export const _TitleTip = () => (
    <FormGroup>
        {inputProps.title}
        <Tip
          id={`FieldHolder-${inputProps.id}-titleTip`}
          content={'Example tip contents'}
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
      <InputGroupAddon addonType="append">
        <Tip {...args} />
      </InputGroupAddon>
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
