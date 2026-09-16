/* global jest, test, expect */

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import FormAction from '../FormAction';

const makeProps = (overrides = {}) => ({
  attributes: {},
  data: {},
  disabled: false,
  extraClass: '',
  icon: '',
  loading: false,
  readOnly: false,
  title: 'Save',
  ...overrides,
});

test('FormAction.isPrimary() detects via the name if the button should be primary', () => {
  const { container } = render(
    <FormAction {...makeProps({
      name: 'action_save'
    })}
    />
  );
  expect(container.querySelector('.btn.btn-primary')).not.toBe(null);
});

test('FormAction.isPrimary() detects via a legacy class name if the button should be primary', () => {
  const { container } = render(
    <FormAction {...makeProps({
      extraClass: 'foo ss-ui-action-constructive bar'
    })}
    />
  );
  expect(container.querySelector('.btn.btn-primary')).not.toBe(null);
});

test('FormAction renders a button with merged attributes and the default secondary style', () => {
  render(
    <FormAction
      {...makeProps({
        id: 'save-action',
        name: 'action_save_draft',
        attributes: {
          'aria-describedby': 'save-help',
          'data-schema': 'save-button',
        },
      })}
    />
  );

  const button = screen.getByRole('button', { name: 'Save' });

  expect(button.id).toBe('save-action');
  expect(button.name).toBe('action_save_draft');
  expect(button.getAttribute('aria-describedby')).toBe('save-help');
  expect(button.getAttribute('data-schema')).toBe('save-button');
  expect(button.classList.contains('btn-secondary')).toBe(true);
});

test('FormAction renders without a title using the no-text modifier class', () => {
  const { container } = render(
    <FormAction
      {...makeProps({
        title: null,
      })}
    />
  );

  const button = screen.getByRole('button');

  expect(button.classList.contains('btn--no-text')).toBe(true);
  expect(container.querySelector('.btn__title')).toBe(null);
});

test('FormAction prefers data.buttonStyle over the buttonStyle prop and uses data icons', () => {
  const { container } = render(
    <FormAction
      {...makeProps({
        buttonStyle: 'danger',
        data: {
          buttonStyle: 'info',
          icon: 'download',
        },
      })}
    />
  );

  const button = screen.getByRole('button', { name: 'Save' });

  expect(button.classList.contains('btn-info')).toBe(true);
  expect(button.classList.contains('btn-danger')).toBe(false);
  expect(container.querySelector('.font-icon-download.btn__icon')).not.toBe(null);
});

test('FormAction uses the buttonStyle prop when no schema buttonStyle is provided', () => {
  render(
    <FormAction
      {...makeProps({
        buttonStyle: 'danger',
        title: 'Delete',
      })}
    />
  );

  expect(screen.getByRole('button', { name: 'Delete' }).classList.contains('btn-danger')).toBe(true);
});

test('FormAction does not add a default button style when extraClass already includes a btn-* class', () => {
  render(
    <FormAction
      {...makeProps({
        extraClass: 'btn-outline-warning custom-class',
        title: 'Warn',
      })}
    />
  );

  const button = screen.getByRole('button', { name: 'Warn' });

  expect(button.classList.contains('btn-outline-warning')).toBe(true);
  expect(button.classList.contains('custom-class')).toBe(true);
  expect(button.classList.contains('btn-secondary')).toBe(false);
});

test('FormAction renders loading markup and applies the loading class', () => {
  const { container } = render(
    <FormAction
      {...makeProps({
        loading: true,
      })}
    />
  );

  const button = screen.getByRole('button', { name: 'Save' });

  expect(button.classList.contains('btn--loading')).toBe(true);
  expect(container.querySelectorAll('.btn__loading-icon .btn__circle').length).toBe(3);
});

test('FormAction uses the explicit icon prop in preference to the data icon', () => {
  const { container } = render(
    <FormAction
      {...makeProps({
        icon: 'upload',
        data: {
          icon: 'download',
        },
      })}
    />
  );

  expect(container.querySelector('.font-icon-upload.btn__icon')).not.toBe(null);
  expect(container.querySelector('.font-icon-download.btn__icon')).toBe(null);
});

test('FormAction passes the click event and action name to onClick', () => {
  const onClick = jest.fn();

  render(
    <FormAction
      {...makeProps({
        name: 'action_publish',
        onClick,
        title: 'Publish',
      })}
    />
  );

  fireEvent.click(screen.getByRole('button', { name: 'Publish' }));

  expect(onClick).toHaveBeenCalledTimes(1);
  expect(onClick.mock.calls[0][0].type).toBe('click');
  expect(onClick.mock.calls[0][1]).toBe('action_publish');
});

test('FormAction falls back to the button id when no action name is set', () => {
  const onClick = jest.fn();

  render(
    <FormAction
      {...makeProps({
        id: 'action-archive',
        onClick,
        title: 'Archive',
      })}
    />
  );

  fireEvent.click(screen.getByRole('button', { name: 'Archive' }));

  expect(onClick).toHaveBeenCalledTimes(1);
  expect(onClick.mock.calls[0][1]).toBe('action-archive');
});

test('FormAction.isDisabled() is true when disabled prop is passed', () => {
  const { container } = render(
    <FormAction {...makeProps({
      disabled: true
    })}
    />
  );
  expect(container.querySelector('.btn.disabled')).not.toBe(null);
});

test('FormAction.isDisabled() is true when readOnly prop is passed', () => {
  const { container } = render(
    <FormAction {...makeProps({
      disabled: false,
      readOnly: true,
    })}
    />
  );
  expect(container.querySelector('.btn.disabled')).not.toBe(null);
});

test('FormAction allows clicks when no onClick callback is provided', () => {
  render(
    <FormAction
      {...makeProps({
        title: 'Plain button',
      })}
    />
  );

  expect(() => fireEvent.click(screen.getByRole('button', { name: 'Plain button' }))).not.toThrow();
});
