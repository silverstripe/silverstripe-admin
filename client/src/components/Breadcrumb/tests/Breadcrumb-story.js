import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf, setAddon } from '@storybook/react';
import { withKnobs, select } from '@storybook/addon-knobs/react';
import JSXAddon from 'storybook-addon-jsx';
import { action } from '@storybook/addon-actions';

import { Component as Breadcrumb } from 'components/Breadcrumb/Breadcrumb';

setAddon(JSXAddon);

// Simple values to displays in the select fields.
const icons = [
  '',
  'font-icon-edit-list',
  'font-icon-calendar',
  'font-icon-p-home',
  'font-icon-cart'
];
const levels = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth'];

// Build an action to handle the click on the crumbs
const crumbAction = (event) => {
  event.preventDefault();
  return action('onClick')(event);
};
crumbAction.toString = () => 'onClick';

/**
 * This method can be used to build an array of breadcrumbs
 * @param position 0-based index of the level
 * @param rank Textual representation of the rank level
 * @param string icon class to applu to the icon
 * @returns {Object[]}
 */
const buildBreadCrumb = (position, rank, icon) => {
  const level = levels[position];
  let crumb = [{
    text: `${level} level`,
    href: '#',
    onClick: crumbAction
  }];

  if (level === rank) {
    crumb[0].icon = { className: icon };
  } else {
    crumb = crumb.concat(buildBreadCrumb(position + 1, rank, icon));
  }

  return crumb;
};

storiesOf('Admin/Breadcrumb', module)
  .addDecorator(withKnobs)
  .addWithJSX('Breadcrumb', () => (
    <Breadcrumb crumbs={buildBreadCrumb(
        0,
        select('Number of levels', levels, 'First'),
        select('icon', icons)
    )}
    />
  ));
