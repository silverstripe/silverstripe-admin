/* global jest, describe, beforeEach, it, expect, Event */

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { Component as CompositeField } from '../CompositeField';

describe('CompositeField', () => {
  let props = null;

  beforeEach(() => {
    props = {
      data: {
        tag: '',
        legend: '',
      },
      extraClass: '',
    };
  });

  describe('render()', () => {
    it('renders its children', () => {
      props.data.tag = 'div';

      const field = ReactTestUtils.renderIntoDocument(
        <CompositeField {...props}>
          <input name="child1" />
          <input name="child2" />
        </CompositeField>
      );

      const findNodesByTag = ReactTestUtils.scryRenderedDOMComponentsWithTag;
      expect(findNodesByTag(field, 'div').length).toBe(1);
      expect(findNodesByTag(field, 'input').length).toBe(2);
    });
  });

  describe('getLegend()', () => {
    it('returns null when the legend is undefined', () => {
      const result = ReactTestUtils.renderIntoDocument(
        <CompositeField {...props} />
      );

      expect(result.getLegend()).toBeNull();
    });

    it('returns null when the tag is not a fieldset', () => {
      props.data.tag = 'small';

      const result = ReactTestUtils.renderIntoDocument(
        <CompositeField {...props} />
      );

      expect(result.getLegend()).toBeNull();
    });

    it('returns a legend tag', () => {
      props.data.tag = 'fieldset';
      props.data.legend = 'You are a legend!';

      const result = ReactTestUtils.renderIntoDocument(
        <CompositeField {...props} />
      );

      expect(result.getLegend()).toEqual(
        <legend>You are a legend!</legend>
      );
    });
  });

  describe('getClassName()', () => {
    it('includes default class name and extra classes', () => {
      props.className = 'default-class';
      props.extraClass = 'extra-class';

      const result = ReactTestUtils.renderIntoDocument(
        <CompositeField {...props} />
      );

      expect(result.getClassName()).toContain('default-class');
      expect(result.getClassName()).toContain('extra-class');
    });
  });
});
