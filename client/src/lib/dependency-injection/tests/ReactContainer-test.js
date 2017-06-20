/* global jest, jasmine, describe, beforeEach, it, pit, expect, process */
import buildReactContainer from '../buildReactContainer';
import React from 'react';

describe('ReactContainer', () => {
  let registry = null;

  beforeEach(() => {
    registry = buildReactContainer();
  });

  describe('get()', () => {
    it('should set a display name on objects', () => {
      const TestComponent1 = () => <h2>Test</h2>;
      registry.register('TestComponent1', TestComponent1);
      const HOC1 = (TestComponent) => () => <div className="hoc"><TestComponent /></div>;
      registry.transform('test', update => update('TestComponent1', HOC1));
      // eslint-disable-next-line react/prefer-stateless-function, react/no-multi-comp
      class TestComponent2 extends React.Component {
        render() {
          return <h3>Hello</h3>;
        }
      }
      TestComponent2.displayName = 'Testo';
      registry.register('TestComponent2', TestComponent2);
      const HOC2 = (TestComponent) => {
        // eslint-disable-next-line react/prefer-stateless-function, react/no-multi-comp
        class TestClass extends React.Component {
          render() {
            return <div className="hoc"><TestComponent /></div>;
          }
        }

        return TestClass;
      };

      registry.transform('test', update => update('TestComponent2', HOC2, 'Besto'));
      registry.load();
      const Service1 = registry.get('TestComponent1');
      expect(Service1.displayName).toBe('test(TestComponent1)');
      const Service2 = registry.get('TestComponent2');
      expect(Service2.displayName).toBe('Besto(Testo)');
    });
  });
});
