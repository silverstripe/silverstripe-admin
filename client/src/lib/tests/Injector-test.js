/* global jest, jasmine, describe, beforeEach, it, pit, expect, process */
jest.unmock('../Injector');
jest.unmock('../dependency-injection/MiddlewareRegistry');

import Injector, { provideInjector, withInjector, inject } from '../Injector';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

beforeEach(() => {
  Injector.__reset__(true);
});

describe('Injector', () => {
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
      Injector.transform(
        'middle',
        (update) => update('Original', HOC_B),
        { after: 'front', before: 'back' }
      );

      Injector.transform(
        'front',
        (update) => update('Original', HOC_C),
        { before: 'back' }
      );

      Injector.transform(
        'back',
        (update) => update('Original', HOC_A),
        { after: 'front' }
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
    it('allows wildcards', () => {
      const OriginalComponent = (title) => title;
      Injector.register('Original', OriginalComponent);
      const HOC_RED = (original) => (title) => original(`${title}_RED`);
      const HOC_ORANGE = (original) => (title) => original(`${title}_ORANGE`);
      const HOC_YELLOW = (original) => (title) => original(`${title}_YELLOW`);
      const HOC_GREEN = (original) => (title) => original(`${title}_GREEN`);
      const HOC_BLUE = (original) => (title) => original(`${title}_BLUE`);
      const HOC_INDIGO = (original) => (title) => original(`${title}_INDIGO`);
      const HOC_VIOLET = (original) => (title) => original(`${title}_VIOLET`);

      Injector.transform(
        'violet',
        (update) => update('Original', HOC_VIOLET),
        { after: '*' }
      );

      Injector.transform(
        'roy',
        (update) => {
          update('Original', HOC_RED);
          update('Original', HOC_ORANGE);
          update('Original', HOC_YELLOW);
        },
        { before: '*' }
      );

      Injector.transform(
        'middle',
        (update) => {
          update('Original', HOC_GREEN);
          update('Original', HOC_BLUE);
          update('Original', HOC_INDIGO);
        },
        { after: 'roy', before: 'violet' }
      );

      Injector.load();

      const injected = Injector.get('Original');
      expect(injected('RAINBOW')).toBe('RAINBOW_RED_ORANGE_YELLOW_GREEN_BLUE_INDIGO_VIOLET');
    });
    it('allows context', () => {
      const service = (str) => str;
      Injector.register('TestService', service);

      const HOC1 = (original) => (str) => original(`${str}1`);
      const HOC2 = (original) => (str) => original(`${str}2`);
      const HOC3 = (original) => (str) => original(`${str}3`);
      const HOCA = (original) => (str) => original(`${str}A`);
      const HOCB = (original) => (str) => original(`${str}B`);
      const HOCC = (original) => (str) => original(`${str}C`);

      Injector.transform('numbers', update => {
        update('TestService.Universe.World.Mathematics.Numbers', HOC1);
        update('TestService.Universe.World.Mathematics.*', HOC2);
        update('TestService.Universe.*.Mathematics', HOC2);
        update('TestService.Universe', HOC3);
      });
      Injector.transform('letters', update => {
        update('TestService.Universe.World.Language.Letters', HOCA);
        update('TestService.Universe.World.Language.*', HOCB);
        update('TestService.*.World.Language.*', HOCB);
        update('TestService.*.World', HOCC);
      }, { after: 'numbers' });

      Injector.load();

      const numberFactory = Injector.get('TestService', 'Universe.World.Mathematics.Numbers');
      const letterFactory = Injector.get('TestService', 'Universe.World.Language.Letters');

      expect(numberFactory('test_')).toBe('test_1223C');
      expect(letterFactory('test_')).toBe('test_3ABBC');
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
