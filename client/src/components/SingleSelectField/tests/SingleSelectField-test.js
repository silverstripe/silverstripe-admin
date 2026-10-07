/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import SingleSelectField from '../SingleSelectField';

const { fireEvent } = require('@testing-library/react');
const { Component: UnwrappedSingleSelectField } = require('../SingleSelectField');

function makeProps(obj = {}) {
  return {
    id: 'my-id',
    name: 'MyName',
    onChange: () => {},
    value: 'My value',
    readOnly: false,
    disabled: false,
    source: [],
    data: {
      emptyString: 'Any'
    },
    ...obj
  };
}

test('SingleSelectField render() renders', () => {
  const { container } = render(<SingleSelectField {...makeProps()}/>);
  expect(container.querySelectorAll('select')).toHaveLength(1);
});

test('SingleSelectField render() renders with a null value', () => {
  const { container } = render(
    <SingleSelectField {...makeProps({
      value: null
    })}
    />
  );
  expect(container.querySelectorAll('select')).toHaveLength(1);
});

test('SingleSelectField render() renders as a p tag when readOnly', () => {
  const { container } = render(
    <SingleSelectField {...makeProps({
      readOnly: true
    })}
    />
  );
  expect(container.querySelectorAll('p')).toHaveLength(1);
});

test('SingleSelectField render() renders as a p readOnly and a null value', () => {
  const { container } = render(
    <SingleSelectField {...makeProps({
      readOnly: true,
      value: null
    })}
    />
  );
  expect(container.querySelectorAll('p')).toHaveLength(1);
});

const sourceItems = [
  { value: 'a', title: 'Option A', description: 'Desc A' },
  { value: 'b', title: 'Option B', disabled: true },
];

test('SingleSelectField renders an option for each source item', () => {
  const { container } = render(
    <UnwrappedSingleSelectField {...makeProps({ source: sourceItems, value: 'a' })} />
  );
  const options = container.querySelectorAll('option');
  expect(options).toHaveLength(2);
  expect(options[0].textContent).toBe('Option A');
  expect(options[0].getAttribute('title')).toBe('Desc A');
  expect(options[1].disabled).toBe(true);
  expect(container.querySelector('select').value).toBe('a');
});

test('SingleSelectField prepends an empty option when hasEmptyDefault is set', () => {
  const { container } = render(
    <UnwrappedSingleSelectField {...makeProps({
      source: sourceItems,
      data: { hasEmptyDefault: true, emptyString: 'Pick one' },
    })}
    />
  );
  const options = container.querySelectorAll('option');
  expect(options).toHaveLength(3);
  expect(options[0].textContent).toBe('Pick one');
  expect(options[0].value).toBe('');
});

test('SingleSelectField does not add an empty option when source already has one', () => {
  const { container } = render(
    <UnwrappedSingleSelectField {...makeProps({
      source: [{ value: '', title: 'None' }, ...sourceItems],
      data: { hasEmptyDefault: true, emptyString: 'Pick one' },
    })}
    />
  );
  expect(container.querySelectorAll('option')).toHaveLength(3);
  expect(container.querySelector('option').textContent).toBe('None');
});

test('SingleSelectField does not modify the source prop when adding an empty option', () => {
  const source = [...sourceItems];
  render(
    <UnwrappedSingleSelectField {...makeProps({
      source,
      data: { hasEmptyDefault: true, emptyString: 'Pick one' },
    })}
    />
  );
  expect(source).toHaveLength(2);
});

test('SingleSelectField uses the default Any empty string when no data is given', () => {
  const props = makeProps({ source: sourceItems });
  delete props.data;
  const { container } = render(<UnwrappedSingleSelectField {...props} />);
  expect(container.querySelectorAll('option')).toHaveLength(2);
});

test('SingleSelectField applies className, extraClass, id, name and disabled to the select', () => {
  const { container } = render(
    <UnwrappedSingleSelectField {...makeProps({
      className: 'base',
      extraClass: 'extra',
      disabled: true,
    })}
    />
  );
  const select = container.querySelector('select');
  expect(select.className).toContain('base');
  expect(select.className).toContain('extra');
  expect(select.className).toContain('no-chosen');
  expect(select.id).toBe('my-id');
  expect(select.name).toBe('MyName');
  expect(select.disabled).toBe(true);
});

test('SingleSelectField calls onChange with the event and id/value', () => {
  const onChange = jest.fn();
  const { container } = render(
    <UnwrappedSingleSelectField {...makeProps({ source: sourceItems, value: 'a', onChange })} />
  );
  fireEvent.change(container.querySelector('select'), { target: { value: 'b' } });
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange.mock.calls[0][1]).toEqual({ id: 'my-id', value: 'b' });
});

test('SingleSelectField does not throw on change when onChange is not a function', () => {
  const { container } = render(
    <UnwrappedSingleSelectField {...makeProps({ source: sourceItems, onChange: undefined })} />
  );
  expect(() => {
    fireEvent.change(container.querySelector('select'), { target: { value: 'b' } });
  }).not.toThrow();
});

test('SingleSelectField readOnly renders the value in a p tag without a select', () => {
  const { container } = render(
    <UnwrappedSingleSelectField {...makeProps({
      readOnly: true,
      source: sourceItems,
      value: 'a',
      className: 'base',
      extraClass: 'extra',
    })}
    />
  );
  const p = container.querySelector('p');
  expect(p.textContent).toBe('a');
  expect(p.className).toContain('extra');
  expect(container.querySelector('select')).toBeNull();
});

test('SingleSelectField readOnly renders an empty p with a null value', () => {
  const { container } = render(
    <UnwrappedSingleSelectField {...makeProps({ readOnly: true, value: null })} />
  );
  expect(container.querySelector('p').textContent).toBe('');
});

test('SingleSelectField wrapped export renders a field holder around the select', () => {
  const { container } = render(
    <SingleSelectField {...makeProps({ source: sourceItems, title: 'My title' })} />
  );
  expect(container.querySelectorAll('select')).toHaveLength(1);
  expect(container.querySelector('.form-group')).not.toBeNull();
});
