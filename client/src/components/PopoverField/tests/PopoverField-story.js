import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import PopoverField from 'components/PopoverField/PopoverField';

storiesOf('Admin/PopoverField', module)
  .add('Default', () => (
    <PopoverField
      id="popover-field"
      title="Popover Field"
      data={{
        popoverTitle: 'I\'m a popover',
        buttonTooltip: 'Button tooltip'
      }}
    >
      <p>This is some info in the popover</p>
    </PopoverField>
  ))
  .add('Positions', () => (
    <div style={{ width: '50vw', height: '3rem', margin: 'auto', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, textAlign: 'center' }}>
      <PopoverField
        id="popover-field-right"
        title="Right"
        data={{
          popoverTitle: 'I\'m a popover',
          buttonTooltip: 'Button tooltip',
          placement: 'right'
        }}
      >
        <p>This is a right positioned popover</p>
      </PopoverField>
      <PopoverField
        id="popover-field-bottom"
        title="Bottom"
        data={{
          popoverTitle: 'I\'m a popover',
          buttonTooltip: 'Button tooltip',
          placement: 'bottom'
        }}
      >
        <p>This is a bottom positioned popover</p>
      </PopoverField>
      <PopoverField
        id="popover-field-left"
        title="Left"
        data={{
          popoverTitle: 'I\'m a popover',
          buttonTooltip: 'Button tooltip',
          placement: 'left'
        }}
      >
        <p>This is a left positioned popover</p>
      </PopoverField>
      <PopoverField
        id="popover-field-top"
        title="Top"
        data={{
          popoverTitle: 'I\'m a popover',
          buttonTooltip: 'Button tooltip',
          placement: 'top'
        }}
      >
        <p>This is a top positioned popover</p>
      </PopoverField>
    </div>
));
