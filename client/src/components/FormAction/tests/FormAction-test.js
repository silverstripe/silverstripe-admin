/* global jest, describe, it, expect, beforeEach */

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import FormAction from '../FormAction';

describe('FormAction', () => {
  let props;
  let component;

  beforeEach(() => {
    props = {};
    component = null;
  });

  describe('isPrimary()', () => {
    it('detects via the name if the button should be primary', () => {
      props = {
        ...props,
        name: 'action_save',
      };

      component = ReactTestUtils.renderIntoDocument(
        <FormAction {...props} />
      );

      expect(component.isPrimary()).toBe(true);
    });

    it('detects via a legacy class name if the button should be primary', () => {
      props = {
        ...props,
        extraClass: 'foo ss-ui-action-constructive bar',
      };

      component = ReactTestUtils.renderIntoDocument(
        <FormAction {...props} />
      );

      expect(component.isPrimary()).toBe(true);
    });
  });

  describe('isDisabled()', () => {
    it('is true when disabled prop is passed', () => {
      props = {
        ...props,
        disabled: true,
      };

      component = ReactTestUtils.renderIntoDocument(
        <FormAction {...props} />
      );

      expect(component.isDisabled()).toBe(true);
    });

    it('treats readonly prop as disabled', () => {
      props = {
        ...props,
        disabled: false,
        readOnly: true,
      };

      component = ReactTestUtils.renderIntoDocument(
        <FormAction {...props} />
      );

      expect(component.isDisabled()).toBe(true);
    });
  });
});
