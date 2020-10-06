import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import HeaderField from 'components/HeaderField/HeaderField';

const props = {
  extraClass: 'my-extra-class',
  data: {
    title: 'My title',
  }
};

storiesOf('Admin/HeaderField', module)
  .add('Heading 1', () => (
    <HeaderField {...{ ...props, data: { ...props.data, headingLevel: 1 } }} />
  ))
  .add('Heading 2', () => (
    <HeaderField {...{ ...props, data: { ...props.data, headingLevel: 2 } }} />
  ))
  .add('Heading 3', () => (
    <HeaderField {...{ ...props, data: { ...props.data, headingLevel: 3 } }} />
  ))
  .add('Heading 4', () => (
    <HeaderField {...{ ...props, data: { ...props.data, headingLevel: 4 } }} />
  ));
