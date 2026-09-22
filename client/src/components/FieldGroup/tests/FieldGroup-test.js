/* global test, expect */

import React from 'react';
import { render } from '@testing-library/react';
import FieldGroup, { getClassName as getFieldGroupClassName } from '../FieldGroup';

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

test('FieldGroup applies the field-group classes and inherited class names', () => {
  const { container } = render(
    <FieldGroup
      className="my-classname"
      extraClass="my-extra-class"
      data={{ tag: 'div' }}
      smallholder={false}
    >
      <p>ipsum</p>
    </FieldGroup>
  );
  const wrapper = container.firstChild;
  expect(wrapper.classList).toContain('field-group-component');
  expect(wrapper.classList).toContain('my-classname');
  expect(wrapper.classList).toContain('my-extra-class');
  expect(wrapper.classList).not.toContain('field-group-component__small-holder');
});

test('FieldGroup uses the default smallholder class when no prop is provided', () => {
  const { container } = render(
    <FieldGroup data={{ tag: 'div' }}>
      <p>ipsum</p>
    </FieldGroup>
  );

  expect(container.firstChild.classList).toContain('field-group-component');
  expect(container.firstChild.classList).toContain('field-group-component__small-holder');
});

test('FieldGroup re-exports the class name helper for subclasses', () => {
  const classNames = getFieldGroupClassName({
    className: 'my-classname',
    extraClass: 'my-extra-class',
    smallholder: false,
  });

  expect(classNames.split(' ')).toContain('field-group-component');
  expect(classNames.split(' ')).toContain('my-classname');
  expect(classNames.split(' ')).toContain('my-extra-class');
  expect(classNames.split(' ')).not.toContain('field-group-component__small-holder');
});
