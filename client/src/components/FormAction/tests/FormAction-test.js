/* global jest, test, describe, it, expect, beforeEach */

import React from 'react';
import { render } from '@testing-library/react';
import FormAction from '../FormAction';

test('FormAction.isPrimary() detects via the name if the button should be primary', () => {
  const { container } = render(
    <FormAction {...{
      name: 'action_save'
    }}
    />
  );
  expect(container.querySelector('.btn.btn-primary')).not.toBe(null);
});

test('FormAction.isPrimary() detects via a legacy class name if the button should be primary', () => {
  const { container } = render(
    <FormAction {...{
      extraClass: 'foo ss-ui-action-constructive bar'
    }}
    />
  );
  expect(container.querySelector('.btn.btn-primary')).not.toBe(null);
});

test('FormAction.isDisabled() is true when disabled prop is passed', () => {
  const { container } = render(
    <FormAction {...{
      disabled: true
    }}
    />
  );
  expect(container.querySelector('.btn.disabled')).not.toBe(null);
});

test('FormAction.isDisabled() ', () => {
  const { container } = render(
    <FormAction {...{
      disabled: false,
      readOnly: true,
    }}
    />
  );
  expect(container.querySelector('.btn.disabled')).not.toBe(null);
});
