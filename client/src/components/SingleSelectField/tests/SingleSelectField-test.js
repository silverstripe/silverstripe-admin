/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import SingleSelectField, { Component as SingleSelectFieldComponent } from '../SingleSelectField';

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

function makeSource(obj = []) {
  return [
    {
      value: 'published',
      title: 'Published',
      description: 'Published option'
    },
    {
      value: 'draft',
      title: 'Draft',
      disabled: true
    },
    ...obj
  ];
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

test('SingleSelectField renders with default props on the unwrapped component', () => {
  const { container } = render(<SingleSelectFieldComponent name="MyName" />);
  expect(container.querySelectorAll('select')).toHaveLength(1);
});

test('SingleSelectField applies select attributes and classes', () => {
  const { container } = render(
    <SingleSelectFieldComponent
      {...makeProps({
        className: 'base-class',
        extraClass: 'extra-class',
        disabled: true
      })}
    />
  );

  const select = container.querySelector('select');
  expect(select.className).toContain('base-class');
  expect(select.className).toContain('extra-class');
  expect(select.className).toContain('no-chosen');
  expect(select.getAttribute('id')).toBe('my-id');
  expect(select.getAttribute('name')).toBe('MyName');
  expect(select.disabled).toBe(true);
});

test('SingleSelectField adds an empty option when hasEmptyDefault is enabled', () => {
  const { container } = render(
    <SingleSelectFieldComponent
      {...makeProps({
        source: makeSource(),
        data: {
          hasEmptyDefault: true,
          emptyString: 'Any value'
        }
      })}
    />
  );

  const options = container.querySelectorAll('option');
  expect(options).toHaveLength(3);
  expect(options[0].value).toBe('');
  expect(options[0].textContent).toBe('Any value');
});

test('SingleSelectField does not duplicate an existing empty option', () => {
  const { container } = render(
    <SingleSelectFieldComponent
      {...makeProps({
        source: makeSource([{
          value: '',
          title: 'No selection'
        }]),
        data: {
          hasEmptyDefault: true,
          emptyString: 'Any value'
        }
      })}
    />
  );

  const options = Array.from(container.querySelectorAll('option'));
  expect(options).toHaveLength(3);
  expect(options.filter((option) => option.value === '')).toHaveLength(1);
  expect(options[2].textContent).toBe('No selection');
});

test('SingleSelectField renders option metadata from the source', () => {
  const { container } = render(
    <SingleSelectFieldComponent
      {...makeProps({
        source: makeSource()
      })}
    />
  );

  const options = container.querySelectorAll('option');
  const publishedOption = options[0];
  const draftOption = options[1];

  expect(publishedOption.getAttribute('title')).toBe('Published option');
  expect(draftOption.disabled).toBe(true);
});

test('SingleSelectField calls onChange with the field id and selected value', () => {
  const onChange = jest.fn();
  const { container } = render(
    <SingleSelectFieldComponent
      {...makeProps({
        onChange,
        source: makeSource()
      })}
    />
  );

  const select = container.querySelector('select');
  select.value = 'draft';
  select.dispatchEvent(new Event('change', { bubbles: true }));

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange.mock.calls[0][0].target.name).toBe('MyName');
  expect(onChange.mock.calls[0][1]).toEqual({
    id: 'my-id',
    value: 'draft'
  });
});

test('SingleSelectField renders the raw value in readonly mode', () => {
  const { container } = render(
    <SingleSelectFieldComponent
      {...makeProps({
        readOnly: true,
        source: makeSource()
      })}
    />
  );

  const readonlyField = container.querySelector('p');
  expect(readonlyField.textContent).toBe('My value');
  expect(readonlyField.getAttribute('name')).toBe('MyName');
});

test('SingleSelectField renders an empty select when source is null', () => {
  const { container } = render(
    <SingleSelectFieldComponent
      {...makeProps({
        source: null
      })}
    />
  );

  expect(container.querySelectorAll('option')).toHaveLength(0);
});
