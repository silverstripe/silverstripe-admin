/* eslint-disable no-unused-vars */
/* global jest, test, beforeAll, afterAll, expect */

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { Component as TreeDropdownField } from '../TreeDropdownField';
import mockTree from './mockTree';

let resolveApiCall;
let rejectApiCall;
let lastApiCallArgs;

jest.mock('isomorphic-fetch', () => ({
  __esModule: true,
  default: (resource, options) => {
    lastApiCallArgs = { resource, options };
    return new Promise((resolve, reject) => {
      resolveApiCall = resolve;
      rejectApiCall = reject;
    });
  }
}));

// Need to use act() when using fake timers with react-testing-library
// https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning#1-when-using-jestusefaketimers
beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

function makeProps(obj = {}) {
  return {
    id: 'Form_Test',
    name: 'Test',
    data: {
      urlTree: 'url-callback',
    },
    tree: mockTree,
    search: '',
    actions: {
      treeDropdownField: {
        beginTreeUpdating: () => null,
        updateTreeFailed: () => null,
        updateTree: () => null,
        setVisible: () => null,
        setSearch: () => null,
        addSelectedValues: () => null,
      },
    },
    fetch: () => Promise.resolve({ json: () => ({ tree: 'data' }) }),
    selectedValues: [],
    ...obj
  };
}

test('TreeDropdownField should call setVisible with selected value', async () => {
  let doResolve;
  const promise = new Promise((resolve) => {
    doResolve = resolve;
  });
  const setVisible = jest.fn(() => doResolve());
  let props = makeProps({
    findTreePath: jest.fn((data, value) => (value ? [4, value] : null))
  });
  props = {
    ...props,
    actions: {
      ...props.actions,
      treeDropdownField: {
        ...props.actions.treeDropdownField,
        setVisible
      }
    },
    value: 67,
    data: {
      valueObject: {
        id: 67
      },
      urlTree: 'foo'
    }
  };
  render(<TreeDropdownField {...props}/>);
  await promise;
  expect(setVisible).toBeCalledWith('Form_Test', [4]);
});

test('TreeDropdownField single-select should add valueObject to selectedValues', () => {
  const addSelectedValues = jest.fn();
  let props = makeProps({
    findTreePath: jest.fn((data, value) => (value ? [4, value] : null))
  });
  props = {
    ...props,
    actions: {
      ...props.actions,
      treeDropdownField: {
        ...props.actions.treeDropdownField,
        addSelectedValues
      }
    },
    value: 67,
    data: {
      valueObject: {
        id: 67
      },
      urlTree: 'foo'
    }
  };
  render(<TreeDropdownField {...props}/>);
  expect(addSelectedValues).toBeCalledWith(props.id, [{ id: 67 }]);
});

test('TreeDropdownField single-select should not call selectedValues without a valueObject', () => {
  const addSelectedValues = jest.fn();
  let props = makeProps({
    findTreePath: jest.fn((data, value) => (value ? [4, value] : null))
  });
  props = {
    ...props,
    actions: {
      ...props.actions,
      treeDropdownField: {
        ...props.actions.treeDropdownField,
        addSelectedValues
      }
    },
  };
  render(<TreeDropdownField {...props}/>);
  expect(addSelectedValues).not.toBeCalled();
});

test('TreeDropdownField multi-select should add valueObjects to selectedValues', () => {
  const addSelectedValues = jest.fn();
  let props = makeProps({
    findTreePath: jest.fn((data, value) => (value ? [4, value] : null))
  });
  props = {
    ...props,
    actions: {
      ...props.actions,
      treeDropdownField: {
        ...props.actions.treeDropdownField,
        addSelectedValues
      }
    },
    value: 67,
    data: {
      multiple: true,
      valueObjects: [
        {
          id: 67
        },
        {
          id: 12
        },
      ],
      urlTree: 'foo'
    }
  };
  render(<TreeDropdownField {...props}/>);
  expect(addSelectedValues).toBeCalledWith(props.id, [{ id: 67 }, { id: 12 }]);
});

