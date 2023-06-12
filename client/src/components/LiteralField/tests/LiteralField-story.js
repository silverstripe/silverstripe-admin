import React from 'react';
import LiteralField from 'components/LiteralField/LiteralField';

const props = {
  id: 'my-id',
  name: 'MyName',
  className: 'my-classname',
  extraClass: 'my-extra-class',
  value: '<h2>My literal heading</h2><p>My literal content</p>',
};

export default {
  title: 'Admin/LiteralField',
};

export const Default = () => <LiteralField {...props} />;
