/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import MobileMenuToggle from '../MobileMenuToggle';

test('MobileMenuToggle render() renders', () => {
  const { container } = render(
    <MobileMenuToggle {...{
      isOpen: false,
      onClick: () => {},
      controls: 'something',
    }}
    />
  );
  expect(container.querySelectorAll('button.cms-mobile-menu-toggle')).toHaveLength(1);
  expect(container.querySelectorAll('button.cms-mobile-menu-toggle--open')).toHaveLength(0);
});

test('MobileMenuToggle render() renders open', () => {
  const { container } = render(
    <MobileMenuToggle {...{
      isOpen: true,
      onClick: () => {},
      controls: 'something',
    }}
    />
  );
  expect(container.querySelectorAll('button.cms-mobile-menu-toggle')).toHaveLength(1);
  expect(container.querySelectorAll('button.cms-mobile-menu-toggle--open')).toHaveLength(1);
});
