/* global jest, describe, it, expect */

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import Badge from '../Badge';

describe('Badge', () => {
  describe('render()', () => {
    let badge = null;

    it('should return null if status is empty', () => {
      badge = ReactTestUtils.renderIntoDocument(
        <Badge
          status={null}
          message=""
          className=""
        />
      );

      expect(badge.render()).toBeNull();
    });

    it('should return a Bootstrap style badge when valid', () => {
      badge = ReactTestUtils.renderIntoDocument(
        <Badge
          status="success"
          message="Hello world"
          className="customclass"
        />
      );

      const result = badge.render();
      expect(result.props.className).toContain('customclass');
      expect(result.props.className).toContain('badge-success');
      expect(result.props.children).toContain('Hello world');
    });
  });
});
