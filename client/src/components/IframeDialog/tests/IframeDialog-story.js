import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import IframeDialog from 'components/IframeDialog/IframeDialog';

storiesOf('Admin/IframeDialog', module)
  .add('Dialog', () => (
    <IframeDialog
      url="https://silverstripe.org"
      isOpen
      title="iFrame Dialog"
    />
  ));
