/* global jest, jasmine, describe, it, expect, beforeEach */

jest.mock('components/FormAlert/FormAlert');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import fieldHolder from '../FieldHolder';

describe('FieldHolder', () => {
  const InnerField = () => <div>Field</div>;
  const Holder = fieldHolder(InnerField);
  let props = null;
  let component = null;

  beforeEach(() => {
    props = {};
  });

  describe('renderDescription()', () => {
    it('should not return anything if description is null', () => {
      props.description = null;
      component = ReactTestUtils.renderIntoDocument(
        <Holder {...props} />
      );

      const description = component.renderDescription();

      expect(description).toBe(null);
    });

    it('should return a node if description is a string', () => {
      props.description = 'test node';
      component = ReactTestUtils.renderIntoDocument(
        <Holder {...props} />
      );

      const description = component.renderDescription();

      expect(description).not.toBe(null);
    });
  });

  describe('renderMessage()', () => {
    it('should not return anything if meta is empty', () => {
      props.meta = {};
      component = ReactTestUtils.renderIntoDocument(
        <Holder {...props} />
      );

      const message = component.renderMessage();

      expect(message).toBe(null);
    });

    it('should render message property', () => {
      props.message = {
        value: 'hello!',
        type: 'errro',
      };

      component = ReactTestUtils.renderIntoDocument(
        <Holder {...props} />
      );

      const formMsg = ReactTestUtils
        .findRenderedDOMComponentWithClass(component, 'form__field-message');
      expect(formMsg.textContent).toBe('hello!');
    });

    it('should let meta error override message if dirty', () => {
      props.message = {
        value: 'hello!',
        type: 'errro',
      };
      props.meta = {
        error: {
          value: 'My error',
        },
        touched: true,
        dirty: true,
      };

      component = ReactTestUtils.renderIntoDocument(
        <Holder {...props} />
      );

      const formMsg = ReactTestUtils
        .findRenderedDOMComponentWithClass(component, 'form__field-message');
      expect(formMsg.textContent).toBe('My error');
    });

    it('should let message override meta error override if not dirty', () => {
      props.message = {
        value: 'hello!',
        type: 'errro',
      };
      props.meta = {
        error: {
          value: 'My error',
        },
        touched: true,
        dirty: false,
      };

      component = ReactTestUtils.renderIntoDocument(
        <Holder {...props} />
      );

      const formMsg = ReactTestUtils
        .findRenderedDOMComponentWithClass(component, 'form__field-message');
      expect(formMsg.textContent).toBe('hello!');
    });

    it('should not return anything if not touched', () => {
      props.meta = {
        error: 'My error',
        touched: false,
      };
      component = ReactTestUtils.renderIntoDocument(
        <Holder {...props} />
      );

      const message = component.renderMessage();

      expect(message).toBe(null);
    });

    it('should return a node if touched and has an error', () => {
      props.meta = {
        error: 'My error',
        touched: true,
      };
      component = ReactTestUtils.renderIntoDocument(
        <Holder {...props} />
      );

      const message = component.renderMessage();

      expect(message).not.toBe(null);
    });
  });

  describe('renderLeftTitle()', () => {
    it('should return a title when leftTitle is set', () => {
      props.leftTitle = 'My left title';
      component = ReactTestUtils.renderIntoDocument(
        <Holder {...props} />
      );

      const title = component.renderLeftTitle();

      expect(title).not.toBe(null);
    });

    it('should return a title when title is set and leftTitle is not set', () => {
      props.title = 'My title';
      component = ReactTestUtils.renderIntoDocument(
        <Holder {...props} />
      );

      const title = component.renderLeftTitle();

      expect(title).not.toBe(null);
    });

    it('should return the left title when title and leftTitle are both set', () => {
      props.leftTitle = 'My left title';
      props.title = 'My title';
      component = ReactTestUtils.renderIntoDocument(
        <Holder {...props} />
      );

      const title = component.renderLeftTitle();

      expect(title.props.children).toBe('My left title');
    });

    it('should not return anything if hideLabels is set', () => {
      props.leftTitle = 'My left title';
      props.hideLabels = true;
      component = ReactTestUtils.renderIntoDocument(
        <Holder {...props} />
      );

      const title = component.renderLeftTitle();

      expect(title).toBe(null);
    });
  });

  describe('renderRightTitle()', () => {
    it('should not return anything if rightTitle is not set', () => {
      component = ReactTestUtils.renderIntoDocument(
        <Holder {...props} />
      );

      const title = component.renderRightTitle();

      expect(title).toBe(null);
    });

    it('should return a title when rightTitle is set', () => {
      props.rightTitle = 'My right title';
      component = ReactTestUtils.renderIntoDocument(
        <Holder {...props} />
      );

      const title = component.renderRightTitle();

      expect(title).not.toBe(null);
    });

    it('should not return anything if hideLabels is set', () => {
      props.rightTitle = 'My right title';
      props.hideLabels = true;
      component = ReactTestUtils.renderIntoDocument(
        <Holder {...props} />
      );

      const title = component.renderRightTitle();

      expect(title).toBe(null);
    });
  });

  describe('renderField()', () => {
    it('should return just the field if no prefix or suffix', () => {
      component = ReactTestUtils.renderIntoDocument(
        <Holder {...props} />
      );

      const field = component.renderField();

      expect(field.type).toBe(InnerField);
    });

    it('should return a wrapped field with a prefix', () => {
      props.data = {
        prefix: 'My prefix',
      };
      component = ReactTestUtils.renderIntoDocument(
        <Holder {...props} />
      );

      const field = component.renderField();

      expect(field.props.children[0].props.children).toBe('My prefix');
      expect(field.props.children[1].type).toBe(InnerField);
      expect(field.props.children[2]).toBe(undefined);
    });

    it('should return a wrapped field with a suffix', () => {
      props.data = {
        suffix: 'My suffix',
      };
      component = ReactTestUtils.renderIntoDocument(
        <Holder {...props} />
      );

      const field = component.renderField();

      expect(field.props.children[0]).toBe(undefined);
      expect(field.props.children[1].type).toBe(InnerField);
      expect(field.props.children[2].props.children).toBe('My suffix');
    });
  });
});
