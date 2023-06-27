/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import Accordion from '../Accordion';

test('Accordion render() renders with children', () => {
  const { container } = render(
    <Accordion>
      <p>lorem</p>
      <p>ipsum</p>
    </Accordion>
  );
  expect(container.querySelectorAll('div')).toHaveLength(1);
});
