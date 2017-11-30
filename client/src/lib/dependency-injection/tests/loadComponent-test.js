/* global jest, jasmine, describe, beforeEach, it, pit, expect, process */
/* eslint-disable react/no-multi-comp */

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

function TestComponent() {
  return <span>abc</span>;
}

const mockProvider = Item => Item;

jest.mock('../provideInjector', () => function mockInjector(Injected) {
  // eslint-disable-next-line
  const React = require('react');
  function TestRegisteredComponent() {
    return <span>def</span>;
  }
  class MockedInjector extends React.Component {
    getChildContext() {
      return {
        injector: {
          get: () => TestRegisteredComponent,
        },
      };
    }

    render() {
      return <Injected {...this.props} />;
    }
  }

  MockedInjector.childContextTypes = {
    injector: React.PropTypes.shape({
      get: React.PropTypes.func,
    }),
  };

  return MockedInjector;
});

jest.mock('../Container', () => ({ ready: (callback) => { callback(); } }));
jest.mock('react-apollo', () => ({
  ApolloProvider: ({ children }) => <div>{children}</div>,
}));

import loadComponent from '../loadComponent';

describe('loadComponent', () => {
  it('should use the provided injector by default', () => {
    const component = loadComponent(TestComponent);

    expect(component.name).toBe('MockedInjector');
  });

  it('should return the injected TestComponent (TestRegisteredComponent) when loading from Injector', () => {
    const Temp = loadComponent('TestComponent', null);
    const temp = ReactTestUtils.renderIntoDocument(<Temp />);
    const testComponent = ReactTestUtils.findRenderedDOMComponentWithTag(temp, 'span');

    expect(testComponent.textContent).toBe('def');
  });

  it('should return the Loader Component when given a pass through provider', () => {
    const component = loadComponent(TestComponent, {}, mockProvider);

    expect(component.name).toBe('LegacyLoader');
  });

  it('should return null if it has not mounted yet', () => {
    const Temp = loadComponent(TestComponent, {}, mockProvider);
    const temp = new Temp({});

    expect(temp.render()).toBe(null);
  });

  it('should return a rendered ApolloProvider if it has mounted', () => {
    const Temp = loadComponent(TestComponent, {}, mockProvider);
    const temp = ReactTestUtils.renderIntoDocument(<Temp />);
    const rendered = temp.render();

    expect(rendered.type.name).toBe('ApolloProvider');
  });

  it('should return a rendered TestComponent if it has mounted and context is falsey', () => {
    const Temp = loadComponent(TestComponent, null, mockProvider);
    const temp = ReactTestUtils.renderIntoDocument(<Temp />);
    const rendered = temp.render();
    const testComponent = ReactTestUtils.findRenderedDOMComponentWithTag(temp, 'span');

    expect(rendered.type.name).toBe('TestComponent');
    expect(testComponent.textContent).toBe('abc');
  });
});
