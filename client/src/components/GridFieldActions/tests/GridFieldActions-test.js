/* global jest, describe, beforeEach, it, expect */

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import GridFieldActions from '../GridFieldActions';

describe('GridFieldActions', () => {
  let props = null;
  let actionMenu = null;

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

  beforeEach(() => {
    props = {
    };
  });

  describe('render()', () => {
    it('should not render, if there are no actions', () => {
      props.schema = [];

      actionMenu = ReactTestUtils.renderIntoDocument(
        <GridFieldActions {...props} />
      );

      expect(actionMenu.render()).toBe(null);
    });

    it('should render a single button, if there is only one action', () => {
      props.schema = [link];

      actionMenu = ReactTestUtils.renderIntoDocument(
        <GridFieldActions {...props} />
      );

      expect(ReactTestUtils.findRenderedDOMComponentWithClass(actionMenu, 'action').textContent).toBe('Link');
      expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(actionMenu, 'action-menu__toggle')).toHaveLength(0);
    });

    it('should render a menu, if there is more than one action', () => {
      props.schema = [button, link];

      actionMenu = ReactTestUtils.renderIntoDocument(
        <GridFieldActions {...props} />
      );

      expect(ReactTestUtils.findRenderedDOMComponentWithClass(actionMenu, 'action-menu__toggle').textContent).toBe('View actions');
    });
  });

  describe('renderSingleAction()', () => {
    it('should render the correct type of element according to action type', () => {
      props.schema = [button];

      actionMenu = ReactTestUtils.renderIntoDocument(
        <GridFieldActions {...props} />
      );

      expect(ReactTestUtils.findRenderedDOMComponentWithClass(actionMenu, 'action').tagName).toBe('BUTTON');

      props.schema = [link];

      actionMenu = ReactTestUtils.renderIntoDocument(
        <GridFieldActions {...props} />
      );

      expect(ReactTestUtils.findRenderedDOMComponentWithClass(actionMenu, 'action').tagName).toBe('A');

      props.schema = [
        {
          type: null,
          title: 'Link',
          url: '/test-url',
          group: 'My Group',
          data: {},
        }
      ];

      expect(ReactTestUtils.findRenderedDOMComponentWithClass(actionMenu, 'action').tagName).toBe('A');

      props.schema = [
        {
          type: [],
          title: 'Link',
          url: '/test-url',
          group: 'My Group',
          data: {},
        }
      ];

      expect(ReactTestUtils.findRenderedDOMComponentWithClass(actionMenu, 'action').tagName).toBe('A');
    });
  });

  describe('renderMultipleActions()', () => {
    it('should render the correct type of element according to action type', () => {
      props.schema = [button, link];

      actionMenu = ReactTestUtils.renderIntoDocument(
        <GridFieldActions {...props} />
      );

      actionMenu = ReactTestUtils.scryRenderedDOMComponentsWithClass(actionMenu, 'action');

      expect(actionMenu[0].textContent).toBe('Button');
      expect(actionMenu[0].tagName).toBe('BUTTON');
      expect(actionMenu[1].textContent).toBe('Link');
      expect(actionMenu[1].tagName).toBe('A');
    });

    it('should not render a divider if there is only one defined', () => {
      props.schema = [button, link];

      actionMenu = ReactTestUtils.renderIntoDocument(
        <GridFieldActions {...props} />
      );

      expect(ReactTestUtils.scryRenderedDOMComponentsWithClass(actionMenu, 'dropdown-divider')).toHaveLength(0);
    });

    it('should render dividers according to groups provided declared for each actions', () => {
      props.schema = [
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
      ];

      actionMenu = ReactTestUtils.renderIntoDocument(
        <GridFieldActions {...props} />
      );

      actionMenu = ReactTestUtils.findRenderedDOMComponentWithClass(actionMenu, 'action-menu__dropdown').children;

      expect(actionMenu).toHaveLength(3);
      expect(actionMenu[0].className).toContain('action');
      expect(actionMenu[1].className).toContain('dropdown-divider');
      expect(actionMenu[2].className).toContain('action');

      props.schema = [
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
      ];

      actionMenu = ReactTestUtils.renderIntoDocument(
        <GridFieldActions {...props} />
      );

      actionMenu = ReactTestUtils.findRenderedDOMComponentWithClass(actionMenu, 'action-menu__dropdown').children;

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
  });
});
