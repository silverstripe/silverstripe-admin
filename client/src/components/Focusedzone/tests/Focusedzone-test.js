/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import Focusedzone from '../Focusedzone';

test('Focusedzone.render() renders with children', () => {
  const { container } = render(
    <Focusedzone {...{
      className: 'my-classname',
      onClickOut: () => {}
    }}
    >
      <p>lorem</p>
      <p>ipsum</p>
    </Focusedzone>
  );
  expect(container.querySelectorAll('div')).toHaveLength(1);
});
