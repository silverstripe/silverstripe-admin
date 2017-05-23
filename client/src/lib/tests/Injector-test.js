/* global jest, jasmine, describe, beforeEach, it, pit, expect, process */
jest.unmock('../Injector');

import Injector, { provideInjector, withInjector } from '../Injector';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

beforeEach(() => {
  Injector.__reset__();
});

const expectError = (func) => {
  let error = null;
  try {
    func();
  } catch (e) {
    error = e;
  }
  expect(typeof error).toBe('object');
  expect(error.message).toBeTruthy();
};

describe('Injector', () => {
  describe('Container API', () => {
    describe('Registering', () => {
      it('should throw if the injector is accessed before it is loaded', () => {
        const TestService = () => 'test service';
        Injector.register('TestService', TestService);
        expectError(() => Injector.get('TestService'));
        Injector.load();
        expect(Injector.get('TestService')()).toBe('test service');
      });
    });
    it('should throw if you register the same service twice unless you force', () => {
      const TestService = () => 'test service';
      Injector.register('TestService', TestService);
      const NewService = () => 'new service';
      expectError(() => Injector.register('TestService', NewService));
      Injector.register('TestService', NewService, { force: true });
      Injector.load();
      expect(Injector.get('TestService')()).toBe('new service');
    });
    it('should throw if you try to mutate the DI container after load', () => {
      const TestService = () => 'test service';
      Injector.register('TestService', TestService);
      Injector.load();
      expectError(() => Injector.register('Foo', () => {}));
    });
  });
  describe('Updating', () => {
    it('should throw if you try to update the DI container after load', () => {
      const TestService = () => 'test service';
      Injector.register('TestService', TestService);
      Injector.load();
      expectError(() => Injector.update(
        {
          name: 'test',
        },
        () => {}
      ));
    });
    it('should throw on bad metadata', () => {
      const TestService = () => 'test service';
      Injector.register('TestService', TestService);
      Injector.load();
      expectError(() => Injector.update(
        {
          foo: 'test',
        },
        () => {}
      ));
    });
    it('should override components', () => {
      const TestComponent = () => <h2>Test</h2>;
      Injector.register('TestComponent', TestComponent);
      const HOC = (Component) => () => <div className="hoc"><Component /></div>;
      Injector.update({ name: 'test' }, update => update('TestComponent', HOC));
      Injector.load();
      const Service = Injector.get('TestComponent');
      // eslint-disable-next-line react/prefer-stateless-function, react/no-multi-comp
      class TestClass extends React.Component {
        render() {
          return <Service />;
        }
      }
      const rendered = ReactTestUtils.renderIntoDocument(<TestClass />);
      const found = ReactTestUtils.findRenderedDOMComponentWithClass(
        rendered,
        'hoc'
      );
      expect(found).toBeTruthy();
    });
    it('should set a display name components', () => {
      const TestComponent1 = () => <h2>Test</h2>;
      Injector.register('TestComponent1', TestComponent1);
      const HOC1 = (TestComponent) => () => <div className="hoc"><TestComponent /></div>;
      Injector.update({ name: 'test' }, update => update('TestComponent1', HOC1));
      // eslint-disable-next-line react/prefer-stateless-function, react/no-multi-comp
      class TestComponent2 extends React.Component {
        render() {
          return <h3>Hello</h3>;
        }
      }
      TestComponent2.displayName = 'Testo';
      Injector.register('TestComponent2', TestComponent2);
      const HOC2 = (TestComponent) => {
        // eslint-disable-next-line react/prefer-stateless-function, react/no-multi-comp
        class TestClass extends React.Component {
          render() {
            return <div className="hoc"><TestComponent /></div>;
          }
        }

        return TestClass;
      };

      Injector.update({ name: 'test' }, update => update('TestComponent2', HOC2));
      Injector.load();
      const Service1 = Injector.get('TestComponent1');
      expect(Service1.displayName).toBe('test(TestComponent1)');
      const Service2 = Injector.get('TestComponent2');
      expect(Service2.displayName).toBe('test(Testo)');
    });
    it('resolves priorities', () => {
      const OriginalComponent = ({ title }) => <h2>{title}</h2>;
      OriginalComponent.propTypes = {
        title: React.PropTypes.string,
      };
      Injector.register('Original', OriginalComponent);
      // eslint-disable-next-line react/prop-types
      const HOC_C = (Original) => (props) => <Original title={`C${props.title}`} />;
      // eslint-disable-next-line react/prop-types
      const HOC_A = (Original) => (props) => <Original title={`A${props.title}`} />;
      // eslint-disable-next-line react/prop-types
      const HOC_B = (Original) => (props) => <Original title={`B${props.title}`} />;

      // Ensure that ABC is applied in reverse (CBA), since the HOCs prepend
      Injector.update(
        {
          name: 'module-b',
          after: 'module-c',
          before: 'module-a',
        },
        update => update('Original', HOC_B)
      );
      Injector.update(
        {
          name: 'module-a',
          after: 'module-c',
        },
        update => update('Original', HOC_A)
      );
      Injector.update(
        {
          name: 'module-c',
          before: 'module-b',
        },
        update => update('Original', HOC_C)
      );

      Injector.load();

      const Injected = Injector.get('Original');
      // eslint-disable-next-line react/prefer-stateless-function, react/no-multi-comp
      class TestComponent extends React.Component {
        render() {
          return <Injected title="DEFG" />;
        }
      }
      const rendered = ReactTestUtils.renderIntoDocument(<TestComponent />);
      const h2 = ReactTestUtils.findRenderedDOMComponentWithTag(rendered, 'h2');
      expect(h2.innerHTML).toBe('ABCDEFG');
    });
  });
  describe('Top-level HOCs', () => {
    it('adds Injector to context', () => {
      const AwesomeButton = (props) => (
        <button className="awesome-button">{props.children}</button>
      );
      AwesomeButton.propTypes = {
        children: React.PropTypes.any,
      };
      Injector.register('AwesomeButton', AwesomeButton);
      Injector.load();
      // eslint-disable-next-line react/prefer-stateless-function, react/no-multi-comp
      class AwesomeForm extends React.Component {
        render() {
          const Button = this.context.injector.get('AwesomeButton');
          return <form><Button>Click me</Button></form>;
        }
      }
      // eslint-disable-next-line react/prefer-stateless-function, react/no-multi-comp
      class App extends React.Component {
        render() {
          return <div>{this.props.children}</div>;
        }
      }
      App.propTypes = {
        children: React.PropTypes.any,
      };

      const InjectorProvider = provideInjector(App);
      const AwesomeFormWithInjector = withInjector(AwesomeForm);
      const rendered = ReactTestUtils.renderIntoDocument(
          <InjectorProvider>
            <AwesomeFormWithInjector />
          </InjectorProvider>
      );
      const tag = ReactTestUtils.findRenderedDOMComponentWithClass(
        rendered,
        'awesome-button'
      );

      expect(tag).toBeTruthy();
    });
  });
});
