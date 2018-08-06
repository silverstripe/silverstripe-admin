import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import FormAction from 'components/FormAction/FormAction';

storiesOf('Admin/FormAction', module)
  .add('States', () => (
    <div>
      <FormAction
        title="Primary"
        data={{ buttonStyle: 'primary' }}
      />
      <FormAction
        title="Secondary"
        data={{ buttonStyle: 'secondary' }}
      />
      <FormAction
        title="Danger"
        data={{ buttonStyle: 'danger' }}
      />
      <FormAction
        title="Warning"
        data={{ buttonStyle: 'warning' }}
      />
      <FormAction
        title="Info"
        data={{ buttonStyle: 'info' }}
      />
      <FormAction
        title="Link"
        data={{ buttonStyle: 'link' }}
      />
    </div>
  ))
  .add('Outline', () => (
    <div>
      <FormAction
        title="Primary"
        data={{ buttonStyle: 'outline-primary' }}
      />
      <FormAction
        title="Secondary"
        data={{ buttonStyle: 'outline-secondary' }}
      />
      <FormAction
        title="Danger"
        data={{ buttonStyle: 'outline-danger' }}
      />
      <FormAction
        title="Warning"
        data={{ buttonStyle: 'outline-warning' }}
      />
      <FormAction
        title="Info"
        data={{ buttonStyle: 'outline-info' }}
      />
    </div>
  ))
  .add('Icons', () => (
    <div>
      <FormAction
        title="Rocket"
        icon="rocket"
        data={{ buttonStyle: 'primary' }}
      />
      <FormAction
        title="Upload"
        icon="save"
        data={{ buttonStyle: 'secondary' }}
      />
    </div>
  ))
  .add('Loading', () => (
    <div>
      <FormAction
        title="Loading"
        loading
        data={{ buttonStyle: 'primary' }}
      />
      <FormAction
        title="Loading"
        loading
        data={{ buttonStyle: 'secondary' }}
      />
    </div>
  ))
  .add('Disabled', () => (
    <div>
      <p>
        <FormAction
          title="Primary"
          disabled
          data={{ buttonStyle: 'primary' }}
        />
        <FormAction
          title="Secondary"
          disabled
          data={{ buttonStyle: 'secondary' }}
        />
        <FormAction
          title="Danger"
          disabled
          data={{ buttonStyle: 'danger' }}
        />
        <FormAction
          title="Warning"
          disabled
          data={{ buttonStyle: 'warning' }}
        />
        <FormAction
          title="Info"
          disabled
          data={{ buttonStyle: 'info' }}
        />
        <FormAction
          title="Link"
          disabled
          data={{ buttonStyle: 'link' }}
        />
      </p>

      <p>
        <FormAction
          title="Primary"
          disabled
          data={{ buttonStyle: 'outline-primary' }}
        />
        <FormAction
          title="Secondary"
          disabled
          data={{ buttonStyle: 'outline-secondary' }}
        />
        <FormAction
          title="Danger"
          disabled
          data={{ buttonStyle: 'outline-danger' }}
        />
        <FormAction
          title="Warning"
          disabled
          data={{ buttonStyle: 'outline-warning' }}
        />
        <FormAction
          title="Info"
          disabled
          data={{ buttonStyle: 'outline-info' }}
        />
      </p>
    </div>
  ));
