/* global jest, describe, beforeEach, it, expect */

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import TreeDropdownFieldMenu from '../TreeDropdownFieldMenu';

describe('TreeDropdownField', () => {
  let props = null;
  let field = null;

  beforeEach(() => {
    props = {
      tree: {
        id: 0,
        title: 'root',
        count: 2,
        children: [
          {
            id: 5,
            title: 'page five',
            children: [
              {
                id: 9,
                title: 'page nine',
                children: [
                  {
                    id: 14,
                    title: 'page fourteen',
                  },
                  {
                    id: 26,
                    title: 'page twenty-six',
                    children: [],
                  },
                ],
              },
              {
                id: 11,
                title: 'page eleven',
              },
            ],
          },
          {
            id: 7,
            title: 'page seven',
            children: [
              {
                id: 27,
                title: 'page twenty-seven',
              },
              {
                id: 15,
                title: 'page fifteen',
                count: 0,
              },
            ],
          },
        ],
      },
      breadcrumbs: [
        { id: 5, title: 'page five' },
        { id: 7, title: 'page seven' },
      ],
      value: [5],
    };
  });

  describe('renderBreadcrumbs()', () => {
    it('should return a rendered component', () => {
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownFieldMenu {...props} />
      );
      const breadcrumbs = field.renderBreadcrumbs();

      expect(breadcrumbs).not.toBe(null);
      expect(breadcrumbs.props.className).toContain('treedropdownfield__breadcrumbs');
    });

    it('should return null if there are no crumbs in the list', () => {
      props.breadcrumbs = [];
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownFieldMenu {...props} />
      );
      const breadcrumbs = field.renderBreadcrumbs();

      expect(breadcrumbs).toBe(null);
    });
  });

  describe('renderOption()', () => {
    it('should return null if no renderMenuOptions were provided', () => {
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownFieldMenu {...props} />
      );
      const option = field.renderOption();

      expect(option).toBe(null);
    });

    it('should return a rendered component renderMenuOptions were provided', () => {
      props.renderMenuOptions = {
        valueArray: [],
        optionRenderer: jest.fn(() => null),
        optionComponent: jest.fn(() => null),
        onOptionRef: jest.fn(),
      };
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownFieldMenu {...props} />
      );
      const option = field.renderOption(props.tree);

      expect(option).not.toBe(null);
    });
  });

  describe('render()', () => {
    it('should show loading', () => {
      props.loading = true;
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownFieldMenu {...props} />
      );
      const nodes = ReactTestUtils.scryRenderedDOMComponentsWithClass(field, 'Select-loading-zone');

      expect(nodes.length).toBe(1);
    });

    it('should show failed if it could not load', () => {
      props.failed = true;
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownFieldMenu {...props} />
      );
      const node = ReactTestUtils.scryRenderedDOMComponentsWithClass(field, 'Select-option')[0];

      expect(node.textContent).toBe('Failed to load');
    });

    it('should notify if list is empty', () => {
      props.tree = {
        count: 0,
        children: [],
      };
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownFieldMenu {...props} />
      );
      const node = ReactTestUtils.scryRenderedDOMComponentsWithClass(field, 'Select-option')[0];

      expect(node.textContent).toBe('No children');
    });

    it('should return a list of the tree children plus breadcrumbs', () => {
      props.renderMenuOptions = {
        valueArray: [],
        optionRenderer: () => <div>item</div>,
        // eslint-disable-next-line react/prop-types
        optionComponent: ({ option, className }) => <div className={className}>{option.id}</div>,
        onOptionRef: jest.fn(),
        options: props.tree.children,
      };
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownFieldMenu {...props} />
      );
      const findNodesByClass = ReactTestUtils.scryRenderedDOMComponentsWithClass;
      const children = findNodesByClass(field, 'treedropdownfield__option');
      const breadcrumb = findNodesByClass(field, 'treedropdownfield__breadcrumbs');

      expect(children.length).toBe(2);
      expect(breadcrumb.length).toBe(1);
    });
  });
});
