/* global jest, test, expect */

import React from 'react';
import { render } from '@testing-library/react';
import LegacyCompositeField from '../LegacyCompositeField';

const makeProps = (overrides = {}) => ({
  className: 'legacy-class',
  extraClass: 'legacy-extra',
  data: {
    tag: 'fieldset',
    legend: 'Legacy legend',
  },
  ...overrides,
});

test('LegacyCompositeField preserves the legacy instance API', () => {
  const ref = React.createRef();
  const { container } = render(
    <LegacyCompositeField {...makeProps()} ref={ref}>
      <span>Legacy content</span>
    </LegacyCompositeField>
  );

  expect(ref.current).not.toBeNull();
  expect(ref.current.getClassName()).toBe('legacy-class legacy-extra');
  expect(ref.current.getLegend().props.children).toBe('Legacy legend');
  expect(container.querySelector('legend').textContent).toBe('Legacy legend');
  expect(container.querySelector('fieldset').classList).toContain('legacy-class');
  expect(container.textContent).toContain('Legacy content');
});

test('LegacyCompositeField preserves the original missing-data failure mode', () => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => render(
    <LegacyCompositeField>
      <span>Legacy content</span>
    </LegacyCompositeField>
  )).toThrow();

  errorSpy.mockRestore();
});

test('LegacyCompositeField does not render a legend unless the tag is a fieldset', () => {
  const { container } = render(
    <LegacyCompositeField {...makeProps({
      data: {
        tag: 'div',
        legend: 'Legacy legend',
      },
    })}
    >
      <span>Legacy content</span>
    </LegacyCompositeField>
  );

  expect(container.querySelector('legend')).toBeNull();
  expect(container.textContent).not.toContain('Legacy legend');
});
