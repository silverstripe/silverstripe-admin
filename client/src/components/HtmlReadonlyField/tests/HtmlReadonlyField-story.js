import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import HtmlReadonlyField from 'components/HtmlReadonlyField/HtmlReadonlyField';

const htmlValue = `<div>Some <strong>HTML</strong>
  <span style="font-style: italic">Content</span><br />
  That renders as HTML, not as an escaped string
</div>`;

storiesOf('Admin/HtmlReadonlyField', module)
  .add('Default', () => (
    <HtmlReadonlyField name="default" value="This is readonly" />
  ))
  .add('HTML Value', () => (
    <HtmlReadonlyField name="default" value={htmlValue} />
  ));
