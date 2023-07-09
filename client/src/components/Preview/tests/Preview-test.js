/* global jest, test, describe, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import { Component as Preview } from '../Preview';

test('Preview render() renders', () => {
  const { container } = render(
    <Preview {...{
      className: 'my-classname',
      itemLinks: {},
      itemId: 123,
      onBack: () => {},
      moreActions: [],
      ViewModeComponent: () => <div />,
    }}
    />
  );
  expect(container.querySelectorAll('div.preview')).toHaveLength(1);
});
