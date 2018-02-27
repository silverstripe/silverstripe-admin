import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import HtmlReadonlyField from 'components/HtmlReadonlyField/HtmlReadonlyField';

storiesOf('Admin/HtmlReadonlyField', module)
  .add('Default', () => (
    <HtmlReadonlyField name="default" value="This is readonly" />
  ));
