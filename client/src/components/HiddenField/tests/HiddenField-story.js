import React from 'react';
import HiddenField from 'components/HiddenField/HiddenField';

const props = {
  extraClass: 'my-extra-class',
  name: 'MyName',
  value: 'MyValue',
};

export default {
  title: 'Admin/HiddenField',
};

export const Default = () => <HiddenField {...props} />;
