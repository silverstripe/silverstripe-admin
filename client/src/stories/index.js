import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Badge from '../components/Badge/Badge';
import TextField from '../components/TextField/TextField';
import Breadcrumb from '../components/Breadcrumb/Breadcrumb';

storiesOf('Badge', module)
  .add('with text', () => (
    <Badge message="Some text" />
  ));

storiesOf('TextField', module)
  .add('with text', () => (
    <TextField value="Some text" name="MyField" />
  ))
  .add('with placeholder', () => (
    <TextField value="" name="MyField" placeholder="woot" />
  ));

storiesOf('Breadcrumb', module)
  .add('single level', () => {
      let breadcrumbs = [
        {
            text: 'First level',
            href: 'level1'
        }
    ];
    return <Breadcrumb crumbs={breadcrumbs} />;
    })
  .add('multi level', () => {
    let breadcrumbs = [
      {
          text: 'First level',
          href: 'level1'
      },
      {
          text: 'Second level',
          href: 'level1/level2'
      }
  ];
  return <Breadcrumb crumbs={breadcrumbs} />;
  });
