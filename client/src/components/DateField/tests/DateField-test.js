/* global jest, test, describe, beforeEach, it, expect, modernizr, Event */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Component as DateField } from '../DateField';

jest.mock('modernizr', () => {});

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
        date: false,
        time: false,
      },
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
        date: false,
        time: false
      }
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
        date: true,
        time: true
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
        date: true,
        time: true
      }
    },
    ...getSharedProps(),
    ...obj
  };
}

test('DateField onChange() should call the onChange function on props', () => {
  const onChange = jest.fn();
  const { container } = render(
    <DateField {...makePropsHtml4({
      onChange
    })}
    />
  );
  const input = container.querySelector('input#date');
  fireEvent.change(input, { target: { value: 'New value' } });
  expect(onChange).toBeCalled();
});

// Note: html4, html5 no browser support, html5 opted out, all just mean "use html4"

test('DateField convertToIso html4 en_NZ', () => {
  const onChange = jest.fn();
  const { container } = render(
    <DateField {...makePropsHtml4({
      lang: 'en_NZ',
      onChange
    })}
    />
  );
  const input = container.querySelector('input#date');
  fireEvent.change(input, { target: { value: '11/04/2017' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'date', value: '2017-04-11' });
});

test('DateField convertToIso html4 en_US', () => {
  const onChange = jest.fn();
  const { container } = render(
    <DateField {...makePropsHtml4({
      lang: 'en_US',
      onChange
    })}
    />
  );
  const input = container.querySelector('input#date');
  fireEvent.change(input, { target: { value: '04/11/2017' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'date', value: '2017-04-11' });
});

test('DateField convertToIso html5 no browser support en_NZ', () => {
  const onChange = jest.fn();
  const { container } = render(
    <DateField {...makePropsHtml5NoBrowserSupport({
      lang: 'en_NZ',
      onChange
    })}
    />
  );
  const input = container.querySelector('input#date');
  fireEvent.change(input, { target: { value: '11/04/2017' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'date', value: '2017-04-11' });
});

test('DateField convertToIso html5 opted out en_NZ', () => {
  const onChange = jest.fn();
  const { container } = render(
    <DateField {...makePropsHtml5OptedOut({
      lang: 'en_NZ',
      onChange
    })}
    />
  );
  const input = container.querySelector('input#date');
  fireEvent.change(input, { target: { value: '11/04/2017' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'date', value: '2017-04-11' });
});

// react/testing-library must be given an ISO date for the change event to fire
// https://github.com/testing-library/testing-library-docs/issues/389#issuecomment-583011925
// The html5 field is rendered as <input type="date"/> whereas the html4 field is rendered as <input type="text"/>.
test('DateField html5 en_NZ iso date', () => {
  const onChange = jest.fn();
  const { container } = render(
    <DateField {...makePropsHtml5({
      lang: 'en_NZ',
      onChange
    })}
    />
  );
  const input = container.querySelector('input#date');
  fireEvent.change(input, { target: { value: '2017-04-11' } });
  expect(onChange).toBeCalledWith(
    expect.objectContaining({ _reactName: 'onChange' }),
    { id: 'date', value: '2017-04-11' });
});

test('DateField html5 en_NZ non iso date', () => {
  const onChange = jest.fn();
  const { container } = render(
    <DateField {...makePropsHtml5({
      lang: 'en_NZ',
      onChange
    })}
    />
  );
  const input = container.querySelector('input#date');
  fireEvent.change(input, { target: { value: '11/04/2017' } });
  expect(onChange).not.toBeCalled();
});
