import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, boolean, selectV2 } from '@storybook/addon-knobs';
import FileStatusIcon from 'components/FileStatusIcon/FileStatusIcon';

import notes from '../README.md';

storiesOf('Admin/FileStatusIcon', module)
  .addDecorator(withKnobs)
  .addWithJSX(
    'Default',
    withNotes(notes)(
      () => (
        <FileStatusIcon
          fileID={123}
          hasRestrictedAccess={boolean('hasRestrictedAccess', true)}
          isTrackedFormUpload={boolean('isTrackedFormUpload', false)}
          includeBackground={boolean('includeBackground', false)}
          placement={selectV2('placement', ['auto', 'top', 'bottom', 'left', 'right'], 'auto')}
          disableTooltip={boolean('disableTooltip', false)}
        />
      )
    )
  );
