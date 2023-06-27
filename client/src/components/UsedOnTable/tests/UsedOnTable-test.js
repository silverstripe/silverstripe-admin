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
        url: 'http://www.bob.co.nz',
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
  const Provider = provideUsedOnData(mockComponent).Component;
  render(<Provider {...props}/>);
  expect(loadUsedOn).toBeCalledWith('abc', 'get', 'http://www.bob.co.nz');
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

test('UsedOnTable should add a link to table cells if the property is provided', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [
      { id: 'abc', title: 'now I know', type: 'Page', ancestors: [], link: 'http://www.silverstripe.org/' },
    ]
  })}
  />);
  const td = container.querySelectorAll('.used-on__cell-link');
  expect(td[1].textContent).toContain('now I know');
  expect(td[1].tagName).toBe('A');
  expect(td[1].href).toBe('http://www.silverstripe.org/');
});

test('UsedOnTable should add a link to table cell if an link is blank and ancestor link is not', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [
      { id: 'abc', title: 'now I know', type: 'Page', ancestors: [{ title: 'Trees', link: 'http://www.silverstripe.org/trees' }], link: '' },
    ]
  })}
  />);
  const td = container.querySelectorAll('.used-on__cell-link');
  expect(td[1].textContent).toContain('now I know');
  expect(td[1].tagName).toBe('A');
  expect(td[1].href).toBe('http://www.silverstripe.org/trees');
});

test('UsedOnTable should add a hash link to table cells if no link is provided anywhere', () => {
  const { container } = render(<UsedOnTable {...makeProps({
    usedOn: [
      { id: 'abc', title: 'now I know', type: 'Page', ancestors: [{ title: 'Flowers', link: '' }], link: '' },
    ]
  })}
  />);
  const td = container.querySelectorAll('.used-on__cell-link');
  expect(td[1].textContent).toContain('now I know');
  expect(td[1].tagName).toBe('A');
  // Will probably be "http://localhost/#"
  expect(td[1].href.substr(-1)).toBe('#');
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
