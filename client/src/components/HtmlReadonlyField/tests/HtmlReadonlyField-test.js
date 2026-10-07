/* global jest, test, expect */

import React from 'react';
import { render } from '@testing-library/react';
import HtmlReadonlyField, { Component as UnwrappedHtmlReadonlyField } from '../HtmlReadonlyField';

const makeProps = (obj = {}) => ({
  id: 'field-id',
  name: 'MyField',
  value: '<strong>Bold</strong> text',
  ...obj,
});

test('HtmlReadonlyField renders a paragraph with id and name', () => {
  const { container } = render(<UnwrappedHtmlReadonlyField {...makeProps()} />);
  const p = container.querySelector('p');
  expect(p).not.toBeNull();
  expect(p.id).toBe('field-id');
  expect(p.getAttribute('name')).toBe('MyField');
});

test('HtmlReadonlyField renders value as raw HTML', () => {
  const { container } = render(<UnwrappedHtmlReadonlyField {...makeProps()} />);
  expect(container.querySelector('p strong').textContent).toBe('Bold');
  expect(container.querySelector('p').textContent).toBe('Bold text');
});

test('HtmlReadonlyField uses plaintext styling', () => {
  const { container } = render(<UnwrappedHtmlReadonlyField {...makeProps()} />);
  expect(container.querySelector('p').classList.contains('form-control-plaintext')).toBe(true);
});

test('HtmlReadonlyField applies className and extraClass', () => {
  const { container } = render(
    <UnwrappedHtmlReadonlyField {...makeProps({ className: 'holder', extraClass: 'extra' })} />
  );
  const p = container.querySelector('p');
  expect(p.classList.contains('holder')).toBe(true);
  expect(p.classList.contains('extra')).toBe(true);
});

test('HtmlReadonlyField defaults className and extraClass to empty strings', () => {
  const { container } = render(<UnwrappedHtmlReadonlyField {...makeProps()} />);
  expect(container.querySelector('p').className).not.toMatch(/undefined/);
});

test('HtmlReadonlyField renders empty when value is missing', () => {
  const { container } = render(<UnwrappedHtmlReadonlyField {...makeProps({ value: undefined })} />);
  expect(container.querySelector('p').innerHTML).toBe('');
});

test('HtmlReadonlyField wrapped export renders the value', () => {
  const { container } = render(<HtmlReadonlyField {...makeProps()} />);
  expect(container.querySelector('p strong').textContent).toBe('Bold');
});
