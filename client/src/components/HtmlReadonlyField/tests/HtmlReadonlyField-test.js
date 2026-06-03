/* global jest, test, expect */

import React from 'react';
import { render } from '@testing-library/react';
import WrappedHtmlReadonlyField, { Component as HtmlReadonlyField } from '../HtmlReadonlyField';

function makeProps(obj = {}) {
  return {
    id: 'my-id',
    name: 'MyName',
    extraClass: '',
    className: '',
    value: '<b>Hello</b>',
    ...obj
  };
}

test('HtmlReadonlyField renders without errors with minimal props', () => {
  const { container } = render(<HtmlReadonlyField {...makeProps()} />);
  expect(container.querySelectorAll('p')).toHaveLength(1);
});

test('HtmlReadonlyField renders a p tag with plaintext class', () => {
  const { container } = render(<HtmlReadonlyField {...makeProps()} />);
  const p = container.querySelector('p');
  expect(p).not.toBeNull();
  expect(p.classList.contains('form-control-plaintext')).toBe(true);
});

test('HtmlReadonlyField renders the value as inner HTML', () => {
  const { container } = render(
    <HtmlReadonlyField {...makeProps({ value: '<em>Test</em>' })} />
  );
  const p = container.querySelector('p');
  expect(p.innerHTML).toBe('<em>Test</em>');
});

test('HtmlReadonlyField applies id to the element', () => {
  const { container } = render(
    <HtmlReadonlyField {...makeProps({ id: 'field-123' })} />
  );
  const p = container.querySelector('p');
  expect(p.getAttribute('id')).toBe('field-123');
});

test('HtmlReadonlyField applies name to the element', () => {
  const { container } = render(
    <HtmlReadonlyField {...makeProps({ name: 'FieldName' })} />
  );
  const p = container.querySelector('p');
  expect(p.getAttribute('name')).toBe('FieldName');
});

test('HtmlReadonlyField applies className and extraClass to the element', () => {
  const { container } = render(
    <HtmlReadonlyField {...makeProps({ className: 'foo', extraClass: 'bar' })} />
  );
  const p = container.querySelector('p');
  expect(p.classList.contains('foo')).toBe(true);
  expect(p.classList.contains('bar')).toBe(true);
});

test('HtmlReadonlyField renders with empty value', () => {
  const { container } = render(
    <HtmlReadonlyField {...makeProps({ value: '' })} />
  );
  const p = container.querySelector('p');
  expect(p).not.toBeNull();
  expect(p.innerHTML).toBe('');
});

test('HtmlReadonlyField renders with undefined value', () => {
  const { container } = render(
    <HtmlReadonlyField {...makeProps({ value: undefined })} />
  );
  expect(container.querySelectorAll('p')).toHaveLength(1);
});

test('HtmlReadonlyField default export is wrapped with fieldHolder', () => {
  expect(typeof WrappedHtmlReadonlyField).toBe('function');
});