test('TreeDropdownField multi-select should not call selectedValues without a valueObjects', () => {
  const addSelectedValues = jest.fn();
  let props = makeProps({
    findTreePath: jest.fn((data, value) => (value ? [4, value] : null))
  });
  props = {
    ...props,
    actions: {
      ...props.actions,
      treeDropdownField: {
        ...props.actions.treeDropdownField,
        addSelectedValues
      }
    },
    value: 67,
    data: {
      multiple: true,
      urlTree: 'foo'
    }
  };
  render(<TreeDropdownField {...props}/>);
  expect(addSelectedValues).not.toBeCalled();
});

test('TreeDropdownField should clear search on reset', async () => {
  let doResolve;
  const promise = new Promise((resolve) => {
    doResolve = resolve;
  });
  const setSearch = jest.fn(() => doResolve());
  const { container } = render(
    <TreeDropdownField {...makeProps({
      actions: {
        ...makeProps().actions,
        treeDropdownField: {
          ...makeProps().actions.treeDropdownField,
          setSearch
        }
      },
    })}
    />
  );
  const input = container.querySelector('.treedropdownfield__value-container input');
  // arrow down will trigger search reset
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  // ensure that 500 TreeDropdownField::SEARCH_DELAY is exceeded
  act(() => jest.runAllTimers());
  await promise;
  expect(setSearch).toBeCalled();
});

test('TreeDropdownField should set search after a delay', async () => {
  let doResolve;
  const promise = new Promise((resolve) => {
    doResolve = resolve;
  });
  const setSearch = jest.fn(() => doResolve());
  const { container } = render(
    <TreeDropdownField {...makeProps({
      actions: {
        ...makeProps().actions,
        treeDropdownField: {
          ...makeProps().actions.treeDropdownField,
          setSearch
        }
      },
      value: 67,
      data: {
        multiple: false,
        valueObjects: [
          {
            id: 67
          },
          {
            id: 12
          },
        ],
        urlTree: 'foo'
      }
    })}
    />
  );
  const input = container.querySelector('.treedropdownfield__value-container input');
  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  act(() => jest.runAllTimers());
  await promise;
  expect(setSearch).toBeCalledWith('Form_Test', '');
});

test('TreeDropdownField handleChange() single-select should return the id for the selected value', () => {
  const onChange = jest.fn();
  const addSelectedValues = jest.fn();
  const { container } = render(
    <TreeDropdownField {...makeProps({
      onChange,
      actions: {
        ...makeProps().actions,
        treeDropdownField: {
          ...makeProps().actions.treeDropdownField,
          addSelectedValues
        }
      },
      visible: [7]
    })}
    />
  );
  const input = container.querySelector('.treedropdownfield__value-container input');
  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(onChange).toHaveBeenCalledWith(27);
  expect(addSelectedValues).toHaveBeenCalledWith(
    'Form_Test', [{
      children: [],
      count: 0,
      id: 27,
      title: 'page twenty-seven'
    }]
  );
});

test('TreeDropdownField handleChange() multi-select should return an array of ids for the selected values', () => {
  const onChange = jest.fn();
  const addSelectedValues = jest.fn();
  const { container } = render(
    <TreeDropdownField {...makeProps({
      onChange,
      actions: {
        ...makeProps().actions,
        treeDropdownField: {
          ...makeProps().actions.treeDropdownField,
          addSelectedValues
        }
      },
      visible: [7]
    })}
    />
  );
  const input = container.querySelector('.treedropdownfield__value-container input');
  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  fireEvent.keyDown(input, { key: 'Enter' });
  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(onChange).toHaveBeenNthCalledWith(1, 27);
  expect(onChange).toHaveBeenNthCalledWith(2, 15);
  expect(addSelectedValues).toHaveBeenNthCalledWith(1, 'Form_Test', [{
    children: [],
    count: 0,
    id: 27,
    title: 'page twenty-seven'
  }]);
  expect(addSelectedValues).toHaveBeenNthCalledWith(2, 'Form_Test', [{
    children: [],
    count: 0,
    id: 15,
    title: 'page fifteen'
  }]);
});

