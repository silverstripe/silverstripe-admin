/* global jest, jasmine, describe, beforeEach, it, pit, expect, process */
import buildComponentContainer from '../buildComponentContainer';
import React from 'react';

describe('ComponentContainer', () => {
  let registry = null;

  beforeEach(() => {
    registry = buildComponentContainer();
  });

  describe('get()', () => {
    it('should set a display name on objects', () => {
      const TestComponent1 = () => <h2>Test</h2>;
      const HOC1 = (TestComponent) => () => <div className="hoc"><TestComponent /></div>;
      // eslint-disable-next-line react/prefer-stateless-function, react/no-multi-comp
      class TestComponent2 extends React.Component {
        render() {
          return <h3>Hello</h3>;
        }
      }
      TestComponent2.displayName = 'Testo';
      const HOC2 = (TestComponent) => {
        // eslint-disable-next-line react/prefer-stateless-function, react/no-multi-comp
        class TestClass extends React.Component {
          render() {
            return <div className="hoc"><TestComponent /></div>;
          }
        }

        return TestClass;
      };

      registry.register('TestComponent1', TestComponent1);
      registry.register('TestComponent2', TestComponent2);
      registry.transform('test', update => update('TestComponent1', HOC1));
      registry.transform('test', update => update('TestComponent2', HOC2, 'Besto'));
      registry.load();

      const Service1 = registry.get('TestComponent1');
      const Service2 = registry.get('TestComponent2');

      expect(Service1.displayName).toBe('test(TestComponent1)');
      expect(Service2.displayName).toBe('Besto(Testo)');
    });
  });
});
