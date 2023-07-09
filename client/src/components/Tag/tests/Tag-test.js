/* global jest, test, describe, it, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Tag from '../Tag';

test('Tag defaults to key', () => {
  const { container } = render(
    <Tag {...{
      dataKey: 'MyTagKey',
    }}
    />
  );
  expect(container.querySelector('.tag-component').innerHTML).toBe('MyTagKey');
});

test('Tag label', () => {
  const { container } = render(
    <Tag {...{
      dataKey: 'MyTagKey',
      label: 'My Tag Label'
    }}
    />
  );
  expect(container.querySelector('.tag-component').innerHTML).toBe('My Tag Label');
});

test('Tag children overrides label', () => {
  const { container } = render(
    <Tag {...{
      dataKey: 'MyTagKey',
      label: 'My Tag Label'
    }}
    >
      Your label means nothing to my children
    </Tag>
  );
  expect(container.querySelector('.tag-component').innerHTML).toBe('Your label means nothing to my children');
});

test('Tag value', () => {
  const { container } = render(
    <Tag {...{
      dataKey: 'MyTagKey',
      value: '123'
    }}
    />
  );
  expect(container.querySelector('.tag-component').innerHTML).toBe('MyTagKey: 123');
});

test('Tag value and label', () => {
  const { container } = render(
    <Tag {...{
      dataKey: 'MyTagKey',
      label: 'My Tag Label',
      value: '123'
    }}
    />
  );
  expect(container.querySelector('.tag-component').innerHTML).toBe('My Tag Label: 123');
});

test('Tag deleteable', () => {
  const { container } = render(
    <Tag {...{
      dataKey: 'MyTagKey',
      deletable: true
    }}
    />
  );
  expect(container.querySelectorAll('.tag-component__delete')).toHaveLength(1);
});

test('Tag not deleteable', () => {
  const { container } = render(
    <Tag {...{
      dataKey: 'MyTagKey',
      deletable: false
    }}
    />
  );
  expect(container.querySelectorAll('.tag-component__delete')).toHaveLength(0);
});

test('Tag focusable', () => {
  const { container } = render(
    <Tag {...{
      dataKey: 'MyTagKey',
    }}
    />
  );
  expect(container.querySelector('.tag-component').getAttribute('tabindex')).toBe('0');
});

test('Tag not focusable', () => {
  const { container } = render(
    <Tag {...{
      dataKey: 'MyTagKey',
      focusable: false
    }}
    />
  );
  expect(container.querySelector('.tag-component').hasAttribute('tabindex')).toBe(false);
});

test('Tag deleteable focusable', () => {
  const { container } = render(
    <Tag {...{
      dataKey: 'MyTagKey',
      deletable: true
    }}
    />
  );
  expect(container.querySelector('.tag-component').getAttribute('tabindex')).toBe('0');
  expect(container.querySelectorAll('.tag-component__delete')).toHaveLength(1);
});

test('Tag deleteable not focusable', () => {
  const { container } = render(
    <Tag {...{
      dataKey: 'MyTagKey',
      deletable: true,
      focusable: false
    }}
    />
  );
  expect(container.querySelector('.tag-component').hasAttribute('tabindex')).toBe(false);
  expect(container.querySelector('.tag-component__delete').getAttribute('tabindex')).toBe('-1');
});

test('Tag Handlers onClick', () => {
  const onClick = jest.fn();
  const { container } = render(
    <Tag {...{
      dataKey: 'MyTagKey',
      onClick
    }}
    />
  );
  const span = container.querySelector('span');
  fireEvent.click(span, {});
  expect(onClick).toBeCalledWith('MyTagKey');
});

test('Tag Handlers onDelete', () => {
  const onDelete = jest.fn();
  const { container } = render(
    <Tag {...{
      dataKey: 'MyTagKey',
      onDelete,
      deletable: true
    }}
    />
  );
  const button = container.querySelector('.tag-component__delete');
  fireEvent.click(button, {});
  expect(onDelete).toBeCalledWith('MyTagKey');
});

test('Tag Handlers onKeyDown', () => {
  const handlers = {
    onDeleteKey: jest.fn(),
    onBackSpace: jest.fn(),
    onPrevious: jest.fn(),
    onNext: jest.fn(),
    onClick: jest.fn()
  };
  const props = {
    ...handlers,
    dataKey: 'MyTagKey',
    deletable: true
  };
  const { container } = render(<Tag {...props}/>);
  const span = container.querySelector('.tag-component');
  fireEvent.keyDown(span, { key: 'Delete' });
  fireEvent.keyDown(span, { key: 'Backspace' });
  fireEvent.keyDown(span, { key: 'ArrowLeft' });
  fireEvent.keyDown(span, { key: 'ArrowRight' });
  fireEvent.keyDown(span, { key: 'Enter' }); // Random one
  expect(handlers.onDeleteKey).toBeCalledWith('MyTagKey');
  expect(handlers.onBackSpace).toBeCalledWith('MyTagKey');
  expect(handlers.onPrevious).toBeCalledWith('MyTagKey');
  expect(handlers.onPrevious).toBeCalledWith('MyTagKey');
});
