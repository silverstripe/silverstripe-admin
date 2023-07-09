/* global jest, test, describe, beforeEach, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import { Component as Breadcrumb } from '../Breadcrumb';

test('BreadcrumbsComponent renderBreadcrumbs() should convert the props.crumbs array into jsx to be rendered', () => {
  const { container } = render(
    <Breadcrumb {...{
      crumbs: [
        { text: 'breadcrumb1', href: 'href1' },
        { text: 'breadcrumb2', href: 'href2' },
        { text: 'breadcrumb3',
          href: 'href3',
          icon: {
            className: 'breadcrumb3icon',
            onClick: jest.fn(),
          },
        },
      ]
    }}
    />
  );
  const links = container.querySelectorAll('.breadcrumb__item-title');
  expect(links).toHaveLength(3);
  expect(links[0].textContent).toBe('breadcrumb1');
  expect(links[1].textContent).toBe('breadcrumb2');
  expect(links[2].textContent).toBe('breadcrumb3');
  expect(links[2].parentElement.classList).toContain('breadcrumb__item--last');
  expect(container.querySelectorAll('.breadcrumb3icon')).toHaveLength(1);
});

test('BreadcrumbsComponent renderBreadcrumbs() should convert the props.crumbs array into jsx to be rendered', () => {
  const { container } = render(<Breadcrumb/>);
  expect(container.querySelectorAll('.breadcrumb__item')).toHaveLength(0);
});

test('BreadcrumbsComponent renderBreadcrumbs() can have multiple icons for the last crumb', () => {
  const { container } = render(
    <Breadcrumb {...{
      crumbs: [
        { text: 'breadcrumb1', href: 'href1' },
        { text: 'breadcrumb2',
          href: 'href2',
          icons: [
            { className: 'breadcrumb2iconA', onClick: jest.fn() },
            { className: 'breadcrumb2iconB', onClick: jest.fn() }
          ]
        },
      ]
    }}
    />
  );
  expect(container.querySelectorAll('.breadcrumb2iconA')).toHaveLength(1);
  expect(container.querySelectorAll('.breadcrumb2iconB')).toHaveLength(1);
});
