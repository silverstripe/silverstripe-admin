/* global jest, test, expect */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Component as Form } from '../Form';

function makeProps(obj = {}) {
  return {
    valid: true,
    attributes: {
      action: 'foo',
      method: 'GET',
    },
    fields: [],
    mapFieldsToComponents: () => <div>my fields</div>,
    mapActionsToComponents: () => {},
    FormAlertComponent: (message) => <div data-testid="test-form-alert">{message.message}</div>,
    ...obj
  };
}

test('Form renderMessages returns form messages as alerts', async () => {
  render(
    <Form {...makeProps({
      messages: [
        { message: 'Looks good to me' },
        { message: 'You could try this' },
      ]
    })}
    />
  );
  const alerts = await screen.findAllByTestId('test-form-alert');
  expect(alerts.length).toBe(2);
  expect(alerts[0].textContent).toBe('Looks good to me');
  expect(alerts[1].textContent).toBe('You could try this');
});

test('Form render() adds an invalid class when valid is false', async () => {
  render(
    <Form {...makeProps({
      valid: false
    })}
    />
  );
  const form = await screen.findByRole('form');
  expect(form.classList).toContain('form--invalid');
});

test('Form render() adds custom classes to the form container', async () => {
  render(
    <Form {...makeProps({
      attributes: {
        ...makeProps().attributes,
        className: 'foobar'
      }
    })}
    />
  );
  const form = await screen.findByRole('form');
  expect(form.classList).toContain('foobar');
});
