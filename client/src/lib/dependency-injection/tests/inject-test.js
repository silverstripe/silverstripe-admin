/* global jest, test, describe, beforeEach, it, pit, expect, process */

import React, { Component } from 'react';
import { render } from '@testing-library/react';
import inject from '../inject';
import injectorContext from '../injectorContext';

const injectorGet = jest.fn(item => item);
const emptyComponent = () => <div>Empty</div>;

const provideTestInjector = (context) => (Injectable) => {
  class InjectorProvider extends Component {
    getChildContext() {
      return {
        injector: {
          get: injectorGet,
          validate: item => item,
          context,
        },
      };
    }

    render() {
      return <Injectable {...this.props} />;
    }
  }
  InjectorProvider.childContextTypes = injectorContext;
  return InjectorProvider;
};

test('inject() The higher-order component should throw for incorrect params', () => {
  expect(() => {
    const injected = inject()(emptyComponent);

    expect(injected).toBeTruthy();
  }).not.toThrow();

  expect(() => {
    inject('TestComponent')(emptyComponent);
  }).toThrow();

  expect(() => {
    inject(['TestComponent'], 'not a function')(emptyComponent);
  }).toThrow();

  expect(() => {
    inject(['TestComponent'], () => 'a function', 'not a function')(emptyComponent);
  }).toThrow();

  expect(() => {
    const injected = inject(['TestComponent'], () => 'a function', () => 'a function')(emptyComponent);

    expect(injected).toBeTruthy();
  }).not.toThrow();
});

test('inject() The higher-order component should throw for incorrect params', () => {
  const components = ['TestComponent'];
  const injected = inject(components, () => 'not an object')(emptyComponent);
  expect(() => injected()).toThrow();
});

test('inject() The higher-order component should provide the TestComponent in the TestComponent prop', () => {
  const components = ['TestComponent'];
  const testInjector = provideTestInjector();
  const checkComponent = ({ TestComponent }) => {
    expect(TestComponent).toBe('TestComponent');
    return <div>Rendered</div>;
  };
  const injected = inject(components)(checkComponent);
  const MyComponent = testInjector(injected);
  const { container } = render(<MyComponent />);
  expect(container.querySelector('div').textContent).toBe('Rendered');
  expect(injectorGet).toBeCalledWith('TestComponent', undefined);
});

test('inject() The higher-order component should provide the TestComponent in the testing prop', () => {
  const components = ['TestComponent'];
  const testInjector = provideTestInjector();
  const checkComponent = ({ testing }) => {
    expect(testing).toBe('TestComponent');
    return <div>Rendered</div>;
  };
  const mapToProps = (TestComponent) => ({ testing: TestComponent });
  const injected = inject(components, mapToProps)(checkComponent);
  const MyComponent = testInjector(injected);
  const { container } = render(<MyComponent />);
  expect(container.querySelector('div').textContent).toBe('Rendered');
  expect(injectorGet).toBeCalledWith('TestComponent', undefined);
});

test('inject() The higher-order component should not override the parent provided component the testing prop', () => {
  const components = ['TestComponent'];
  const testInjector = provideTestInjector();
  const checkComponent = ({ testing }) => {
    expect(testing).toBe('AnotherComponent');
    return <div>Rendered</div>;
  };
  const mapToProps = (TestComponent) => ({ testing: TestComponent });
  const injected = inject(components, mapToProps)(checkComponent);
  const MyComponent = testInjector(injected);
  const { container } = render(<MyComponent testing="AnotherComponent" />);
  expect(container.querySelector('div').textContent).toBe('Rendered');
  expect(injectorGet).toBeCalledWith('TestComponent', undefined);
});

test('inject() The context provided should pass the current props and context to the getContext callback', () => {
  const components = ['TestComponent'];
  const testInjector = provideTestInjector('def');
  const testContext = (props, currentContext) => {
    expect(props.passthrough).toBe('abc');
    expect(currentContext).toBe('def');
    return currentContext;
  };
  const injected = inject(components, null, testContext)(emptyComponent);
  const MyComponent = testInjector(injected);
  const { container } = render(<MyComponent passthrough="abc" />);
  expect(container.querySelector('div').textContent).toBe('Empty');
  expect(injectorGet).toBeCalledWith('TestComponent', 'def');
});

test('inject() The context provided should see the newly created context in the registered component', () => {
  const components = ['TestComponent'];
  const testInjector = provideTestInjector('def');
  const testContext = (props) => {
    expect(props.passthrough).toBe('abc');
    return 'defghi';
  };
  const injected = inject(components, null, testContext)(emptyComponent);
  const MyComponent = testInjector(injected);
  const { container } = render(<MyComponent passthrough="abc" />);
  expect(container.querySelector('div').textContent).toBe('Empty');
  expect(injectorGet).toBeCalledWith('TestComponent', 'defghi');
});
