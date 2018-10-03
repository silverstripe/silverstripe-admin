/* global jest, describe, beforeEach, it, expect, Event */

import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { Component as Form } from '../Form';
import FormAlert from '../../FormAlert/FormAlert';

describe('Form', () => {
  let props = null;

  beforeEach(() => {
    props = {
      valid: true,
      attributes: {
        action: 'foo',
        method: 'GET',
      },
      fields: [],
      mapFieldsToComponents: () => {},
      mapActionsToComponents: () => {},
    };
  });

  describe('renderMessages()', () => {
    it('returns form messages as alerts', () => {
      props.messages = [
        { message: 'Looks good to me' },
        { message: 'You could try this' },
      ];

      const form = ReactTestUtils.renderIntoDocument(
        <Form {...props} />
      );
      const messages = form.renderMessages();

      expect(messages.length).toBe(2);

      expect(messages[0].type).toEqual(FormAlert);
      expect(messages[0].props.className).toContain('message-box--panel-top');

      expect(messages[1].props.message).toBe('You could try this');
      expect(messages[1].props.className).not.toContain('message-box--panel-top');
    });
  });

  describe('render()', () => {
    it('adds an invalid class when valid is false', () => {
      props.valid = false;

      const form = ReactTestUtils.renderIntoDocument(
        <Form {...props} />
      );

      const result = ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'form');
      expect(result.length).toBe(1);
      expect(result[0].classList).toContain('form--invalid');
    });

    it('adds custom classes to the form container', () => {
      props.attributes.className = 'foobar';

      const form = ReactTestUtils.renderIntoDocument(
        <Form {...props} />
      );

      const result = ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'form');
      expect(result.length).toBe(1);
      expect(result[0].classList).toContain('foobar');
    });
  });
});
