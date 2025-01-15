/* global jest, test, describe, beforeEach, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import GridFieldActions from '../GridFieldActions';

const button = {
  type: 'submit',
  title: 'Button',
  group: 'My Group',
  data: {},
};

const link = {
  type: 'link',
  title: 'Link',
  url: '/test-url',
  group: 'My Group',
  data: {},
};

test('GridFieldActions.render() should not render, if there are no actions', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: []
    }}
    />
  );
  expect(container.querySelectorAll('.action')).toHaveLength(0);
});

test('GridFieldActions.render() should render a single button, if there is only one action', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [link]
    }}
    />
  );
  expect(container.querySelectorAll('.action')).toHaveLength(1);
});

test('GridFieldActions.render() should render a menu, if there is more than one action', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [button, link]
    }}
    />
  );
  expect(container.querySelector('.action-menu__toggle .visually-hidden').innerHTML).toBe('View actions');
});

test('GridFieldActions.renderSingleAction() should render a button', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [button]
    }}
    />
  );
  expect(container.querySelector('button').type).toBe('submit');
});

test('GridFieldActions.renderSingleAction() should render a link', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [link]
    }}
    />
  );
  expect(container.querySelector('a').classList).toContain('action');
});

test('GridFieldActions.renderSingleAction() should render a link when type is null', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [{
        type: null,
        title: 'Link',
        url: '/test-url',
        group: 'My Group',
        data: {},
      }]
    }}
    />
  );
  expect(container.querySelector('a').classList).toContain('action');
});

test('GridFieldActions.renderMultipleActions() should render the correct type of element according to action type', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [button, link]
    }}
    />
  );
  const actions = container.querySelectorAll('.action');
  expect(actions[0].innerHTML).toBe('Button');
  expect(actions[0].tagName).toBe('BUTTON');
  expect(actions[1].innerHTML).toBe('Link');
  expect(actions[1].tagName).toBe('A');
});

test('GridFieldActions.renderMultipleActions() should not render a divider if there is only one defined', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [button, link]
    }}
    />
  );
  expect(container.querySelector('.dropdown-divider')).toBeNull();
});

test('GridFieldActions.renderMultipleActions() should render dividers according to groups provided declared for each actions', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [
        {
          type: 'submit',
          title: 'Button',
          group: 'First Group',
          data: {},
        },
        {
          type: 'link',
          title: 'Link',
          url: '/test-url',
          group: 'Second Group',
          data: {},
        }
      ]
    }}
    />
  );
  const actionMenu = container.querySelector('.action-menu__dropdown').children;
  expect(actionMenu).toHaveLength(3);
  expect(actionMenu[0].className).toContain('action');
  expect(actionMenu[1].className).toContain('dropdown-divider');
  expect(actionMenu[2].className).toContain('action');
});

test('GridFieldActions.renderMultipleActions() ', () => {
  const { container } = render(
    <GridFieldActions {...{
      schema: [
        {
          type: 'submit',
          title: 'Button',
          group: 'First Group',
          data: {},
        },
        {
          type: 'link',
          title: 'Link',
          url: '/test-url',
          group: 'Second Group',
          data: {},
        },
        {
          type: 'link',
          title: 'Link',
          url: '/test-url',
          group: 'Third Group',
          data: {},
        },
        {
          type: 'submit',
          title: 'Button',
          group: 'First Group',
          data: {},
        },
        {
          type: 'link',
          title: 'Link',
          url: '/test-url',
          group: 'Second Group',
          data: {},
        },
        {
          type: 'link',
          title: 'Link',
          url: '/test-url',
          group: 'Third Group',
          data: {},
        }
      ]
    }}
    />
  );
  const actionMenu = container.querySelector('.action-menu__dropdown').children;
  expect(actionMenu).toHaveLength(8);
  expect(actionMenu[0].className).toContain('action');
  expect(actionMenu[1].className).toContain('action');
  expect(actionMenu[2].className).toContain('dropdown-divider');
  expect(actionMenu[3].className).toContain('action');
  expect(actionMenu[4].className).toContain('action');
  expect(actionMenu[5].className).toContain('dropdown-divider');
  expect(actionMenu[6].className).toContain('action');
  expect(actionMenu[7].className).toContain('action');
});
