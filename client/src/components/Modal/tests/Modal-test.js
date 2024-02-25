/* global jest, test, describe, it, expect */

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Modal from '../Modal';

/** Component that printouts all of its props */
const PrintProps = (componentName) => ({ children, ...propsToPrint }) => (
  <div>
    <div>{componentName}</div>
    <ul>
      {Object
        .entries(propsToPrint)
        .map(([key, value]) => (<li key={key}>{key}: {value.toString()}</li>))
      }
    </ul>
    {children}
  </div>
);

const makeProps = () => ({
  isOpen: true,
  className: 'my-modal',
  modalClassName: 'my-modal-dialog',
  size: 'sm',
  onClosed: () => {},
  title: 'Hello World!',
  showCloseButton: true,
});

test('Modal renders', () => {
  const root = render(
    <Modal {...makeProps()}>My Content</Modal>
  );

  const modal = root.getByRole('dialog');
  expect(modal.style.getPropertyValue('display')).toBe('block');
  expect(modal.classList).toContain('my-modal-dialog');
  expect(modal.classList).toContain('modal');

  const modalContainer = root.getByRole('document');
  expect(modalContainer.classList).toContain('modal-sm');

  const header = root.getByRole('heading');
  expect(header.textContent).toContain('Hello World!');

  const modalBody = root.getByText('My Content');
  expect(modalBody).toBeTruthy();

  const closeButton = root.getByLabelText('Close');
  expect(closeButton).toBeTruthy();
});

test('Closing the Modal', () => {
  const onClosed = jest.fn();
  const root = render(
    <Modal {...makeProps()} onClosed={onClosed}>My Content</Modal>
  );

  const closeButton = root.getByLabelText('Close');
  fireEvent.click(closeButton);

  expect(onClosed).toBeCalled();
});

test('Modal is not shown', () => {
  render(
    <Modal {...makeProps()} isOpen={false}>My Content</Modal>
  );

  const modalBody = screen.queryByText('My Content');
  expect(modalBody).toBeNull();
});

test('Modal with custom components', () => {
  const ModalComponent = PrintProps('Custom Modal Component');
  const ModalHeaderComponent = PrintProps('Custom Modal Header Component');
  const root = render(
    <Modal
      {...makeProps()}
      ModalComponent={ModalComponent}
      ModalHeaderComponent={ModalHeaderComponent}
    >
      My Content
    </Modal>
  );

  expect(root.getByText('Custom Modal Component')).toBeTruthy();
  expect(root.getByText('isOpen: true')).toBeTruthy();
  expect(root.getByText('className: my-modal')).toBeTruthy();
  expect(root.getByText('modalClassName: my-modal-dialog')).toBeTruthy();
  expect(root.getByText('size: sm')).toBeTruthy();
  expect(root.getByText('Custom Modal Header Component')).toBeTruthy();
});
