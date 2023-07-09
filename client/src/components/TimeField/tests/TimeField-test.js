/* global jest, test, describe, beforeEach, it, expect, modernizr */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Component as TimeField } from '../TimeField';

jest.mock('modernizr', () => ({
  inputtypes: {
    // these being false here does not impact the html5 tests below
    date: false,
    time: false
  },
}));

function makePropsHtml4(obj = {}) {
  return {
    data: {
      html5: false,
    },
    modernizr: {
      inputtypes: {
        date: false,
        time: false,
      },
    },
    ...obj
  };
}

function makePropsHtml5NoBrowserSupport(obj = {}) {
  return {
    data: {
      html5: true
    },
    modernizr: {
      inputtypes: {
        date: false,
        time: false
      }
    },
    ...obj
  };
}

function makePropsHtml5(obj = {}) {
  return {
    data: {
      html5: true
    },
    modernizr: {
      inputtypes: {
        date: true,
        time: true
      }
    },
    ...obj
  };
}

function makePropsHtml5OptedOut(obj = {}) {
  return {
    data: {
      html5: false
    },
    modernizr: {
      inputtypes: {
        date: true,
        time: true
      }
    },
    ...obj
  };
}

test('TimeField without html5 time field support onChange() should call the onChange function on props', () => {
  const onChange = jest.fn();
  const { container } = render(
    <TimeField {...makePropsHtml4({
      onChange
    })}
    />
  );
  const input = container.querySelector('input');
  fireEvent.change(input, { target: { value: 'x' } });
  expect(onChange).toBeCalled();
});

test('TimeField html5 false 03:24 AM', () => {
  const { container } = render(
    <TimeField {...makePropsHtml4({
      value: '03:24 AM',
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('value')).toBe('3:24 AM');
});

test('TimeField html5 false 03:24', () => {
  const { container } = render(
    <TimeField {...makePropsHtml4({
      value: '03:24',
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('value')).toBe('3:24 AM');
});

test('TimeField html5 false invalid time', () => {
  const { container } = render(
    <TimeField {...makePropsHtml4({
      value: 'invalid time',
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('value')).toBe('');
});

test('TimeField html5 false 04:22:39', () => {
  const { container } = render(
    <TimeField {...makePropsHtml4({
      value: '04:22:39',
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('value')).toBe('4:22 AM');
});

test('TimeField html5 true but no browser support 23:01:23', () => {
  const { container } = render(
    <TimeField {...makePropsHtml5NoBrowserSupport({
      value: '23:01:23',
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('value')).toBe('11:01 PM');
});

test('TimeField html5 true but no browser support 12:22 AM', () => {
  const { container } = render(
    <TimeField {...makePropsHtml5NoBrowserSupport({
      value: '12:22 AM',
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('value')).toBe('12:22 PM');
});

test('TimeField html5 true but no browser support invalid time', () => {
  const { container } = render(
    <TimeField {...makePropsHtml5NoBrowserSupport({
      value: 'invalid time',
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('value')).toBe('');
});

test('TimeField html5 true 23:01:23', () => {
  const { container } = render(
    <TimeField {...makePropsHtml5({
      value: '23:01:23',
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('value')).toBe('23:01:23');
});

test('TimeField html5 true should use iso format of time value in the input field', () => {
  const onChange = jest.fn();
  const { container } = render(
    <TimeField {...makePropsHtml5({
      id: 'time',
      value: '23:01:23',
      onChange
    })}
    />
  );
  const input = container.querySelector('input');
  fireEvent.change(input, { target: { id: 'time', value: '12:22:33' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'time', value: '12:22:33' }
  );
});

test('TimeField html5 opted out 23:01:23', () => {
  const { container } = render(
    <TimeField {...makePropsHtml5OptedOut({
      value: '23:01:23',
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('value')).toBe('11:01 PM');
});

test('TimeField html5 opted out should suppress HTML input even if supported', () => {
  const { container } = render(
    <TimeField {...makePropsHtml5OptedOut({
      value: '23:01:23',
    })}
    />
  );
  expect(container.querySelector('input').getAttribute('type')).toBe('text');
});
