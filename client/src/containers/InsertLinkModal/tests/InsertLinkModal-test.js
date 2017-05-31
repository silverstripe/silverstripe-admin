/* global jest, jasmine, describe, it, expect, beforeEach */

jest.mock('components/FormBuilderModal/FormBuilderModal');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { InsertLinkModal, createInsertLinkModal } from '../InsertLinkModal';

describe('InsertLinkModal', () => {
  let modal = null;
  let props = null;

  beforeEach(() => {
    props = {
      onInsert: jest.fn(),
      onHide: jest.fn(),
      setOverrides: jest.fn(),
    };
  });

  describe('createInsertLinkModal()', () => {
    let initState = null;

    beforeEach(() => {
      initState = {
        config: {
          sections: [],
        },
      };
    });

    it('should provide the proper sectionConfig and schema to the component', () => {
      const section = {
        name: 'TestSection',
        form: {
          TestForm: {
            schemaUrl: 'TestSchemaUrl',
          },
        },
      };
      initState.config.sections.push(section);

      const store = createStore(() => initState, initState);
      const LinkModalComponent = createInsertLinkModal('TestSection', 'TestForm');

      // prep with store, so that `connect()` can call the proper state objects
      const app = ReactTestUtils.renderIntoDocument(
        <Provider store={store}>
          <LinkModalComponent {...props} />
        </Provider>
      );
      modal = ReactTestUtils.findRenderedComponentWithType(app, InsertLinkModal);

      expect(modal.props.sectionConfig).toBe(section);
      expect(modal.props.schemaUrl).toBe('TestSchemaUrl');
    });
  });

  describe('handleSubmit()', () => {
    let submitFn = null;
    beforeEach(() => {
      submitFn = jest.fn();
      modal = ReactTestUtils.renderIntoDocument(
        <InsertLinkModal {...props} />
      );
    });

    it('should call onHide callback when the action is cancel', () => {
      modal.handleSubmit({}, 'action_cancel', submitFn);

      expect(props.onHide).toBeCalled();
      expect(submitFn).not.toBeCalled();
    });

    it('should call onInsert callback when any other action is called', () => {
      modal.handleSubmit({ ID: 25 }, 'action_insert', submitFn);

      expect(props.onInsert).toBeCalledWith({ ID: 25 }, 'action_insert');
      expect(submitFn).not.toBeCalled();
    });
  });
});
