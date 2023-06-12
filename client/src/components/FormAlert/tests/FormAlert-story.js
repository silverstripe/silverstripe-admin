import React from 'react';
import FormAlert from 'components/FormAlert/FormAlert';

export default {
  title: 'Admin/FormAlert',
};

export const Types = () => (
  <div>
    <FormAlert type="success" value="This is a 'success'/'good' alert" />
    <FormAlert type="info" value="This is a 'info' alert" />
    <FormAlert type="warning" value="This is a 'warning' alert" />
    <FormAlert type="danger" value="This is a 'danger' alert" />
  </div>
);

export const Dismissable = () => (
  <div>
    <FormAlert
      type="success"
      value="This is an alert that can be dismissed"
      closeLabel="close"
    />
    <FormAlert
      type="danger"
      value="This is an alert that can be dismissed"
      closeLabel="close"
    />
  </div>
);
