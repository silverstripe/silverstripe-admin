/* global jest, describe, beforeEach, it, expect */
import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { Component as UsedOnTable } from '../UsedOnTable';
import provideUsedOnData from '../provideUsedOnData';

describe('UsedOnTable', () => {
  let props = null;

  describe('provideUsedOnData', () => {
    let Provider = null;
    let mockActions = null;
    let mockComponent = null;

    describe('Component behaviour', () => {
      beforeEach(() => {
        mockComponent = jest.fn((givenProps) => {
          // test that props are just passed through
          expect(givenProps).toEqual(props);

          return null;
        });
        mockActions = {
          loadUsedOn: jest.fn(() => null),
        };
        Provider = provideUsedOnData(mockComponent).Component;
        props = {
          identifier: 'abc',
          loading: false,
          usedOn: null,
          data: {
            readUsageEndpoint: {
              url: 'http://www.bob.co.nz',
              method: 'get',
            },
          },
          ...mockActions,
        };
      });

      it('should try to load data onMount', () => {
        expect(mockActions.loadUsedOn).not.toBeCalled();

        ReactTestUtils.renderIntoDocument(
          <Provider {...props} />
        );
        expect(mockActions.loadUsedOn).toBeCalledWith('abc', 'get', 'http://www.bob.co.nz');
        expect(mockComponent).toBeCalled();
      });

      it('should try to load new data if identifier changes', () => {
        const instance = new Provider(props);

        expect(mockActions.loadUsedOn).not.toBeCalled();

        instance.componentWillReceiveProps(props);
        expect(mockActions.loadUsedOn).not.toBeCalled();

        instance.componentWillReceiveProps({ ...props, identifier: 'def' });
        expect(mockActions.loadUsedOn).toBeCalled();
      });
    });
  });

  describe('Component', () => {
    let table = null;

    describe('renderBody', () => {
      it('should show a loading message when needed', () => {
        props = {
          loading: true,
        };

        table = ReactTestUtils.renderIntoDocument(
          <UsedOnTable {...props} />
        );
        const column = ReactTestUtils.findRenderedDOMComponentWithClass(table, 'used-on__message--loading');
        expect(column).toBeTruthy();
        expect(column.textContent).toContain('Loading');
      });

      it('should not show a loading message if loading and there are already results', () => {
        props = {
          loading: true,
          usedOn: [
            { id: 'abc', title: 'now I know', type: 'Page' },
          ]
        };

        table = ReactTestUtils.renderIntoDocument(
          <UsedOnTable {...props} />
        );
        const column = ReactTestUtils.scryRenderedDOMComponentsWithClass(table, 'used-on__message--loading');
        expect(column[0]).toBeFalsy();
      });

      it('should show a empty message when there are no results', () => {
        props = {};

        table = ReactTestUtils.renderIntoDocument(
          <UsedOnTable {...props} />
        );
        const column = ReactTestUtils.findRenderedDOMComponentWithClass(table, 'used-on__message--empty');
        expect(column).toBeTruthy();
        expect(column.textContent).toContain('not used');
      });

      it('should show the error message if there was an error provided', () => {
        props = { error: 'bob did it' };

        table = ReactTestUtils.renderIntoDocument(
          <UsedOnTable {...props} />
        );
        const column = ReactTestUtils.findRenderedDOMComponentWithClass(table, 'used-on__message--error');
        expect(column).toBeTruthy();
        expect(column.textContent).toContain('bob did it');
      });
    });

    describe('renderRow', () => {
      let item = null;

      beforeEach(() => {
        item = { id: 'abc', title: 'now I know', type: 'Page' };
      });

      it('should convert index to 1-based count', () => {
        props = {
          usedOn: [item]
        };

        table = ReactTestUtils.renderIntoDocument(
          <UsedOnTable {...props} />
        );
        const index = ReactTestUtils.scryRenderedDOMComponentsWithClass(table, 'used-on__col--index');
        // header
        expect(index[0].textContent).toBe('#');
        // index we're testing
        expect(index[1].textContent).toBe('1');
      });

      it('should show the state badge if item has state', () => {
        props = {
          usedOn: [
            { ...item, state: 'draft' },
          ]
        };

        table = ReactTestUtils.renderIntoDocument(
          <UsedOnTable {...props} />
        );
        const badge = ReactTestUtils.findRenderedDOMComponentWithClass(table, 'used-on__badge');
        expect(badge).toBeTruthy();
        expect(badge.textContent).toContain('draft');
      });

      it('should not show a badge if the item has no state', () => {
        props = {
          usedOn: [item]
        };

        table = ReactTestUtils.renderIntoDocument(
          <UsedOnTable {...props} />
        );
        const badge = ReactTestUtils.scryRenderedDOMComponentsWithClass(table, 'used-on__badge');
        expect(badge[0]).toBeFalsy();
      });

      it('should wrap the title in a link if the property is provided', () => {
        props = {
          usedOn: [
            { ...item, link: 'http://www.silverstripe.org' },
          ],
        };

        table = ReactTestUtils.renderIntoDocument(
          <UsedOnTable {...props} />
        );
        const title = ReactTestUtils.scryRenderedDOMComponentsWithClass(table, 'used-on__col--title');
        expect(title[1].textContent).toContain('now I know');
        expect(title[1].children[0].tagName).toBe('A');
      });

      it('should not wrap the title in a link when no property provided', () => {
        props = {
          usedOn: [item],
        };

        table = ReactTestUtils.renderIntoDocument(
          <UsedOnTable {...props} />
        );
        const title = ReactTestUtils.scryRenderedDOMComponentsWithClass(table, 'used-on__col--title');
        expect(title[1].textContent).toContain('now I know');
        expect(title[1].children[0].tagName).not.toBe('A');
      });

      it('should show the type provided', () => {
        props = {
          usedOn: [
            { ...item, type: 'Boom!' },
          ],
        };

        table = ReactTestUtils.renderIntoDocument(
          <UsedOnTable {...props} />
        );
        const title = ReactTestUtils.scryRenderedDOMComponentsWithClass(table, 'used-on__col--type');
        expect(title[1].textContent).toContain('Boom!');
      });
    });
  });
});
