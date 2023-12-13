/* eslint-disable import/no-extraneous-dependencies */
/* global jest, test, describe, beforeEach, it, expect, setTimeout, document */

import React from 'react';
import { render } from '@testing-library/react';
import { Component as SearchableDropdownField } from '../SearchableDropdownField';

function makeProps(obj = {}) {
  const options = [
    { label: 'Option 01', value: 1 },
    { label: 'Option 02', value: 2 },
  ];
  return {
    name: 'Test',
    searchable: false,
    value: options[0],
    options,
    onChange: () => {},
    passRef: false,
    SelectComponent: () => <div className="test-dynamic test-select" />,
    AsyncSelectComponent: () => <div className="test-dynamic test-async-select" />,
    ...obj,
  };
}

test('SearchableDropdownField should render a SelectComponent by default', () => {
  const { container } = render(
    <SearchableDropdownField {...makeProps()}/>
  );
  expect(container.querySelectorAll('.test-dynamic')).toHaveLength(1);
  expect(container.querySelector('.test-select')).not.toBeNull();
});

test('SearchableDropdownField should render an AsyncSelectComponent with a lazyLoad option', () => {
  const { container } = render(
    <SearchableDropdownField {...makeProps({
      lazyLoad: true
    })}
    />
  );
  expect(container.querySelectorAll('.test-dynamic')).toHaveLength(1);
  expect(container.querySelector('.test-async-select')).not.toBeNull();
});
