/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import FieldGroup from '../FieldGroup';

test('FieldGroup renders children', () => {
  const { container } = render(
    <FieldGroup {...{
      className: 'my-classname',
      data: {
        tag: 'fieldset',
        legend: 'my-legend'
      }
    }}
    >
      <p>lorem</p>
      <p>ipsum</p>
    </FieldGroup>
  );
  const fieldset = container.querySelector('fieldset');
  expect(fieldset.classList).toContain('my-classname');
  const legend = fieldset.querySelector('legend');
  expect(legend.innerHTML).toBe('my-legend');
  expect(fieldset.querySelectorAll('p')).toHaveLength(2);
});
