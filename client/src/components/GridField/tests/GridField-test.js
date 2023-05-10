/* global jest, test, describe, beforeEach, it, expect */

import React from 'react';
import { render } from '@testing-library/react';
import GridFieldTable from '../GridFieldTable';

test('GridFieldTable generateHeader() should return props.header if it is set', () => {
  const { container } = render(
    <GridFieldTable {...{
      header: <tr className="header" />
    }}
    />
  );
  expect(container.querySelector('tr.header')).not.toBeNull();
});

test('GridFieldTable generateHeader() should return null if props.header and props.data are both not set', () => {
  const { container } = render(
    <GridFieldTable/>
  );
  expect(container.querySelector('thead').innerHTML).toBe('');
});

test('GridFieldTable generateHeader() should return props.rows if it is set', () => {
  const { container } = render(
    <GridFieldTable {...{
      rows: [<tr className="row" key="row1"><td>row1</td></tr>]
    }}
    />
  );
  expect(container.querySelectorAll('tbody .row')[0].classList).toContain('row');
});

test('GridFieldTable generateHeader() should return null if props.rows and props.data are both not set', () => {
  const { container } = render(
    <GridFieldTable/>
  );
  expect(container.querySelector('tbody').innerHTML).toBe('');
});
