/* global test, expect */

import React from 'react';
import { render } from '@testing-library/react';
import LegacyFieldGroup from '../LegacyFieldGroup';

test('LegacyFieldGroup preserves field group class calculations for external consumers', () => {
  const ref = React.createRef();
  const { container } = render(
    <LegacyFieldGroup
      className="legacy-field-group"
      extraClass="legacy-extra"
      data={{
        tag: 'fieldset',
        legend: 'Field group legend',
      }}
      ref={ref}
    >
      <span>Legacy group content</span>
    </LegacyFieldGroup>
  );

  expect(ref.current).not.toBeNull();
  expect(ref.current.getClassName()).toContain('field-group-component');
  expect(ref.current.getClassName()).toContain('field-group-component__small-holder');
  expect(container.querySelector('legend').textContent).toBe('Field group legend');
  expect(container.querySelector('fieldset').classList).toContain('legacy-field-group');
  expect(container.textContent).toContain('Legacy group content');
});

test('LegacyFieldGroup omits the default small-holder modifier when disabled', () => {
  const { container } = render(
    <LegacyFieldGroup
      className="legacy-field-group"
      extraClass="legacy-extra"
      data={{
        tag: 'div',
      }}
      smallholder={false}
    >
      <span>Legacy group content</span>
    </LegacyFieldGroup>
  );

  expect(container.firstChild.classList).toContain('field-group-component');
  expect(container.firstChild.classList).toContain('legacy-field-group');
  expect(container.firstChild.classList).toContain('legacy-extra');
  expect(container.firstChild.classList).not.toContain('field-group-component__small-holder');
});
