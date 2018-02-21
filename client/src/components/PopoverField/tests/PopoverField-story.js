import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import PopoverField from 'components/PopoverField/PopoverField';

const centerStyles = {
  margin: 'auto',
  textAlign: 'center',
  display: 'flex',
};

storiesOf('Admin/PopoverField', module)
  .add('Default', () => (
    <div style={centerStyles}>
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
    </div>
  ))
  .add('Positions', () => (
    <div style={centerStyles}>
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
    </div>
  ))
  .add('Contained', () => {
    const containerStyles = {
      position: 'relative',
      overflowY: 'scroll',
      margin: '200px 0 0 0',
      height: '400px',
      width: '300px',
      border: '1px solid black'
    };

    return (
      <div>
        <PopoverField
          id="popover-field-right"
          title="Contained"
          data={{
            popoverTitle: 'I\'m a popover',
            buttonTooltip: 'Button tooltip',
            placement: 'auto',
          }}
          container="#my-container"
        >
          <p>This is Contained in another html element rather than the body</p>
        </PopoverField>
        <div id="my-container" style={containerStyles} />
      </div>
    );
  });
