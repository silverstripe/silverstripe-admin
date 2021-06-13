/* global jest, describe, it, expect */

import React from 'react';
import HeaderField from '../HeaderField';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

describe('HeaderField', () => {
  it('minimal render', () => {
    const wrapper = shallow(<HeaderField data={{ title: 'test' }} />);

    expect(wrapper.props()).toMatchObject({
      className: 'field',
    });

    const headerWrapper = wrapper.find('h3');
    expect(headerWrapper).toHaveLength(1);
    expect(headerWrapper.props()).toMatchObject({
      className: '',
      children: 'test'
    });
  });
  it('render with all options', () => {
    const wrapper = shallow(
      <HeaderField id="testID" className="a" extraClass="b" data={{ title: 'test', headingLevel: 1 }} />
    );

    expect(wrapper.props()).toMatchObject({
      className: 'field',
    });

    const headerWrapper = wrapper.find('h1');
    expect(headerWrapper).toHaveLength(1);
    expect(headerWrapper.props()).toMatchObject({
      className: 'a b',
      id: 'testID',
      children: 'test'
    });
  });
});
