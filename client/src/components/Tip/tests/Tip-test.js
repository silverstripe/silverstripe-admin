/* global jest, describe, beforeEach, afterEach, it, expect */

import React from 'react';
import ReactDOM from 'react-dom';
import Tip, { TIP_IMPORTANCE_LEVELS, TIP_TYPES } from '../Tip';

const baseProps = {
  content: 'Test content',
  fieldTitle: 'Test',
  id: 'test',
};

let container;

/**
 * NOTE: Due to the Popover component expecting to find its target in the DOM, these tests render
 * the component there. This isn't great, but aside from dropping the Popover component or hacking
 * it, the developer was unable to find a solution for testing purposes in the time they had.
 */
describe('Tip', () => {
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  describe('render()', () => {
    it('should display a button with a lamp icon by default', () => {
      ReactDOM.render(<Tip {...baseProps} />, container);

      expect(document.querySelectorAll('.btn.font-icon-lamp').length).toEqual(1);
    });

    it('should display a button with a different icon if specified', () => {
      ReactDOM.render(<Tip {...baseProps} icon="white-question" />, container);

      expect(document.querySelectorAll('.btn.font-icon-white-question').length).toEqual(1);
    });

    it('should not display the popover by default', () => {
      ReactDOM.render(<Tip {...baseProps} />, container);

      expect(document.querySelectorAll('.popover').length).toEqual(0);
    });

    it('should display a grey icon by default (when importance is set to `normal`)', () => {
      ReactDOM.render(<Tip {...baseProps} />, container);

      expect(document.querySelectorAll('.btn.text-muted').length).toEqual(1);
    });

    it('should display a red icon when the importance is bumped to `high`', () => {
      ReactDOM.render(<Tip {...baseProps} importance={TIP_IMPORTANCE_LEVELS.HIGH} />, container);

      expect(document.querySelectorAll('.btn.text-danger').length).toEqual(1);
    });

    it('should render an input group tip by default', () => {
      ReactDOM.render(<Tip {...baseProps} />, container);
      expect(document.querySelectorAll('.tip').length).toEqual(1);
      expect(document.querySelectorAll('.tip--title').length).toEqual(0);
      expect(document.querySelectorAll('.tip--input-group').length).toEqual(1);
    });

    it('should render a title tip if specified', () => {
      ReactDOM.render(<Tip {...baseProps} type={TIP_TYPES.TITLE} />, container);
      expect(document.querySelectorAll('.tip').length).toEqual(1);
      expect(document.querySelectorAll('.tip--title').length).toEqual(1);
      expect(document.querySelectorAll('.tip--input-group').length).toEqual(0);
    });
  });
});
