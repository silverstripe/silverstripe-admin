/* global jest, describe, beforeEach, it, expect, setTimeout, document */

jest.mock('components/TreeDropdownField/TreeDropdownFieldMenu');
jest.mock('isomorphic-fetch', () =>
  () => Promise.resolve({
    json: () => ({}),
  })
);

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Component as TreeDropdownField, MULTI_EMPTY_VALUE, SINGLE_EMPTY_VALUE } from '../TreeDropdownField';
import mockTree from './mockTree';

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
      tree: mockTree,
      search: '',
      actions: {
        treeDropdownField: {
          beginTreeUpdating: jest.fn(),
          updateTreeFailed: jest.fn(),
          updateTree: jest.fn(),
          setVisible: jest.fn(),
          setSearch: jest.fn(),
          addSelectedValues: jest.fn(),
        },
      },
      selectedValues: [],
    };
  });

  describe('componentDidMount()', () => {
    describe('single-select', () => {
      it('should add valueObject to selectedValues', () => {
        props.data.valueObject = { id: 67 };
        field = ReactTestUtils.renderIntoDocument(
          <TreeDropdownField {...props} />
        );

        expect(props.actions.treeDropdownField.addSelectedValues).toBeCalledWith(
          props.id,
          [{ id: 67 }]
        );
      });

      it('should not call selectedValues without a valueObject', () => {
        field = ReactTestUtils.renderIntoDocument(
          <TreeDropdownField {...props} />
        );

        expect(props.actions.treeDropdownField.addSelectedValues).not.toBeCalled();
      });
    });

    describe('multi-select', () => {
      beforeEach(() => {
        props.data.multiple = true;
      });

      it('should add valueObjects to selectedValues', () => {
        props.data.valueObjects = [{ id: 67 }, { id: 12 }];
        field = ReactTestUtils.renderIntoDocument(
          <TreeDropdownField {...props} />
        );

        expect(props.actions.treeDropdownField.addSelectedValues).toBeCalledWith(
          props.id,
          [{ id: 67 }, { id: 12 }]
        );
      });

      it('should not call selectedValues without a valueObjects', () => {
        field = ReactTestUtils.renderIntoDocument(
          <TreeDropdownField {...props} />
        );

        expect(props.actions.treeDropdownField.addSelectedValues).not.toBeCalled();
      });
    });
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

  describe('handleSearchChange()', () => {
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

  describe('handleChange()', () => {
    describe('single-select', () => {
      beforeEach(() => {
        props.onChange = jest.fn();
        props.visible = [7];

        field = ReactTestUtils.renderIntoDocument(
          <TreeDropdownField {...props} />
        );

        field.handleSearchReset = jest.fn();
        field.props.actions.treeDropdownField.addSelectedValues = jest.fn();
      });

      it('should return the id for the selected value', () => {
        field.handleChange({ id: 15 });

        expect(field.handleSearchReset).toBeCalled();
        expect(field.props.onChange).toBeCalledWith(15);
        expect(field.props.actions.treeDropdownField.addSelectedValues).toBeCalledWith(
          props.id,
          [
            {
              id: 15,
              title: 'page fifteen',
              count: 0,
              children: [],
            },
          ]
        );
      });

      it('should return "0" for no selected value', () => {
        field.handleChange(null);

        expect(field.handleSearchReset).toBeCalled();
        expect(field.props.onChange).toBeCalledWith(SINGLE_EMPTY_VALUE);
        expect(field.props.actions.treeDropdownField.addSelectedValues).not.toBeCalled();
      });
    });

    describe('multi-select', () => {
      beforeEach(() => {
        props.data.multiple = true;
        props.onChange = jest.fn();

        field = ReactTestUtils.renderIntoDocument(
          <TreeDropdownField {...props} />
        );

        field.handleSearchReset = jest.fn();
        field.props.actions.treeDropdownField.addSelectedValues = jest.fn();
      });

      it('should return an array of ids for the selected values', () => {
        field.handleChange([{ id: 15 }, { id: 65 }]);

        expect(field.handleSearchReset).toBeCalled();
        expect(field.props.onChange).toBeCalledWith([15, 65]);
        expect(field.props.actions.treeDropdownField.addSelectedValues).toBeCalledWith(
          props.id,
          [{ id: 15 }, { id: 65 }]
        );
      });

      it('should ensure unique values are selected', () => {
        field.handleChange([{ id: 15, title: 'orig' }, { id: 65 }, { id: 15, title: 'dupe' }]);

        expect(field.handleSearchReset).toBeCalled();
        expect(field.props.onChange).toBeCalledWith([15, 65]);
        expect(field.props.actions.treeDropdownField.addSelectedValues).toBeCalledWith(
          props.id,
          [{ id: 15, title: 'orig' }, { id: 65 }]
        );
      });

      it('should return "unchanged" for no selected values', () => {
        field.handleChange([]);

        expect(field.handleSearchReset).toBeCalled();
        expect(field.props.onChange).toBeCalledWith(MULTI_EMPTY_VALUE);
        expect(field.props.actions.treeDropdownField.addSelectedValues).not.toBeCalled();
      });
    });
  });

  describe('getVisibleTree()', () => {
    it('should call findTreeByPath()', () => {
      props.tree = {};
      props.visible = [1];
      props.findTreeByPath = jest.fn();

      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );

      field.getVisibleTree();

      expect(props.findTreeByPath).toBeCalledWith(props.tree, props.visible);
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

      expect(optionIds[1]).toBe(childrenIds[0]);
      expect(optionIds[2]).toBe(childrenIds[1]);
    });

    it('should return an empty option if empty value and is single select', () => {
      props.value = 0;
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      const options = field.getDropdownOptions();
      expect(options[0].id).toBe(0);
    });

    it('should return an empty first option if node has no children', () => {
      props.visible = [7, 27];
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      const options = field.getDropdownOptions();

      expect(options.length).toBe(1);
      expect(options[0].id).toBe(0);
      expect(options[0].title).toBe(null);
      expect(options[0].disabled).toBe(true);
    });

    it('should include the selected value/title if node has no children', () => {
      props.visible = [7, 27];
      props.value = 35;
      props.selectedValues = [{
        id: 35,
        title: 'Selected',
      }];
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      const options = field.getDropdownOptions();

      expect(options.map(item => item.id)).toContain(35);
    });

    it('should include the selected value/title appended to list', () => {
      props.visible = [5, 9];
      props.value = 15;
      props.selectedValues = [{
        id: 15,
        title: 'page fifteen',
      }];
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );

      const options = field.getDropdownOptions();

      expect(options.length).toBe(4);
      expect(options.map(item => item.id)).toContain(15);
    });

    it('should not include the selected value/title if no value given', () => {
      props.visible = [5, 9];
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      const options = field.getDropdownOptions();

      expect(options.length).toBe(3);
      expect(options.map(item => item.id)).toContain(14);
      expect(options.map(item => item.id)).toContain(26);
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

      expect(options.length).toBe(3);
    });

    it('should show the path for the selected option', () => {
      props.visible = [7, 27];
      props.data.showSelectedPath = true;
      props.value = 35;
      props.selectedValues = [{
        id: 35,
        title: 'Selected',
        titlePath: 'Selected full path',
      }];
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      const options = field.getDropdownOptions();

      expect(options.map(item => item.id)).toContain(35);
      expect(options.map(item => item.title)).toContain('Selected full path');
    });

    it('should not show the path for the selected option if it is opened', () => {
      props.visible = [7, 27];
      props.data.showSelectedPath = true;
      props.value = 35;
      props.selectedValues = [{
        id: 35,
        title: 'Selected',
        titlePath: 'Selected full path',
      }];
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      field.state.opened = true;
      const options = field.getDropdownOptions();

      expect(options.map(item => item.id)).toContain(35);
      expect(options.map(item => item.title)).toContain('Selected');
    });
  });

  describe('filterOptions()', () => {
    let options = null;

    beforeEach(() => {
      options = [
        { id: 57 },
        { id: 68, title: 'sixty eight' },
        { id: 5, title: 'five' },
      ];
    });

    it('should not filter any options if search is not set and no "parent"', () => {
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      field.getVisibleTree = () => null;

      const newOptions = field.filterOptions(options);

      expect(newOptions).toEqual(options);
    });

    it('should filter options not belonging to a parent when no search', () => {
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      field.getVisibleTree = () => props.tree;

      const newOptions = field.filterOptions(options);

      expect(newOptions).toEqual([{ id: 5, title: 'five' }]);
    });

    it('should filter titles that do not contain "i"', () => {
      props.search = 'i';
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      field.getVisibleTree = () => null;

      const newOptions = field.filterOptions(options);

      expect(newOptions).toEqual(options.filter(item => item.id !== 57));
    });
  });

  describe('getPath()', () => {
    it('should return a breadcrumb path separated by /', () => {
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      const path = field.getPath(26);

      expect(path).toBe('page five/page nine/page twenty-six/');
    });
    it('should return a blank if path is not found', () => {
      field = ReactTestUtils.renderIntoDocument(
        <TreeDropdownField {...props} />
      );
      const path = field.getPath(255);

      expect(path).toBe('');
    });
  });
});
