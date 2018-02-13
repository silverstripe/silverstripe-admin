import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import FormAlert from 'components/FormAlert/FormAlert';

storiesOf('Admin/FormAlert', module)
  .add('Types', () => (
    <div>
      <FormAlert
        type="success"
        value={'This is a \'success\'/\'good\' alert'}
      />
      <FormAlert
        type="info"
        value={'This is a \'info\' alert'}
      />
      <FormAlert
        type="warning"
        value={'This is a \'warning\' alert'}
      />
      <FormAlert
        type="danger"
        value={'This is a \'danger\' alert'}
      />
    </div>
  ))
  .add('Dismissable', () => (
    <div>
      <FormAlert
        type="success"
        value={'This is an alert that can be dismissed'}
        closeLabel="close"
      />
    </div>
  ));
