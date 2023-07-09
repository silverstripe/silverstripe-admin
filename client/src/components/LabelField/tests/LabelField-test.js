/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import LabelField from '../LabelField';

test('LabelField render() renders', () => {
  const { container } = render(
    <LabelField {...{
      id: 123,
      className: 'my-classname',
      extraClass: 'my-extra-class',
      title: 'my-title',
      data: {
        target: 'my-target'
      }
    }}
    />
  );
  expect(container.querySelectorAll('label')).toHaveLength(1);
});
