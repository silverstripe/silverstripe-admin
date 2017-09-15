import React from 'react';
import { storiesOf } from '@storybook/react';
import Badge from '../components/Badge/Badge';
import TextField from '../components/TextField/TextField';
import { Breadcrumb } from '../components/Breadcrumb/Breadcrumb';
import ValueTracker from './ValueTracker';

storiesOf('Badge', module)
  .add('Default badge', ({ story }) => (
    <Badge message={story} />
  ))
  .add('Info badge', ({ story }) => (
    <Badge status="info" message={story} />
  ))
  .add('Success badge', ({ story }) => (
    <Badge status="success" message={story} />
  ))
  .add('Warning badge', ({ story }) => (
    <Badge status="warning" message={story} />
  ))
  .add('Danger badge', ({ story }) => (
    <Badge status="danger" message={story} />
  ))
  .add('Primary badge', ({ story }) => (
    <Badge status="primary" message={story} />
  ))
  .add('Secondary badge', ({ story }) => (
    <Badge status="secondary" message={story} />
  ));

storiesOf('TextField', module)
  .addDecorator((storyFn) => (
    <ValueTracker story={storyFn} />
  ))
  .add('Plain Textbox', () => (
    <TextField name="MyField" value="Default value" />
  ))
  .add('All titles Textbox', () => (
    <TextField
      title="Left title"
      rightTitle="Right title"
      description="My description"
      message={{ value: 'Validation message' }}
      data={{ prefix: 'prefix', suffix: 'suffix' }}
      name="MyField"
      value="Default value"
    />
  ));

storiesOf('Breadcrumb', module)
  .add('single level', () => {
    let breadcrumbs = [
      {
        text: 'First level',
        href: 'level1',
      },
    ];
    return <Breadcrumb crumbs={breadcrumbs} />;
  })
  .add('multi level', () => {
    let breadcrumbs = [
      {
        text: 'First level',
        href: 'level1',
      },
      {
        text: 'Second level',
        href: 'level1/level2',
      },
    ];
    return <Breadcrumb crumbs={breadcrumbs} />;
  });
