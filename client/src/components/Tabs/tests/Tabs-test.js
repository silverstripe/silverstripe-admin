/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import { Component as Tabs } from '../Tabs';

test('Tabs render() renders the navigation with hideNav: false', () => {
  const { container } = render(
    <Tabs {...{
      id: '1',
      className: 'hello',
      extraClass: 'world',
      activateTab: jest.fn(),
      hideNav: false,
    }}
    >
      <div title="Child One" />
      <div title="Child Two" />
    </Tabs>
  );
  expect(container.querySelectorAll('.hello.world .nav-tabs')).toHaveLength(1);
});

test('Does not render the navigation with hideNav: true', () => {
  const { container } = render(
    <Tabs {...{
      id: '1',
      className: 'hello',
      extraClass: 'world',
      activateTab: jest.fn(),
      hideNav: true,
    }}
    >
      <div title="Child One" />
      <div title="Child Two" />
    </Tabs>
  );
  expect(container.querySelectorAll('.hello.world .nav-tabs')).toHaveLength(0);
});
