/* global jest, test, describe, it, expect */

import React from 'react';
import AccordionBlock from '../AccordionBlock';
import { render } from '@testing-library/react';

test('AccordionBlock render() renders with children', () => {
  const { container } = render(
    <AccordionBlock {...{
      groupid: 123,
      title: 'My title'
    }}
    >
      <p>lorem</p>
      <p>ipsum</p>
    </AccordionBlock>
  );
  expect(container.querySelectorAll('div.accordion__block')).toHaveLength(1);
});
