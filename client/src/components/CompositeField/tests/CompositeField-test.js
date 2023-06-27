/* global jest, test, describe, beforeEach, it, expect, Event */

import React from 'react';
import { render } from '@testing-library/react';
import { Component as CompositeField } from '../CompositeField';

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
