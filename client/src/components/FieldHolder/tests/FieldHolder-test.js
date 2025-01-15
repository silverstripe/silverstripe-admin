/* global jest, test, describe, it, expect, beforeEach */

import React from 'react';
import { render } from '@testing-library/react';
import fieldHolder from '../FieldHolder';

jest.mock('components/FormAlert/FormAlert');

const InnerField = () => <div id="innerfield">Field</div>;
const FieldHolder = fieldHolder(InnerField);

test('FieldHolder should render innerfield', () => {
  const { container } = render(
    <FieldHolder {...{
      description: 'mydesc'
    }}
    />
  );
  expect(container.querySelector('div#innerfield').innerHTML).toBe('Field');
});

test('FieldHolder should render a description', () => {
  const { container } = render(
    <FieldHolder {...{
      description: 'mydesc'
    }}
    />
  );
  expect(container.querySelector('.form__field-description').innerHTML).toBe('mydesc');
});

test('FieldHolder should render no description if null', () => {
  const { container } = render(
    <FieldHolder {...{
      description: null
    }}
    />
  );
  expect(container.querySelectorAll('.form__field-description')).toHaveLength(0);
});

test('FieldHolder should render message property', () => {
  const { container } = render(
    <FieldHolder {...{
      message: {
        value: 'hello!',
        type: 'error'
      }
    }}
    />
  );
  expect(container.querySelector('.form__field-message--error div').innerHTML).toBe('hello!');
});

test('FieldHolder should let meta error override message if dirty', () => {
  const { container } = render(
    <FieldHolder {...{
      message: {
        value: 'hello!',
        type: 'error'
      },
      meta: {
        error: {
          value: 'My error',
        },
        touched: true,
        dirty: true,
      }
    }}
    />
  );
  expect(container.querySelector('.form__field-message div').innerHTML).toBe('My error');
});

test('FieldHolder should let message override meta error override if not dirty', () => {
  const { container } = render(
    <FieldHolder {...{
      message: {
        value: 'hello!',
        type: 'error'
      },
      meta: {
        error: {
          value: 'My error',
        },
        touched: true,
        dirty: false,
      }
    }}
    />
  );
  expect(container.querySelector('.form__field-message div').innerHTML).toBe('hello!');
});

test('FieldHolder should not return anything if not touched', () => {
  const { container } = render(
    <FieldHolder {...{
      meta: {
        error: {
          value: 'My error',
        },
        touched: false,
      }
    }}
    />
  );
  expect(container.querySelectorAll('.form__field-message')).toHaveLength(0);
});

test('FieldHolder return a node if touched and has an error', () => {
  const { container } = render(
    <FieldHolder {...{
      meta: {
        error: {
          value: 'My error',
        },
        touched: true,
      }
    }}
    />
  );
  expect(container.querySelectorAll('.form__field-message')).toHaveLength(1);
});

test('FieldHolder return a title when leftTitle is set', () => {
  const { container } = render(
    <FieldHolder {...{
      leftTitle: 'My left title'
    }}
    />
  );
  expect(container.querySelector('.form__field-label').innerHTML).toBe('My left title');
});

test('FieldHolder should return a title when title is set and leftTitle is not set', () => {
  const { container } = render(
    <FieldHolder {...{
      title: 'My title'
    }}
    />
  );
  expect(container.querySelector('.form__field-label').innerHTML).toBe('My title');
});

test('FieldHolder should return the left title when title and leftTitle are both set', () => {
  const { container } = render(
    <FieldHolder {...{
      leftTitle: 'My left title',
      title: 'My title'
    }}
    />
  );
  expect(container.querySelector('.form__field-label').innerHTML).toBe('My left title');
});

test('FieldHolder rightTitle', () => {
  const { container } = render(
    <FieldHolder {...{
      rightTitle: 'My right title'
    }}
    />
  );
  expect(container.querySelector('.form__field-label').innerHTML).toBe('My right title');
});

test('FieldHolder hideLabels', () => {
  const { container } = render(
    <FieldHolder {...{
      leftTitle: 'My left title',
      rightTitle: 'My right title',
      hideLabels: true
    }}
    />
  );
  expect(container.querySelectorAll('.form__field-label')).toHaveLength(0);
});

test('FieldHolder no labels', () => {
  const { container } = render(
    <FieldHolder/>
  );
  expect(container.querySelectorAll('.form__field-label')).toHaveLength(0);
});

test('FieldHolder no prefix or suffix', () => {
  const { container } = render(
    <FieldHolder/>
  );
  expect(container.querySelectorAll('.input-group-text')).toHaveLength(0);
});

test('FieldHolder prefix', () => {
  const { container } = render(
    <FieldHolder {...{
      data: {
        prefix: 'My prefix',
      }
    }}
    />
  );
  expect(container.querySelectorAll('.input-group-text')).toHaveLength(1);
  expect(container.querySelector('.input-group .input-group-text').innerHTML).toBe('My prefix');
});

test('FieldHolder prefix', () => {
  const { container } = render(
    <FieldHolder {...{
      data: {
        suffix: 'My suffix',
      }
    }}
    />
  );
  expect(container.querySelectorAll('.input-group-text')).toHaveLength(1);
  expect(container.querySelector('.input-group .input-group-text').innerHTML).toBe('My suffix');
});

test('FieldHolder titleTip should be rendered if one is provided', () => {
  const { container } = render(
    <FieldHolder {...{
      id: 'my-id',
      title: 'My title',
      titleTip: {
        content: 'My content',
      }
    }}
    />
  );
  expect(container.querySelector('button.tip.tip--title').getAttribute('aria-label')).toBe('Tip for My title');
});

test('FieldHolder titleTip should not be rendered if one is not provided', () => {
  const { container } = render(
    <FieldHolder {...{
      id: 'my-id',
      title: 'My title',
    }}
    />
  );
  expect(container.querySelectorAll('button.tip.tip--title')).toHaveLength(0);
});
