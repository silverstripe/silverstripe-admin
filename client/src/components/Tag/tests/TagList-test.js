/* global jest, test, describe, it, expect */

import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import TagList from '../TagList';

function makeProps(obj = {}) {
  return {
    tags: [
      { key: 'justKey' },
      { key: 'KeyPair', value: '123' },
      { key: 'KeyLabel', label: 'Some label' },
      { key: 'KeyPairLabel', label: 'Some label', value: '123' }
    ],
    ...obj
  };
}

test('TagList renders simple tags', () => {
  const { container } = render(<TagList {...makeProps()}/>);
  const tags = container.querySelectorAll('.tag-list .tag-component');
  expect(tags).toHaveLength(4);
  expect(tags[0].innerHTML).toEqual('justKey');
  expect(tags[1].innerHTML).toEqual('KeyPair: 123');
  expect(tags[2].innerHTML).toEqual('Some label');
  expect(tags[3].innerHTML).toEqual('Some label: 123');
  tags.forEach((tag) => {
    expect(tag.getAttribute('tabindex')).toEqual('0');
    expect(tag.querySelector('.tag-component__delete')).toEqual(null);
  });
});

test('TagList renders deletable tags', () => {
  const { container } = render(<TagList {...makeProps({
    deletable: true
  })}
  />);
  const tags = container.querySelectorAll('.tag-list .tag-component');
  expect(tags).toHaveLength(4);
  tags.forEach((tag) => {
    expect(tag.getAttribute('tabindex')).toEqual('0');
    expect(tag.querySelector('.tag-component__delete')).not.toEqual(null);
  });
});

test('TagList renders unfocusable tags', () => {
  const { container } = render(<TagList {...makeProps({
    focusable: false
  })}
  />);
  const tags = container.querySelectorAll('.tag-list .tag-component');
  expect(tags).toHaveLength(4);
  tags.forEach((tag) => {
    expect(tag.getAttribute('tabindex')).toEqual(null);
    expect(tag.querySelector('.tag-component__delete')).toEqual(null);
  });
});

test('TagList handlers()', () => {
  const onTagClick = jest.fn();
  const onTagDelete = jest.fn();
  const { container } = render(<TagList {...makeProps({
    deletable: true,
    onTagClick,
    onTagDelete
  })}
  />);
  const tags = container.querySelectorAll('.tag-list .tag-component');
  expect(tags).toHaveLength(4);
  fireEvent.click(tags[1]);
  tags[1].click();
  expect(onTagClick).toBeCalledWith('KeyPair');
  fireEvent.click(tags[2].querySelector('.tag-component__delete'));
  expect(onTagDelete).toBeCalledWith('KeyLabel');
  fireEvent.click(tags[3].querySelector('.tag-component__delete'));
  expect(onTagDelete).toBeCalledWith('KeyPairLabel');
});

test('TagList handlers() - backspace', () => {
  const onTagDelete = jest.fn();
  const { container } = render(<TagList {...makeProps({
    deletable: true,
    onTagDelete
  })}
  />);
  const tags = container.querySelectorAll('.tag-list .tag-component');
  fireEvent.keyDown(tags[3], { key: 'Backspace' });
  expect(onTagDelete).toBeCalledWith('KeyPairLabel');
});

test('TagList handlers() - delete', () => {
  const onTagDelete = jest.fn();
  const { container } = render(<TagList {...makeProps({
    deletable: true,
    onTagDelete
  })}
  />);
  const tags = container.querySelectorAll('.tag-list .tag-component');
  fireEvent.keyDown(tags[3], { key: 'Delete' });
  expect(onTagDelete).toBeCalledWith('KeyPairLabel');
});
