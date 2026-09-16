/* global jest, test, expect */

import React from 'react';
import { render, screen } from '@testing-library/react';
import CompositeFieldDefault, { Component as CompositeField, getClassName, getLegend } from '../CompositeField';

const makeProps = (overrides = {}) => ({
  data: {
    tag: 'fieldset',
    legend: 'my legend',
  },
  className: 'myclass',
  extraClass: '',
  ...overrides,
});

test('CompositeField renders', () => {
  const { container } = render(
    <CompositeField {...{
      data: {
        tag: 'blockquote',
        legend: 'my legend',
      },
      className: 'myclassname',
      extraClass: 'myextraclass',
    }}
    >
      <input name="child1" />
      <input name="child2" />
    </CompositeField>
  );
  const blockquote = container.querySelector('div blockquote');
  expect(blockquote.classList).toContain('myclassname');
  expect(blockquote.classList).toContain('myextraclass');
  const inputs = blockquote.querySelectorAll('input');
  expect(inputs[0].getAttribute('name')).toBe('child1');
  expect(inputs[1].getAttribute('name')).toBe('child2');
});

test('CompositeField defaults', () => {
  const { container } = render(
    <CompositeField {...{
      data: {
        tag: '',
        legend: '',
      },
      className: '',
      extraClass: '',
    }}
    >
      <input name="child1" />
      <input name="child2" />
    </CompositeField>
  );
  expect(container.tagName).toBe('DIV');
  expect(container.classList).toHaveLength(0);
  const inputs = container.querySelectorAll('input');
  expect(inputs[0].getAttribute('name')).toBe('child1');
  expect(inputs[1].getAttribute('name')).toBe('child2');
});

test('CompositeField getLegend() returns null when the legend is undefined', () => {
  const { container } = render(
    <CompositeField {...{
      data: {
        tag: 'fieldset',
        legend: '',
      },
      className: 'myclass',
    }}
    >
      <input name="child1" />
      <input name="child2" />
    </CompositeField>
  );
  expect(container.querySelector('legend')).toBeNull();
});

test('CompositeField getLegend() returns null when the tag is not a fieldset', () => {
  const { container } = render(
    <CompositeField {...{
      data: {
        tag: 'p',
        legend: 'my legend',
      },
      className: 'myclass',
    }}
    >
      <input name="child1" />
      <input name="child2" />
    </CompositeField>
  );
  expect(container.querySelector('legend')).toBeNull();
  expect(container.textContent).not.toContain('my legend');
});

test('CompositeField getLegend() returns a legend tag', () => {
  const { container } = render(
    <CompositeField {...{
      data: {
        tag: 'fieldset',
        legend: 'my legend',
      },
      className: 'myclass',
    }}
    >
      <input name="child1" />
      <input name="child2" />
    </CompositeField>
  );
  const legend = container.querySelector('legend');
  expect(legend.textContent).toBe('my legend');
});

test('CompositeField default export renders with minimal props', () => {
  const { container } = render(
    <CompositeFieldDefault data={[]}>
      <span>child content</span>
    </CompositeFieldDefault>
  );
  expect(container.firstChild.tagName).toBe('DIV');
  expect(container.firstChild.classList).toHaveLength(0);
  expect(container.querySelector('legend')).toBeNull();
  expect(screen.getByText('child content').tagName).toBe('SPAN');
});

test('CompositeField re-exports helper functions for downstream consumers', () => {
  expect(getClassName({ className: 'myclass', extraClass: 'myextra' })).toBe('myclass myextra');
  expect(getLegend(makeProps().data).props.children).toBe('my legend');
});

test('CompositeField renders extraClass when className is omitted', () => {
  const { container } = render(
    <CompositeField {...makeProps({
      className: undefined,
      extraClass: 'only-extra',
    })}
    >
      <span>child content</span>
    </CompositeField>
  );
  const fieldset = container.querySelector('fieldset');
  expect(fieldset.classList).toContain('only-extra');
  expect(container.querySelector('legend').textContent).toBe('my legend');
});

test('CompositeField falls back to a div and ignores legends when no tag is provided', () => {
  const { container } = render(
    <CompositeField {...makeProps({
      data: {
        legend: 'my legend',
      },
    })}
    >
      <span>child content</span>
    </CompositeField>
  );
  expect(container.firstChild.tagName).toBe('DIV');
  expect(container.querySelector('legend')).toBeNull();
  expect(container.textContent).toContain('child content');
  expect(container.textContent).not.toContain('my legend');
});
