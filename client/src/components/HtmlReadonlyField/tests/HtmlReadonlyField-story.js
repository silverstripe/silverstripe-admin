import React from 'react';
import HtmlReadonlyField from 'components/HtmlReadonlyField/HtmlReadonlyField';

const htmlValue = `<div>Some <strong>HTML</strong>
  <span style='font-style: italic'>Content</span><br />
  That renders as HTML, not as an escaped string
</div>`;

export default {
  title: 'Admin/HtmlReadonlyField',
};

export const Default = () => (
  <HtmlReadonlyField name="default" value="This is readonly" />
);

export const HtmlValue = () => (
  <HtmlReadonlyField name="default" value={htmlValue} />
);

HtmlValue.story = {
  name: 'HTML Value',
};
