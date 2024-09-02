/* global jest, describe, beforeEach, it, pit, expect, process */
/* eslint-disable react/no-multi-comp */

import React from 'react';
import { render } from '@testing-library/react';

import loadComponent from '../loadComponent';

function TestComponent() {
  return <span className="test-component">abc</span>;
}

const mockProvider = Item => Item;

jest.mock('../provideInjector', () => function mockInjector(Injected) {
  // eslint-disable-next-line
  const React = require('react');
  // eslint-disable-next-line
  const PropTypes = require('prop-types');

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
    injector: PropTypes.shape({
      get: PropTypes.func,
    }),
  };

  return MockedInjector;
});

jest.mock('../Container', () => ({ ready: (callback) => { callback(); } }));

describe('loadComponent', () => {
  it('should use the provided injector by default', () => {
    const component = loadComponent(TestComponent);
    expect(component.name).toBe('MockedInjector');
  });

  it('should return the injected TestComponent (TestRegisteredComponent) when loading from Injector', () => {
    const Temp = loadComponent('TestComponent', null);
    const { container } = render(<Temp />);
    expect(container.querySelector('span').textContent).toBe('def');
  });

  it('should return the Loader Component when given a pass through provider', () => {
    const Component = loadComponent(TestComponent, {}, mockProvider);
    expect(Component.name).toBe('LegacyLoader');
  });

  it('should return null if it has not mounted yet', () => {
    const Temp = loadComponent(TestComponent, {}, mockProvider);
    const temp = new Temp({});
    expect(temp.render()).toBe(null);
  });

  it('should return a rendered TestComponent if it has mounted and context is falsey', () => {
    const Temp = loadComponent(TestComponent, null, mockProvider);
    const { container } = render(<Temp />);
    expect(container.querySelector('.test-component')).not.toBe(null);
  });
});
