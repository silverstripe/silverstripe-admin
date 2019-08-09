import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import { Component as Breadcrumb } from 'components/Breadcrumb/Breadcrumb';

const nodefault = (event) => event.preventDefault();

storiesOf('Admin/Breadcrumb', module)
  .add('single level', () => {
    const breadcrumbs = [
      {
        text: 'First level',
        href: 'level1',
        onClick: nodefault,
      },
    ];
    return <Breadcrumb crumbs={breadcrumbs} />;
  })
  .add('multi level', () => {
    const breadcrumbs = [
      {
        text: 'First level',
        href: 'level1',
        onClick: nodefault,
      },
      {
        text: 'Second level',
        href: 'level1/level2',
        onClick: nodefault,
      },
      {
        text: 'Third level',
        href: 'level1/level2/level3',
        onClick: nodefault,
      },
    ];
    return <Breadcrumb crumbs={breadcrumbs} />;
  })
  .add('multi level with icon', () => {
    const breadcrumbs = [
      {
        text: 'First level',
        href: 'level1',
        onClick: nodefault,
      },
      {
        text: 'Second level',
        href: 'level1/level2',
        onClick: nodefault,
        icon: {
          className: 'font-icon-edit-list',
        },
      },
    ];
    return <Breadcrumb crumbs={breadcrumbs} />;
  });
