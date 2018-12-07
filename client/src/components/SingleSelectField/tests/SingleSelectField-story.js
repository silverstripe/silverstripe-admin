import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import SingleSelectField from 'components/SingleSelectField/SingleSelectField';

const props = {
  name: 'options',
  source: [
    {
      value: 1,
      title: 'One'
    },
    {
      value: 2,
      title: 'Two'
    },
    {
      value: 3,
      title: 'Three'
    },
    {
      value: 4,
      title: 'Four (Disabled)',
      disabled: true
    },
  ],
};

storiesOf('Admin/SingleSelectField', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const description = text('Option description');
    let newSource = props.source;

    if (description && description.length) {
      newSource = props.source.map(item => ({ ...item, description }));
    }

    const newProps = { ...props, source: newSource };

    return <SingleSelectField {...newProps} />;
  })
  .add('Empty default', () => (
    <SingleSelectField
      {...props}
      data={{
        hasEmptyDefault: true,
        emptyString: 'Choose an option'
      }}
    />))
  .add('Readonly', () => (
    <SingleSelectField
      {...props}
      readOnly
      value="One"
    />
  ));