test('TreeDropdownField getVisibleTree() should call findTreeByPath()', () => {
  const findTreeByPath = jest.fn();
  render(
    <TreeDropdownField {...makeProps({
      tree: {},
      visible: [1],
      findTreeByPath
    })}
    />
  );
  expect(findTreeByPath).toHaveBeenCalledWith({}, [1]);
});

test('TreeDropdownField getBreadcrumb() should traverse the path given and return the relevant nodes in the tree', () => {
  const { container } = render(
    <TreeDropdownField {...makeProps({
      visible: [5, 9, 26],
    })}
    />
  );
  const input = container.querySelector('.treedropdownfield__value-container input');
  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(container.querySelector('.treedropdownfield__breadcrumbs-crumbs').textContent).toBe('page five / page nine / page twenty-six');
});

test('TreeDropdownField getBreadcrumb() should traverse and terminate early if using a missing node', () => {
  const { container } = render(
    <TreeDropdownField {...makeProps({
      visible: [5, 8, 26],
    })}
    />
  );
  const input = container.querySelector('.treedropdownfield__value-container input');
  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(container.querySelector('.treedropdownfield__breadcrumbs-crumbs').textContent).toBe('page five');
});

test('TreeDropdownField handleBack() should go up one level in the path', () => {
  const setVisible = jest.fn();
  const { container } = render(
    <TreeDropdownField {...makeProps({
      actions: {
        ...makeProps().actions,
        treeDropdownField: {
          ...makeProps().actions.treeDropdownField,
          setVisible
        }
      },
    })}
    />
  );
  const input = container.querySelector('.treedropdownfield__value-container input');
  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  fireEvent.keyDown(input, { key: 'ArrowRight' });
  fireEvent.keyDown(input, { key: 'ArrowLeft' });
  expect(setVisible).toHaveBeenNthCalledWith(1, 'Form_Test', [5]);
  expect(setVisible).toHaveBeenNthCalledWith(2, 'Form_Test', []);
});

test('TreeDropdownField should render a readonly textbox with the selected title', () => {
  const { container, getByRole } = render(
    <TreeDropdownField {...makeProps({
      readOnly: true,
      value: 5,
      selectedValues: [{ id: 5, title: 'page five' }],
    })}
    />
  );
  expect(getByRole('textbox').textContent).toBe('page five');
  expect(container.querySelector('input[type="hidden"]').value).toBe('5');
  expect(container.querySelector('.treedropdownfield__value-container')).toBeNull();
});

test('TreeDropdownField should render joined titles when readonly and multiple', () => {
  const { getByRole } = render(
    <TreeDropdownField {...makeProps({
      disabled: true,
      value: [5, 9],
      data: { urlTree: 'foo', multiple: true },
      selectedValues: [{ id: 5, title: 'page five' }, { id: 9, title: 'page nine' }],
    })}
    />
  );
  expect(getByRole('textbox').textContent).toBe('page five, page nine');
});

test('TreeDropdownField should load the tree on mount unless readonly or disabled', () => {
  const beginTreeUpdating = jest.fn();
  const actions = {
    treeDropdownField: { ...makeProps().actions.treeDropdownField, beginTreeUpdating },
  };
  render(<TreeDropdownField {...makeProps({ actions })} />);
  expect(beginTreeUpdating).toHaveBeenCalledWith('Form_Test', []);
  beginTreeUpdating.mockClear();
  render(<TreeDropdownField {...makeProps({ actions, readOnly: true })} />);
  render(<TreeDropdownField {...makeProps({ actions, disabled: true })} />);
  expect(beginTreeUpdating).not.toHaveBeenCalled();
});

test('TreeDropdownField should request the tree url as json', () => {
  const fetch = jest.fn(() => new Promise(() => {}));
  render(<TreeDropdownField {...makeProps({ fetch, value: 67 })} />);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch.mock.calls[0][0]).toContain('url-callback');
  expect(fetch.mock.calls[0][0]).toContain('format=json');
  expect(fetch.mock.calls[0][0]).toContain('forceValue=67');
  expect(fetch.mock.calls[0][1]).toEqual({ credentials: 'same-origin' });
});

