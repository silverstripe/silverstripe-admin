/* global jest, jasmine, describe, beforeEach, it, pit, expect, process */

import React, { Component } from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import inject from '../inject';
import injectorContext from '../injectorContext';

describe('inject()', () => {
  const emptyComponent = () => <div>Empty</div>;
  let injectorGet = null;
  let provideTestInjector = null;

  beforeEach(() => {
    injectorGet = jest.fn(item => item);
    provideTestInjector = (context) => (Injectable) => {
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
  });

  describe('The higher-order component', () => {
    it('should throw for incorrect params', () => {
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
  });

  describe('The component inside', () => {
    const components = ['TestComponent'];
    let testInjector = null;

    beforeEach(() => {
      testInjector = provideTestInjector();
    });

    it('should throw an exception if mapDependenciesToProps returns a non-object', () => {
      const injected = inject(components, () => 'not an object')(emptyComponent);

      expect(() => injected()).toThrow();
    });

    it('should provide the TestComponent in the TestComponent prop', () => {
      const checkComponent = ({ TestComponent }) => {
        expect(TestComponent).toBe('TestComponent');

        return <div>Rendered</div>;
      };
      const injected = inject(components)(checkComponent);
      const MyComponent = testInjector(injected);

      const rendered = ReactTestUtils.renderIntoDocument(
        <MyComponent />
      );

      expect(ReactTestUtils.findRenderedDOMComponentWithTag(rendered, 'div').textContent).toBe('Rendered');
      expect(injectorGet).toBeCalledWith('TestComponent', undefined);
    });

    it('should provide the TestComponent in the testing prop', () => {
      const checkComponent = ({ testing }) => {
        expect(testing).toBe('TestComponent');

        return <div>Rendered</div>;
      };
      const mapToProps = (TestComponent) => ({ testing: TestComponent });
      const injected = inject(components, mapToProps)(checkComponent);
      const MyComponent = testInjector(injected);

      const rendered = ReactTestUtils.renderIntoDocument(
        <MyComponent />
      );

      expect(ReactTestUtils.findRenderedDOMComponentWithTag(rendered, 'div').textContent).toBe('Rendered');
      expect(injectorGet).toBeCalledWith('TestComponent', undefined);
    });

    it('should not override the parent provided component the testing prop', () => {
      const checkComponent = ({ testing }) => {
        expect(testing).toBe('AnotherComponent');

        return <div>Rendered</div>;
      };
      const mapToProps = (TestComponent) => ({ testing: TestComponent });
      const injected = inject(components, mapToProps)(checkComponent);
      const MyComponent = testInjector(injected);

      const rendered = ReactTestUtils.renderIntoDocument(
        <MyComponent testing="AnotherComponent" />
      );

      expect(ReactTestUtils.findRenderedDOMComponentWithTag(rendered, 'div').textContent).toBe('Rendered');
      expect(injectorGet).toBeCalledWith('TestComponent', undefined);
    });
  });

  describe('The context provided', () => {
    const components = ['TestComponent'];
    let testInjector = null;

    beforeEach(() => {
      testInjector = provideTestInjector('def');
    });


    it('should pass the current props and context to the getContext callback', () => {
      const testContext = (props, currentContext) => {
        expect(props.passthrough).toBe('abc');
        expect(currentContext).toBe('def');

        return currentContext;
      };
      const injected = inject(components, null, testContext)(emptyComponent);
      const MyComponent = testInjector(injected);

      const rendered = ReactTestUtils.renderIntoDocument(
        <MyComponent passthrough="abc" />
      );

      expect(ReactTestUtils.findRenderedDOMComponentWithTag(rendered, 'div').textContent).toBe('Empty');
      expect(injectorGet).toBeCalledWith('TestComponent', 'def');
    });

    it('should see the newly created context in the registered component', () => {
      const testContext = (props, currentContext) => {
        expect(props.passthrough).toBe('abc');
        expect(currentContext).toBe('def');

        return `${currentContext}ghi`;
      };
      const injected = inject(components, null, testContext)(emptyComponent);
      const MyComponent = testInjector(injected);

      const rendered = ReactTestUtils.renderIntoDocument(
        <MyComponent passthrough="abc" />
      );

      expect(ReactTestUtils.findRenderedDOMComponentWithTag(rendered, 'div').textContent).toBe('Empty');
      expect(injectorGet).toBeCalledWith('TestComponent', 'defghi');
    });
  });
});
