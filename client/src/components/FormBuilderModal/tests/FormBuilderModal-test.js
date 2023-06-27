/* global jest, test, expect */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormBuilderModal from '../FormBuilderModal';

let nextAction;
let nextParam;

function makeProps(obj = {}) {
  return {
    title: 'My title',
    show: true,
    showErrorMessage: true,
    responseClassBad: 'response-bad',
    responseClassGood: 'response-good',
    onHide: jest.fn(),
    identifier: 'FormModalTest',
    schemaUrl: 'myschemaurl',
    ModalComponent: ({ children }) => <div data-testid="test-modal">{children}</div>,
    ModalHeaderComponent: () => <div data-testid="test-modalheader"/>,
    FormBuilderLoaderComponent: ({ onLoadingError, onSubmit }) => (
      <div
        data-testid="test-formbuilderloader"
        onClick={() => {
          if (nextAction === 'onLoadingError') {
            onLoadingError(nextParam);
          }
          if (nextAction === 'onSubmit') {
            onSubmit(nextParam);
          }
        }}
      />
    ),
    ...obj
  };
}

test('FormBuilderModal getResponse() should show no response initially', async () => {
  render(
    <FormBuilderModal {...makeProps({})}/>
  );
  const modal = await screen.findByTestId('test-modal');
  expect(modal.textContent).toBe('');
});

test('FormBuilderModal getResponse() should show error message', async () => {
  render(
    <FormBuilderModal {...makeProps({})}/>
  );
  const loader = await screen.findByTestId('test-formbuilderloader');
  nextAction = 'onLoadingError';
  nextParam = {
    errors: [{
      value: 'catastrophe',
    }]
  };
  fireEvent.click(loader);
  const modal = await screen.findByTestId('test-modal');
  expect(modal.querySelector('.response-bad span').textContent).toBe('catastrophe');
});

test('FormBuilderModal getResponse() should show success message', async () => {
  render(
    <FormBuilderModal {...makeProps({
      onSubmit: (data) => Promise.resolve(data)
    })}
    />
  );
  const loader = await screen.findByTestId('test-formbuilderloader');
  nextAction = 'onSubmit';
  nextParam = {
    message: 'happy days'
  };
  fireEvent.click(loader);
  const modal = await screen.findByTestId('test-modal');
  expect(modal.querySelector('.response-good span').textContent).toBe('happy days');
});