test('TreeDropdownField should reload the tree when the search, url or cache key changes', () => {
  const beginTreeUpdating = jest.fn();
  const actions = {
    treeDropdownField: { ...makeProps().actions.treeDropdownField, beginTreeUpdating },
  };
  const props = makeProps({ actions, visible: [5] });
  const { rerender } = render(<TreeDropdownField {...props} />);
  beginTreeUpdating.mockClear();
  rerender(<TreeDropdownField {...props} />);
  expect(beginTreeUpdating).not.toHaveBeenCalled();
  rerender(<TreeDropdownField {...props} search="abc" />);
  expect(beginTreeUpdating).toHaveBeenLastCalledWith('Form_Test', [5]);
  beginTreeUpdating.mockClear();
  rerender(<TreeDropdownField {...props} search="abc" data={{ urlTree: 'other' }} />);
  expect(beginTreeUpdating).toHaveBeenLastCalledWith('Form_Test', []);
  beginTreeUpdating.mockClear();
  rerender(<TreeDropdownField {...props} search="abc" data={{ urlTree: 'other', cacheKey: 'k' }} />);
  expect(beginTreeUpdating).toHaveBeenLastCalledWith('Form_Test', []);
});

test('TreeDropdownField should not reload the tree on update when readonly', () => {
  const beginTreeUpdating = jest.fn();
  const actions = {
    treeDropdownField: { ...makeProps().actions.treeDropdownField, beginTreeUpdating },
  };
  const props = makeProps({ actions, readOnly: true });
  const { rerender } = render(<TreeDropdownField {...props} />);
  rerender(<TreeDropdownField {...props} search="abc" />);
  expect(beginTreeUpdating).not.toHaveBeenCalled();
});

test('TreeDropdownField should debounce setting the search value', () => {
  const setSearch = jest.fn();
  const { container } = render(
    <TreeDropdownField {...makeProps({
      actions: {
        ...makeProps().actions,
        treeDropdownField: { ...makeProps().actions.treeDropdownField, setSearch },
      },
      data: { urlTree: 'foo', showSearch: true },
    })}
    />
  );
  const input = container.querySelector('.treedropdownfield__value-container input');
  fireEvent.change(input, { target: { value: 'a' } });
  fireEvent.change(input, { target: { value: 'ab' } });
  expect(setSearch).not.toHaveBeenCalledWith('Form_Test', 'a');
  act(() => jest.runAllTimers());
  expect(setSearch).toHaveBeenCalledWith('Form_Test', 'ab');
  expect(setSearch).not.toHaveBeenCalledWith('Form_Test', 'a');
});

test('TreeDropdownField should call onLoadingError when loading the tree fails', async () => {
  const onLoadingError = jest.fn();
  const updateTreeFailed = jest.fn();
  render(
    <TreeDropdownField {...makeProps({
      onLoadingError,
      fetch: () => Promise.reject(new Error('boom')),
      actions: {
        ...makeProps().actions,
        treeDropdownField: { ...makeProps().actions.treeDropdownField, updateTreeFailed },
      },
    })}
    />
  );
  await act(async () => { await Promise.resolve(); });
  expect(updateTreeFailed).toHaveBeenCalledWith('Form_Test', []);
  expect(onLoadingError).toHaveBeenCalledWith({ errors: [{ value: 'boom', type: 'error' }] });
});

test('TreeDropdownField should show a no options message for an empty tree', () => {
  const { container } = render(
    <TreeDropdownField {...makeProps({ tree: { children: [], count: 0 } })} />
  );
  const input = container.querySelector('.treedropdownfield__value-container input');
  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(container.querySelector('.treedropdownfield__menu').textContent).toContain('No options');
});

test('TreeDropdownField should apply extraClass', () => {
  const { container } = render(<TreeDropdownField {...makeProps({ extraClass: 'my-class' })} />);
  expect(container.querySelector('.treedropdownfield.my-class')).not.toBeNull();
});
