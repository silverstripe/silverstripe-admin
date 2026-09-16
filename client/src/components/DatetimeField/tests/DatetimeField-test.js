/* global jest, test, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DatetimeFieldWrapper, { Component as DatetimeField } from '../DatetimeField';

jest.mock('modernizr', () => ({
  inputtypes: {
    'datetime-local': false,
  },
}));

function getSharedProps() {
  return {
    id: 'date',
    title: '',
    name: '',
    value: ''
  };
}

function makePropsHtml4(obj = {}) {
  return {
    data: {
      html5: false,
    },
    modernizr: {
      inputtypes: {
        'datetime-local': false,
      },
    },
    ...getSharedProps(),
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
        'datetime-local': true,
      }
    },
    ...getSharedProps(),
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
        'datetime-local': false,
      }
    },
    ...getSharedProps(),
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
        'datetime-local': true,
      }
    },
    ...getSharedProps(),
    ...obj
  };
}

test('DatetimeField renders input with minimal props', () => {
  const { container } = render(
    <DatetimeField {...makePropsHtml4()} />
  );
  const input = container.querySelector('input');
  expect(input).not.toBeNull();
  expect(input.className).not.toContain('undefined');
});

test('DatetimeField renders with missing modernizr and data props', () => {
  const { container } = render(
    <DatetimeField {...getSharedProps()} />
  );
  const input = container.querySelector('input#date');
  expect(input).not.toBeNull();
  expect(input.getAttribute('type')).toBe('text');
});

test('DatetimeField html5 uses datetime-local input type', () => {
  const { container } = render(
    <DatetimeField {...makePropsHtml5({
      lang: 'en_NZ',
    })}
    />
  );
  const input = container.querySelector('input#date');
  expect(input.getAttribute('type')).toBe('datetime-local');
});

test('DatetimeField should pass through onBlur handler', () => {
  const onBlur = jest.fn();
  const { container } = render(
    <DatetimeField {...makePropsHtml4({
      onBlur,
    })}
    />
  );
  const input = container.querySelector('input#date');
  fireEvent.blur(input);
  expect(onBlur).toBeCalledTimes(1);
});

test('DatetimeField html5 adds seconds for datetime-local values', () => {
  const onChange = jest.fn();
  const { container } = render(
    <DatetimeField {...makePropsHtml5({
      onChange
    })}
    />
  );
  const input = container.querySelector('input#date');
  fireEvent.change(input, { target: { value: '2023-01-30T13:22' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'date', value: '2023-01-30T13:22:00' }
  );
});

test('DatetimeField fieldHolder wrapper should render a form group', () => {
  const { container } = render(
    <DatetimeFieldWrapper {...makePropsHtml4({
      id: 'Field',
      name: 'Field',
      title: 'Field',
    })}
    />
  );
  expect(container.querySelectorAll('.form-group')).toHaveLength(1);
  expect(container.querySelector('input')).not.toBeNull();
});

test('DatetimeField convertToIso() html4 en_NZ', () => {
  const onChange = jest.fn();
  const { container } = render(
    <DatetimeField {...makePropsHtml4({
      lang: 'en_NZ',
      onChange
    })}
    />
  );
  const input = container.querySelector('input#date');
  fireEvent.change(input, { target: { value: '23/04/2017 1:22 PM' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'date', value: '2017-04-23T13:22:00' }
  );
});

test('DatetimeField convertToIso() html4 en_NZ iso input', () => {
  const onChange = jest.fn();
  const { container } = render(
    <DatetimeField {...makePropsHtml4({
      lang: 'en_NZ',
      onChange
    })}
    />
  );
  const input = container.querySelector('input#date');
  fireEvent.change(input, { target: { value: '2017-04-23T00:32:21' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'date', value: '2017-04-23T00:32:21' }
  );
});

test('DatetimeField convertToIso() html4 en_NZ date only input defaults time to 00:00:00', () => {
  const onChange = jest.fn();
  const { container } = render(
    <DatetimeField {...makePropsHtml4({
      lang: 'en_NZ',
      onChange
    })}
    />
  );
  const input = container.querySelector('input#date');
  fireEvent.change(input, { target: { value: '23/04/2017' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'date', value: '2017-04-23T00:00:00' }
  );
});

test('DatetimeField convertToIso() html4 en_NZ invalid input', () => {
  const onChange = jest.fn();
  const { container } = render(
    <DatetimeField {...makePropsHtml4({
      lang: 'en_NZ',
      onChange
    })}
    />
  );
  const input = container.querySelector('input#date');
  fireEvent.change(input, { target: { value: '2017-04-23T003221' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'date', value: '' }
  );
});

test('DatetimeField convertToIso() html4 en_US iso input', () => {
  const onChange = jest.fn();
  const { container } = render(
    <DatetimeField {...makePropsHtml4({
      lang: 'en_US',
      onChange
    })}
    />
  );
  const input = container.querySelector('input#date');
  fireEvent.change(input, { target: { value: '04/23/2017 1:22 PM' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'date', value: '2017-04-23T13:22:00' }
  );
});

test('DatetimeField convertToLocalised() html4 en_NZ', () => {
  const { container } = render(
    <DatetimeField {...makePropsHtml4({
      lang: 'en_NZ',
      value: '2017-04-23T13:22:00'
    })}
    />
  );
  const input = container.querySelector('input#date');
  expect(input.getAttribute('value')).toBe('23/04/2017 1:22 PM');
});

test('DatetimeField convertToLocalised() html4 en_US', () => {
  const { container } = render(
    <DatetimeField {...makePropsHtml4({
      lang: 'en_US',
      value: '2017-04-23T13:22:00'
    })}
    />
  );
  const input = container.querySelector('input#date');
  expect(input.getAttribute('value')).toBe('04/23/2017 1:22 PM');
});

test('DatetimeField convertToLocalised() html4 en_NZ invalid input', () => {
  const { container } = render(
    <DatetimeField {...makePropsHtml4({
      lang: 'en_NZ',
      value: '2017-04-23T13:99:99'
    })}
    />
  );
  const input = container.querySelector('input#date');
  expect(input.getAttribute('value')).toBe('');
});

test('DatetimeField Browser doesn\'t support html5 date time input', () => {
  const onChange = jest.fn();
  const { container } = render(
    <DatetimeField {...makePropsHtml5NoBrowserSupport({
      lang: 'en_NZ',
      value: '2017-04-23T13:22:00',
      onChange
    })}
    />
  );
  const input = container.querySelector('input#date');
  expect(input.getAttribute('value')).toBe('23/04/2017 1:22 PM');
  fireEvent.change(input, { target: { value: '2023-01-30T13:22:00' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'date', value: '2023-01-30T13:22:00' }
  );
});

test('DatetimeField Browser doesn\'t support html5 date time input', () => {
  const onChange = jest.fn();
  const { container } = render(
    <DatetimeField {...makePropsHtml5NoBrowserSupport({
      lang: 'en_NZ',
      value: '2017-04-23T13:22:00',
      onChange
    })}
    />
  );
  const input = container.querySelector('input#date');
  expect(input.getAttribute('value')).toBe('23/04/2017 1:22 PM');
  fireEvent.change(input, { target: { value: '2023-01-30T13:22:00' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'date', value: '2023-01-30T13:22:00' }
  );
  fireEvent.change(input, { target: { value: '2023-01-30T13:99:99' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'date', value: '' }
  );
});

test('DatetimeField Browser supports html5 date time input but user has opt-outed', () => {
  const onChange = jest.fn();
  const { container } = render(
    <DatetimeField {...makePropsHtml5OptedOut({
      lang: 'en_NZ',
      value: '2017-04-23T13:22:00',
      onChange
    })}
    />
  );
  const input = container.querySelector('input#date');
  expect(input.getAttribute('value')).toBe('23/04/2017 1:22 PM');
  fireEvent.change(input, { target: { value: '2023-01-30T13:22:00' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'date', value: '2023-01-30T13:22:00' }
  );
  fireEvent.change(input, { target: { value: '2023-01-30T13:99:99' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'date', value: '' }
  );
});

test('DatetimeField html5 en_NZ enter iso value', () => {
  const onChange = jest.fn();
  const { container } = render(
    <DatetimeField {...makePropsHtml5({
      lang: 'en_NZ',
      onChange
    })}
    />
  );
  const input = container.querySelector('input#date');
  fireEvent.change(input, { target: { value: '2017-04-23T13:22:00' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'date', value: '2017-04-23T13:22:00' }
  );
});

test('DatetimeField html5 en_NZ incomplete input (badInput) does not fire onChange', () => {
  // jsdom doesn't implement the native datetime-local partial-entry behaviour (a real
  // browser reports an empty `value` with `validity.badInput = true` once part of the
  // control - e.g. only the date - has been filled in). This is simulated here by
  // overriding `validity` on the input before firing a change back to an empty value.
  const onChange = jest.fn();
  const { container } = render(
    <DatetimeField {...makePropsHtml5({
      lang: 'en_NZ',
      value: '2017-04-23T13:22:00',
      onChange
    })}
    />
  );
  const input = container.querySelector('input#date');
  Object.defineProperty(input, 'validity', {
    value: { badInput: true },
    configurable: true,
  });
  fireEvent.change(input, { target: { value: '' } });
  expect(onChange).not.toBeCalled();
  expect(container.querySelector('.form__field-message--error')).not.toBeNull();
});

test('DatetimeField html5 en_NZ enter localised value', () => {
  const onChange = jest.fn();
  const { container } = render(
    <DatetimeField {...makePropsHtml5({
      lang: 'en_NZ',
      onChange
    })}
    />
  );
  const input = container.querySelector('input#date');
  fireEvent.change(input, { target: { value: '23/04/2017 1:22 PM' } });
  expect(onChange).not.toBeCalled();
});

test('DatetimeField renders input without undefined classes', () => {
  const { container } = render(
    <DatetimeField {...makePropsHtml4()} />
  );
  const input = container.querySelector('input');
  expect(input.className).not.toContain('undefined');
});
