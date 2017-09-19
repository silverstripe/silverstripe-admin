/* global jest, describe, beforeEach, it, expect */

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import GridFieldTable from '../GridFieldTable';

describe('GridFieldTable', () => {
  let props = null;

  beforeEach(() => {
    props = {
    };
  });

  describe('generateHeader()', () => {
    let gridfield = null;

    it('should return props.header if it is set', () => {
      props.header = <tr className="header" />;

      gridfield = ReactTestUtils.renderIntoDocument(
        <GridFieldTable {...props} />
      );

      expect(gridfield.generateHeader().props.className).toBe('header');
    });

    it('should generate and return a header from props.data if it is set', () => {

    });

    it('should return null if props.header and props.data are both not set', () => {
      gridfield = ReactTestUtils.renderIntoDocument(
        <GridFieldTable {...props} />
      );

      expect(gridfield.generateHeader()).toBe(null);
    });
  });

  describe('generateRows()', () => {
    let gridfield = null;

    it('should return props.rows if it is set', () => {
      props.rows = [<tr className="row" key="row1"><td>row1</td></tr>];

      gridfield = ReactTestUtils.renderIntoDocument(
        <GridFieldTable {...props} />
      );

      expect(gridfield.generateRows()[0].props.className).toBe('row');
    });

    it('should generate and return rows from props.data if it is set', () => {

    });

    it('should return null if props.rows and props.data are both not set', () => {
      gridfield = ReactTestUtils.renderIntoDocument(
        <GridFieldTable {...props} />
      );

      expect(gridfield.generateRows()).toBe(null);
    });
  });
});
