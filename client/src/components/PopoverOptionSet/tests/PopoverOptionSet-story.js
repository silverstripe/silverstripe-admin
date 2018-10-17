import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf, setAddon } from '@storybook/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import ValueTracker from 'stories/ValueTracker';
import PopoverOptionSetToggle from '../PopoverOptionSetToggle';
import JSXAddon from 'storybook-addon-jsx';

setAddon(JSXAddon);

const buttons = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => ({
  content: `Button ${letter}`,
  key: letter,
}));

const defaultButtonClickHandler = button => () => action(`"${button.content}" Clicked`)(button);

storiesOf('Admin/PopoverOptionSet', module)
  .addDecorator(withKnobs)
  .addDecorator(storyFn => <ValueTracker>{ storyFn() }</ValueTracker>)
  .addWithJSX('Simple Example', () => (
    <PopoverOptionSetToggle
      buttons={buttons}
      provideButtonClickHandler={defaultButtonClickHandler}
      id="Sample"
      disableSearch={!boolean('Search', true)}
    />
  ))
  .addWithJSX('With Icons', () => {
    const icons = [
      'block-back',
      'block-banner',
      'block-carousel',
      'block-content',
      'block-file',
      'block-file-list',
      'block-form',
      'block-layout',
      'block-media',
    ];

    const iconButtons = buttons.map(button => ({
      ...button,
      className: `font-icon-${icons[Math.floor(Math.random() * icons.length)]}`,
    }));

    return (
      <PopoverOptionSetToggle
        buttons={iconButtons}
        provideButtonClickHandler={defaultButtonClickHandler}
        id="Sample"
        disableSearch={!boolean('Search', true)}
      />
    );
  })
  .addWithJSX('Complex Content', withNotes(
    'Note that supplying JSX as content will mean that search will have to be disabled or you ' +
    'must implement a custom search function'
  )(() => {
    const customButtons = [
      {
        content: <span>Links? <a href="//example.com">Link</a></span>,
        key: 'link',
      },
      {
        content: <span style={{ color: 'red' }}>Red Text</span>,
        key: 'style',
      }
    ];

    return (
      <PopoverOptionSetToggle
        buttons={customButtons}
        provideButtonClickHandler={defaultButtonClickHandler}
        id="Sample"
        disableSearch
      />
    );
  }))
  .addWithJSX('Custom Search', withNotes(
    'This custom search function will ignore the "Button" prefix on each button'
  )(() => {
    const handleSearch = (term, set) => set.filter(
      ({ content }) => content.toLowerCase() === `button ${term.toLowerCase()}`
    );

    return (
      <PopoverOptionSetToggle
        buttons={buttons}
        provideButtonClickHandler={defaultButtonClickHandler}
        id="Sample"
        onSearch={handleSearch}
        searchPlaceholder="Custom search placeholder"
      />
    );
  }))
;
