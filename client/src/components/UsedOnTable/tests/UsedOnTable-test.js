/* global jest, test, describe, beforeEach, it, expect */
import React from 'react';
import { render } from '@testing-library/react';
import { Component as UsedOnTable } from '../UsedOnTable';
import provideUsedOnData from '../provideUsedOnData';

function makeProps(obj = {}) {
  return {
    identifier: 'abc',
    loading: false,
    usedOn: null,
    tabContext: false,
    data: {
      readUsageEndpoint: {
        url: 'http://api.example.com',
        method: 'get',
      },
    },
    forceFetch: true,
    loadUsedOn: () => {},
    ...obj
  };
}

test('UsedOnTable provideUsedOnData HOC should try to load data onMount', () => {
  const loadUsedOn = jest.fn();
  const props = makeProps({
    loadUsedOn
  });
  const mockComponent = jest.fn((givenProps) => {
    // test that props are just passed through
    expect(givenProps).toEqual(props);
    return null;
  });
  const WrappedComponent = provideUsedOnData(mockComponent);
  // This it to work with both class and functional components
  const Provider = WrappedComponent.Component || WrappedComponent;
  render(<Provider {...props}/>);
  expect(loadUsedOn).toBeCalledWith('abc', 'get', 'http://api.example.com');
  expect(mockComponent).toBeCalled();
});

test('UsedOnTable should show a loading message when needed', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    loading: true,
  })}
  />);
  const column = container.querySelector('.used-on__message--loading');
  expect(column).not.toBeNull();
  expect(column.innerHTML).toContain('cms-content-loading-spinner');
});

test('UsedOnTable should not show a loading message if loading and there are already results', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    loading: true,
    usedOn: [
      { id: 'abc', title: 'now I know', type: 'Page', ancestors: [] },
    ]
  })}
  />);
  expect(container.querySelector('.used-on__message--loading')).toBeNull();
});

test('UsedOnTable should show a empty message when there are no results', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [],
  })}
  />);
  const column = container.querySelector('.used-on__message--empty');
  expect(column).not.toBeNull();
  expect(column.innerHTML).toContain('not in use');
});

test('UsedOnTable should show the error message if there was an error provided', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    error: 'bob did it',
  })}
  />);
  const column = container.querySelector('.used-on__message--error');
  expect(column).not.toBeNull();
  expect(column.innerHTML).toContain('bob did it');
});

test('UsedOnTable should convert index to 1-based count', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [
      { id: 'abc', title: 'now I know', type: 'Page', ancestors: [] },
    ]
  })}
  />);
  const index = container.querySelector('.used-on__col--index');
  expect(index.textContent).toBe('#');
  // index we're testing
  const count = container.querySelectorAll('.used-on__col--index')[1];
  expect(count.textContent).toBe('1');
});

test('UsedOnTable should add a link to table cells with correct priority (item > ancestor > hash)', () => {
  const { container: container1 } = render(<UsedOnTable {...makeProps({
    usedOn: [
      { id: 'abc', title: 'Item Link', type: 'Page', ancestors: [], link: 'http://item.example.com/' },
    ]
  })}
  />);
  const td1 = container1.querySelectorAll('.used-on__cell-link')[1];
  expect(td1.href).toBe('http://item.example.com/');

  const { container: container2 } = render(<UsedOnTable {...makeProps({
    usedOn: [
      { id: 'abc', title: 'Ancestor Link', type: 'Page', ancestors: [{ title: 'Trees', link: 'http://trees.example.com/' }], link: '' },
    ]
  })}
  />);
  const td2 = container2.querySelectorAll('.used-on__cell-link')[1];
  expect(td2.href).toBe('http://trees.example.com/');

  const { container: container3 } = render(<UsedOnTable {...makeProps({
    usedOn: [
      { id: 'abc', title: 'No Link', type: 'Page', ancestors: [{ title: 'Flowers', link: '' }], link: '' },
    ]
  })}
  />);
  const td3 = container3.querySelectorAll('.used-on__cell-link')[1];
  expect(td3.href.substr(-1)).toBe('#');
});

test('UsedOnTable should show the title provided', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [
      { id: 'abc', title: 'now I know', type: 'Boom!', ancestors: [] },
    ]
  })}
  />);
  const type = container.querySelectorAll('.used-on__type');
  expect(type[0].textContent).toContain('Boom!');
});

test('UsedOnTable should truncate long titles to 25 characters', () => {
  const longTitle = 'This is a very long title that should be truncated';
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [
      { id: 'abc', title: longTitle, type: 'Page', ancestors: [] },
    ]
  })}
  />);
  const titleItem = container.querySelector('.used-on__title-item');
  expect(titleItem.textContent).toBe('This is a very long title...');
  expect(titleItem.textContent.length).toBe(28);
});

test('UsedOnTable should not truncate short titles', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [
      { id: 'abc', title: 'Short', type: 'Page', ancestors: [] },
    ]
  })}
  />);
  const titleItem = container.querySelector('.used-on__title-item');
  expect(titleItem.textContent).toBe('Short');
});

test('UsedOnTable should render multiple rows', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [
      { id: 'abc', title: 'First', type: 'Page', ancestors: [] },
      { id: 'def', title: 'Second', type: 'BlogPost', ancestors: [] },
      { id: 'ghi', title: 'Third', type: 'File', ancestors: [] },
    ]
  })}
  />);
  const rows = container.querySelectorAll('.used-on__row');
  expect(rows).toHaveLength(3);
});

test('UsedOnTable should render ancestors in correct order', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [
      {
        id: 'abc',
        title: 'Child',
        type: 'Page',
        ancestors: [
          { title: 'Grandparent', link: 'http://grandparent.example.com' },
          { title: 'Parent', link: 'http://parent.example.com' },
        ],
      },
    ]
  })}
  />);
  const titleItems = container.querySelectorAll('.used-on__title-item');
  expect(titleItems[0].textContent).toBe('Parent');
  expect(titleItems[1].textContent).toBe('Grandparent');
  expect(titleItems[2].textContent).toBe('Child');
});

test('UsedOnTable should mark first title item with correct class', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [
      {
        id: 'abc',
        title: 'Child',
        type: 'Page',
        ancestors: [
          { title: 'Parent', link: 'http://parent.example.com' },
        ],
      },
    ]
  })}
  />);
  const firstItem = container.querySelector('.used-on__title-item--first');
  expect(firstItem).not.toBeNull();
  expect(firstItem.textContent).toBe('Parent');
});
