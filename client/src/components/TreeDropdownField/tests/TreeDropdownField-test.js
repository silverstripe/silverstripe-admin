/* global jest, describe, beforeEach, it, expect, setTimeout */

jest.mock('components/TreeDropdownField/TreeDropdownFieldMenu');
jest.mock('isomorphic-fetch', () =>
  () => Promise.resolve({
    json: () => ({}),
  })
);

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { TreeDropdownField } from '../TreeDropdownField';

describe('TreeDropdownField', () => {
  let props = null;
  let field = null;

  beforeEach(() => {
    props = {
      id: 'Form_Test',
      name: 'Test',
      data: {
        urlTree: 'url-callback',
      },
      tree: {
        id: 0,
        title: 'root',
        count: 2,
        children: [
          {
            id: 5,
            title: 'page five',
            count: 2,
            children: [
              {
                id: 9,
                title: 'page nine',
                count: 2,
                children: [
                  {
                    id: 14,
                    title: 'page fourteen',
                    count: 0,
                    children: [],
                  },
                  {
                    id: 26,
                    title: 'page twenty-six',
                    count: 5,
                    children: [],
                  },
                ],
              },
              {
                id: 11,
                title: 'page eleven',
                count: 0,
                children: [],
              },
            ],
          },
          {
            id: 7,
            title: 'page seven',
            count: 2,
            children: [
              {
                id: 27,
                title: 'page twenty-seven',
                count: 0,
                children: [],
              },
              {
                id: 15,
                title: 'page fifteen',
                count: 0,
                children: [],
              },
            ],
          },
        ],
      },
      actions: {
        treeDropdownField: {
          beginTreeUpdating: jest.fn(),
          updateTreeFailed: jest.fn(),
          updateTree: jest.fn(),
          setVisible: jest.fn(),
          setSearch: jest.fn(),
        },
      },
    };
  });

  describe('handleSearchReset()', () => {
    beforeEach(() => {
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
    });

    it('should clear search on reset', () => {
      field.handleSearchReset();

      expect(props.actions.treeDropdownField.setSearch).toBeCalled();
    });
  });

  describe('handleSearchReset()', () => {
    beforeEach(() => {
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
    });

    it('should set search after a delay', () => {
      jest.useFakeTimers();
      field.handleSearchChange('searching');

      expect(setTimeout).toBeCalled();

      const callback = setTimeout.mock.calls[0][0];
      callback();

      expect(props.actions.treeDropdownField.setSearch).toBeCalledWith(props.id, 'searching');
    });
  });

  describe('getVisibleTree()', () => {
    it('should call findTreeByPath()', () => {
      props.tree = {};
      props.visible = [1];

      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      field.findTreeByPath = jest.fn();

      field.getVisibleTree();

      expect(field.findTreeByPath).toBeCalledWith(props.tree, props.visible);
    });
  });

  describe('getBreadcrumbs()', () => {
    it('should traverse the path given and return the relevant nodes in the tree', () => {
      props.visible = [5, 9, 26];
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      const breadcrumbs = field.getBreadcrumbs();

      expect(breadcrumbs[0].id).toBe(props.visible[0]);
      expect(breadcrumbs[1].id).toBe(props.visible[1]);
      expect(breadcrumbs[2].id).toBe(props.visible[2]);
    });

    it('should traverse and terminate early if using a missing node', () => {
      props.visible = [5, 8, 26];
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      const breadcrumbs = field.getBreadcrumbs();

      expect(breadcrumbs[0].id).toBe(props.visible[0]);
      expect(breadcrumbs[1]).toBeFalsy();
    });
  });

  describe('findTreeByPath()', () => {
    beforeEach(() => {
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
    });

    it('should return the root tree with an empty path provided', () => {
      const node = field.findTreeByPath(props.tree, []);

      expect(node).toBe(props.tree);
    });

    it('should return null with an empty tree', () => {
      const node = field.findTreeByPath({}, []);

      expect(node).toBe(null);
    });

    it('should give the proper node in the hierarchy', () => {
      const path = [5, 9];
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      const node = field.findTreeByPath(props.tree, path);

      expect(node.id).toBe(9);
      expect(node.title).toBe('page nine');
    });
  });

  describe('lazyLoad()', () => {
    it('should not call fetch if any node in the path is loading', () => {
      props.loading = [9];
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      field.callFetch = jest.fn(() => Promise.resolve({}));

      const promise = field.lazyLoad([5, 9, 26]);

      return promise
        .then(() => {
          expect(field.callFetch).not.toBeCalled();
        });
    });

    it('should not call fetch if any node in the path is failed', () => {
      props.failed = [9];
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      field.callFetch = jest.fn(() => Promise.resolve({}));

      const promise = field.lazyLoad([5, 9, 26]);

      return promise
        .then(() => {
          expect(field.callFetch).not.toBeCalled();
        });
    });

    it('should not call fetch if node are no children', () => {
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      field.callFetch = jest.fn(() => Promise.resolve({}));

      const promise = field.lazyLoad([7, 15]);

      return promise
        .then(() => {
          expect(field.callFetch).not.toBeCalled();
        });
    });

    it('should not call fetch if node is already loaded', () => {
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      field.callFetch = jest.fn(() => Promise.resolve({}));

      const promise = field.lazyLoad([5, 9]);

      return promise
        .then(() => {
          expect(field.callFetch).not.toBeCalled();
        });
    });

    it('should call fetch', () => {
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      field.callFetch = jest.fn(() => Promise.resolve({}));

      const promise = field.lazyLoad([5, 9, 26]);

      return promise
        .then(() => {
          expect(field.callFetch).toBeCalled();
        });
    });
  });

  describe('handleKeyDown()', () => {
    beforeEach(() => {
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      field.handleBack = jest.fn();
      field.handleNavigate = jest.fn();
      field.handleSearchReset = jest.fn();
    });

    it('should not navigate if a search is active', () => {
      field.selectField.getFocusedOption = jest.fn(() => null);
      field.hasSearch = () => true;

      const event = document.createEvent('Event');
      event.keyCode = 37;

      field.handleKeyDown(event);

      expect(field.selectField.getFocusedOption).not.toBeCalled();
      expect(field.handleBack).not.toBeCalled();
      expect(field.handleNavigate).not.toBeCalled();
      expect(field.handleSearchReset).not.toBeCalled();
    });

    it('should reset search if escape is pressed', () => {
      field.selectField.getFocusedOption = jest.fn(() => null);
      field.hasSearch = () => true;

      const event = document.createEvent('Event');
      event.keyCode = 27;

      field.handleKeyDown(event);

      expect(field.handleSearchReset).toBeCalled();
      expect(field.selectField.getFocusedOption).not.toBeCalled();
      expect(field.handleBack).not.toBeCalled();
      expect(field.handleNavigate).not.toBeCalled();
    });

    it('should not call anything without a focus', () => {
      field.selectField.getFocusedOption = jest.fn(() => null);

      const event = document.createEvent('Event');
      event.keyCode = 37;

      field.handleKeyDown(event);

      expect(field.handleBack).not.toBeCalled();
      expect(field.handleNavigate).not.toBeCalled();
    });

    it('should call handleBack', () => {
      field.selectField.getFocusedOption = () => ({});

      const event = document.createEvent('Event');
      event.keyCode = 37;

      field.handleKeyDown(event);

      expect(field.handleBack).toBeCalled();
    });

    it('should call handleNavigate', () => {
      field.selectField.getFocusedOption = () => ({ id: 9, count: 2 });

      const event = document.createEvent('Event');
      event.keyCode = 39;

      field.handleKeyDown(event);

      expect(field.handleNavigate).toBeCalledWith(event, 9);
    });
  });

  describe('handleBack()', () => {
    let event = null;

    beforeEach(() => {
      event = document.createEvent('Event');
      props.visible = [5, 9, 26];
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
    });

    it('should go up one level in the path', () => {
      field.handleBack(event);

      expect(props.actions.treeDropdownField.setVisible).toBeCalledWith(props.id, [5, 9]);
    });
  });

  describe('handleNavigate()', () => {
    let event = null;

    beforeEach(() => {
      event = document.createEvent('Event');
      props.visible = [5, 9];
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
    });

    it('should go to page twenty-six', () => {
      field.handleNavigate(event, 26);

      expect(props.actions.treeDropdownField.setVisible).toBeCalledWith(props.id, [5, 9, 26]);
    });

    it('should go to page twenty-seven', () => {
      field.handleNavigate(event, 27);

      expect(props.actions.treeDropdownField.setVisible).toBeCalledWith(props.id, [7, 27]);
    });
  });

  describe('getDropdownOptions()', () => {
    it('should return the root children as options when starting out', () => {
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      const options = field.getDropdownOptions();
      const optionIds = options.map((option) => option.id).sort();
      const childrenIds = props.tree.children.map((child) => child.id).sort();

      expect(optionIds[0]).toBe(childrenIds[0]);
      expect(optionIds[1]).toBe(childrenIds[1]);
    });

    it('should return an empty first option if node has no children', () => {
      props.visible = [7, 27];
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      const options = field.getDropdownOptions();

      expect(options.length).toBe(1);
      expect(options[0].id).toBe(null);
      expect(options[0].title).toBe(null);
      expect(options[0].disabled).toBe(true);
    });

    it('should include the selected value/title if node has no children', () => {
      props.visible = [7, 27];
      props.value = 35;
      props.data.valueObject = {
        id: 35,
        title: 'Selected',
      };
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      const options = field.getDropdownOptions(35);

      expect(options.length).toBe(1);
      expect(options[0].id).toBe(35);
      expect(options[0].title).toBe('Selected');
    });

    it('should include the selected value/title appended to list', () => {
      props.visible = [5, 9];
      props.value = 15;
      props.data.valueObject = {
        id: 15,
        title: 'page fifteen',
      };
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      const options = field.getDropdownOptions(35);

      expect(options.length).toBe(3);
      expect(options[0].id).toBe(15);
      expect(options[0].title).toBe('page fifteen');
    });

    it('should not include the selected value/title if no value given', () => {
      props.visible = [5, 9];
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      const options = field.getDropdownOptions();

      expect(options.length).toBe(2);
    });

    it('should include the root option when on the root path', () => {
      props.visible = [];
      props.data.hasEmptyDefault = true;
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      const options = field.getDropdownOptions();

      expect(options.length).toBe(3);
    });

    it('should not include the root option when on the root path with a search', () => {
      props.visible = [];
      props.data.showSearch = true;
      props.data.hasEmptyDefault = true;
      props.search = 'searching';

      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      const options = field.getDropdownOptions();

      expect(options.length).toBe(2);
    });
  });
});
