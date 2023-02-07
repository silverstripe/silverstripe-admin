/* global jest, describe, it, expect */
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CircularLoading from '../CircularLoading';

Enzyme.configure({ adapter: new Adapter() });

describe('CircularLoading', () => {
  describe('render()', () => {
    it('can be displayed as "block"', () => {
      const wrapper = shallow(
        <CircularLoading block />
      );

      expect(wrapper.find('.ss-circular-loading-indicator--block')).toHaveLength(1);
    });

    it('allows extra classes to be provided', () => {
      const wrapper = shallow(
        <CircularLoading className="hello-world" />
      );

      expect(wrapper.find('.ss-circular-loading-indicator.hello-world')).toHaveLength(1);
    });
  });
});
