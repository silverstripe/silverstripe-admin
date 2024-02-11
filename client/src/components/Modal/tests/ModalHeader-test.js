/* global jest, test, describe, it, expect */

import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ModalHeader from '../ModalHeader';

let props;

beforeEach(() => {
  props = {
    onClosed: jest.fn(),
    title: 'Hello World!',
    showCloseButton: true,
  };
});

test('Modal renders', () => {
  const root = render(<ModalHeader {...props} />);

  const header = root.getByRole('heading');
  expect(header.textContent).toContain('Hello World!');

  const closeButton = root.getByLabelText('Close');
  expect(closeButton).toBeTruthy();
});

test('Closing the Modal', () => {
  const root = render(<ModalHeader {...props} />);

  const closeButton = root.getByLabelText('Close');
  fireEvent.click(closeButton);
  expect(props.onClosed).toBeCalled();
});
