/* global jest, jasmine, describe, beforeEach, it, pit, expect, process */
jest.unmock('../Injector');
jest.unmock('../dependency-injection/MiddlewareRegistry');

import Injector, { provideInjector, withInjector, inject } from '../Injector';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

beforeEach(() => {
  Injector.__reset__(true);
});

xdescribe('Injector', () => {
  describe('Updating', () => {
    it('should set a display name on objects', () => {
      const TestComponent1 = () => <h2>Test</h2>;
      Injector.register('TestComponent1', TestComponent1);
      const HOC1 = (TestComponent) => () => <div className="hoc"><TestComponent /></div>;
      Injector.transform('test', update => update('TestComponent1', HOC1));
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

      Injector.transform('test', update => update('TestComponent2', HOC2, 'Besto'));
      Injector.load();
      const Service1 = Injector.get('TestComponent1');
      expect(Service1.displayName).toBe('test(TestComponent1)');
      const Service2 = Injector.get('TestComponent2');
      expect(Service2.displayName).toBe('Besto(Testo)');
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

    it('maps dependencies', () => {
      // eslint-disable-next-line react/prefer-stateless-function, react/no-multi-comp
      class App extends React.Component {
        render() {
          // eslint-disable-next-line react/prop-types
          return <div>{this.props.children}</div>;
        }
      }
      const Provider = provideInjector(App);
      const TestComponent = (props) => {
        expect(typeof props.a).toBe('function');
        expect(props.a()).toBe('Test A');
        expect(props.a()).toBe('Test A');
        expect(typeof props.b).toBe('function');
        expect(props.b()).toBe('Test B');
        expect(props.normalProp).toBe('Proppy');

        return <div>test</div>;
      };

      TestComponent.propTypes = {
        a: React.PropTypes.any,
        b: React.PropTypes.any,
        normalProp: React.PropTypes.any,
      };

      Injector.register('ServiceA', () => 'Test A');
      Injector.register('ServiceB', () => 'Test B');
      Injector.register('a', () => 'Test A');
      Injector.register('b', () => 'Test B');
      Injector.load();

      const InjectA = inject(
        TestComponent,
        ['a', 'b']
      );

      ReactTestUtils.renderIntoDocument(<Provider><InjectA normalProp="Proppy" /></Provider>);

      const AnotherTest = (props) => {
        expect(typeof props.ServiceA).toBe('function');
        // eslint-disable-next-line new-cap
        expect(props.ServiceA()).toBe('Test A');
        return <div>test</div>;
      };

      AnotherTest.propTypes = {
        ServiceA: React.PropTypes.any,
      };
      const InjectB = inject(
        AnotherTest,
        'ServiceA'
      );

      ReactTestUtils.renderIntoDocument(<Provider><InjectB /></Provider>);
    });
  });
});
