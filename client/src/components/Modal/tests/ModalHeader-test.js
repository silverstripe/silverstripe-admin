/* global jest, test, describe, it, expect */

import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ModalHeader from '../ModalHeader';

const makeProps = () => ({
  onClosed: () => {},
  title: 'Hello World!',
  showCloseButton: true,
});

test('Modal renders', () => {
  const root = render(<ModalHeader {...makeProps()} />);

  const header = root.getByRole('heading');
  expect(header.textContent).toContain('Hello World!');

  const closeButton = root.getByLabelText('Close');
  expect(closeButton).toBeTruthy();
});

test('Closing the Modal', () => {
  const onClosed = jest.fn();
  const root = render(<ModalHeader {...makeProps()} onClosed={onClosed} />);

  const closeButton = root.getByLabelText('Close');
  fireEvent.click(closeButton);
  expect(onClosed).toBeCalled();
});
