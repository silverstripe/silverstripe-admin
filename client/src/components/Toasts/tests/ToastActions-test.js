/* global jest, describe, it, expect */

import React from 'react';
import { ToastActions as Actions, ToastAction as Action } from '../ToastActions';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });


describe('ToastActions', () => {
  describe('Individual action', () => {
    let props;

    beforeEach(() => {
      props = {
        label: 'foo bar',
        href: 'https://silverstripe.org/',
        onClick: jest.fn(),
        dismissed: false,
        onDismiss: jest.fn()
      };
    });

    it('Link', () => {
      const wrapper = mount(<Action {...props} />);
      expect(wrapper.text()).toEqual(props.label);
      const node = wrapper.getDOMNode();
      expect(node).toBeInstanceOf(HTMLAnchorElement);
      expect(node.href).toBe(props.href);

      const preventDefault = jest.fn();
      wrapper.simulate('click', { preventDefault });

      expect(props.onClick).not.toHaveBeenCalled();
      expect(props.onDismiss).not.toHaveBeenCalled();
      expect(preventDefault).not.toHaveBeenCalled();
    });

    it('Button', () => {
      const wrapper = mount(<Action {...props} href={undefined} />);
      expect(wrapper.text()).toEqual(props.label);
      const node = wrapper.getDOMNode();
      expect(node).toBeInstanceOf(HTMLButtonElement);

      const preventDefault = jest.fn();
      wrapper.simulate('click', { preventDefault });

      expect(props.onClick).toHaveBeenCalled();
      expect(props.onDismiss).toHaveBeenCalled();
      expect(preventDefault).toHaveBeenCalled();
    });

    it('Button for dismissed toast', () => {
      const wrapper = mount(<Action {...props} href={undefined} dismissed />);
      expect(wrapper.text()).toEqual(props.label);
      const node = wrapper.getDOMNode();
      expect(node).toBeInstanceOf(HTMLButtonElement);

      const preventDefault = jest.fn();
      wrapper.simulate('click', { preventDefault });

      expect(props.onClick).not.toHaveBeenCalled();
      expect(props.onDismiss).not.toHaveBeenCalled();
      expect(preventDefault).toHaveBeenCalled();
    });
  });

  describe('Action list', () => {
    const actionOne = {
      label: 'foo bar',
      href: 'https://silverstripe.org/',
    };

    const actionTwo = {
      label: 'bar foo',
      onClick: jest.fn()
    };

    const actionThree = {
      label: 'I will be truncated',
      onClick: jest.fn()
    };

    it('No action', () => {
      const onDismiss = jest.fn();
      const wrapper = shallow(<Actions dismissed={false} onDismiss={onDismiss} actions={[]} />);
      expect(wrapper.type()).toBe(null);
    });

    it('One action', () => {
      const onDismiss = jest.fn();
      const wrapper =
        shallow(<Actions dismissed={false} onDismiss={onDismiss} actions={[actionOne]} />);
      expect(wrapper.type()).not.toBe(null);

      const actionWrapper = wrapper.find(Action);
      expect(actionWrapper).toHaveLength(1);
      const actionProps = actionWrapper.props();
      expect(actionProps).toMatchObject({
        onDismiss, dismissed: false, ...actionOne
      });
    });

    it('Two actions', () => {
      const onDismiss = jest.fn();
      const wrapper =
        shallow(<Actions dismissed onDismiss={onDismiss} actions={[actionOne, actionTwo]} />);
      expect(wrapper.type()).not.toBe(null);

      const actionWrapper = wrapper.find(Action);
      expect(actionWrapper).toHaveLength(2);

      expect(actionWrapper.first().props()).toMatchObject({
        onDismiss, dismissed: true, ...actionOne
      });

      expect(actionWrapper.last().props()).toMatchObject({
        onDismiss, dismissed: true, ...actionTwo
      });
    });

    it('No more than two actions', () => {
      const onDismiss = jest.fn();
      const props = { dismissed: false, onDismiss, actions: [actionOne, actionTwo, actionThree] };
      const wrapper = shallow(<Actions {...props} />);
      expect(wrapper.type()).not.toBe(null);

      const actionWrapper = wrapper.find(Action);
      expect(actionWrapper).toHaveLength(2);

      expect(actionWrapper.first().props()).toMatchObject({
        onDismiss, dismissed: false, ...actionOne
      });

      expect(actionWrapper.last().props()).toMatchObject({
        onDismiss, dismissed: false, ...actionTwo
      });
    });
  });
});
