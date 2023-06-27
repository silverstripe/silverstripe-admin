/* global jest, test, describe, it, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TabNav from '../TabNav';

const onToggle = jest.fn();

function makeProps(obj = {}) {
  return {
    onToggle,
    ...obj
  };
}

test('TabNav render', () => {
  const { container } = render(
    <TabNav {...makeProps({
      currentTab: 'second',
    })}
    >
      <div name="first" title="Child One" />
      <div name="second" title="Child Two" />
      <div name="three" title="Child Three" />
    </TabNav>
  );
  expect(container.querySelectorAll('.nav-tabs')).toHaveLength(1);
  expect(container.querySelectorAll('.nav-tabs .nav-link')).toHaveLength(3);
  const links = container.querySelectorAll('.nav-tabs .nav-link');
  expect(links[0].classList).not.toContain('active');
  expect(links[1].classList).toContain('active');
  expect(links[2].classList).not.toContain('active');
  fireEvent.click(links[1], {});
  expect(onToggle).not.toBeCalled();
  fireEvent.click(links[2], {});
  expect(onToggle).toBeCalled();
});

test('TabNav hidden when no child is provided', () => {
  const { container } = render(<TabNav {...makeProps()}/>);
  expect(container.querySelectorAll('.nav-tabs .nav-link')).toHaveLength(0);
});

test('TabNav hidden when only one child is provided', () => {
  const { container } = render(
    <TabNav {...makeProps()}>
      <div name="first" title="Child One" />
    </TabNav>
  );
  expect(container.querySelectorAll('.nav-tabs .nav-link')).toHaveLength(0);
});
