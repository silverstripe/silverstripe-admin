/* global jest, describe, beforeEach, it, expect */

import React from 'react';
import Toasts from '../Toasts';
import Toast from '../Toast';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });
jest.useFakeTimers();

const toastOne = { id: 'one', text: 'Let us toast your success', type: 'success', dismissed: false };
const toastTwo = { id: 'two', text: 'You have failed me for the last time', type: 'error', dismissed: false };

const getHandlers = () => ({
  onDismiss: jest.fn(),
  onPause: jest.fn(),
  onResume: jest.fn(),
});


describe('Toasts', () => {
  describe('Rendering toasts', () => {
    it('No Toast', () => {
      const wrapper = shallow(<Toasts toasts={[]} {...getHandlers()} />);

      expect(wrapper.props()).toMatchObject({
        className: 'toasts',
        'aria-live': 'polite',
        'aria-atomic': 'true',
      });

      expect(wrapper.find(Toast)).toHaveLength(0);
    });

    it('One toast', () => {
      const handlers = getHandlers();
      const wrapper = shallow(<Toasts toasts={[toastOne]} {...handlers} />);

      expect(wrapper.props()).toMatchObject({
        className: 'toasts',
        'aria-live': 'polite',
        'aria-atomic': 'true',
      });

      const toasts = wrapper.find(Toast);

      expect(toasts).toHaveLength(1);

      const toast = toasts.first();
      const { id, ...toastMinusId } = toastOne;
      expect(toast.props()).toMatchObject(toastMinusId);

      toast.prop('onDismiss')();
      expect(handlers.onDismiss).toBeCalledWith(id);
    });

    it('Many toasts', () => {
      const handlers = getHandlers();
      const wrapper = shallow(<Toasts toasts={[toastOne, toastTwo]} {...handlers} />);

      expect(wrapper.props()).toMatchObject({
        className: 'toasts',
        'aria-live': 'polite',
        'aria-atomic': 'true',
      });

      const toasts = wrapper.find(Toast);

      expect(toasts).toHaveLength(2);

      const toast = toasts.last();
      const { id, ...toastMinusId } = toastTwo;
      expect(toast.props()).toMatchObject(toastMinusId);

      toast.prop('onDismiss')();
      expect(handlers.onDismiss).toBeCalledWith(id);
    });
  });

  describe('Pause/Resuming dismissal timeout', () => {
    it('Pause on Mouse Enter', () => {
      const handlers = getHandlers();
      const wrapper = mount(<Toasts toasts={[toastOne]} {...handlers} />);

      wrapper.simulate('mouseenter', {});

      expect(handlers.onPause).not.toHaveBeenCalled();
      jest.advanceTimersByTime(100);
      expect(handlers.onPause).toHaveBeenCalled();
    });

    it('Pause on Focus', () => {
      const handlers = getHandlers();
      const wrapper = mount(<Toasts toasts={[toastOne]} {...handlers} />);

      wrapper.simulate('focus', {});

      expect(handlers.onPause).not.toHaveBeenCalled();
      jest.advanceTimersByTime(100);
      expect(handlers.onPause).toHaveBeenCalled();
    });

    it('Resume on Mouse Leave', () => {
      const handlers = getHandlers();
      const wrapper = mount(<Toasts toasts={[toastOne]} {...handlers} />);

      wrapper.simulate('mouseleave', {});

      expect(handlers.onResume).not.toHaveBeenCalled();
      jest.advanceTimersByTime(100);
      expect(handlers.onResume).toHaveBeenCalled();
    });

    it('Pause on Blur', () => {
      const handlers = getHandlers();
      const wrapper = mount(<Toasts toasts={[toastOne]} {...handlers} />);

      wrapper.simulate('blur', {});

      expect(handlers.onResume).not.toHaveBeenCalled();
      jest.advanceTimersByTime(100);
      expect(handlers.onResume).toHaveBeenCalled();
    });

    it('Debouncing', () => {
      const handlers = getHandlers();
      const wrapper = mount(<Toasts toasts={[toastOne]} {...handlers} />);

      wrapper.simulate('focus');

      // Nothing happens until our timeout is done
      expect(handlers.onResume).not.toHaveBeenCalled();
      expect(handlers.onPause).not.toHaveBeenCalled();

      jest.advanceTimersByTime(75);
      wrapper.simulate('blur');

      jest.advanceTimersByTime(75);
      // Timeout hasn't been reach yet
      expect(handlers.onResume).not.toHaveBeenCalled();
      expect(handlers.onPause).not.toHaveBeenCalled();

      // mouseenter will clear existing timeout and start a new one
      wrapper.simulate('mouseenter');

      jest.advanceTimersByTime(75);
      // No timeout has been reached yet
      expect(handlers.onResume).not.toHaveBeenCalled();
      expect(handlers.onPause).not.toHaveBeenCalled();

      jest.advanceTimersByTime(75);

      // Our last mouseenter timeout should have been reached now
      expect(handlers.onResume).not.toHaveBeenCalled();
      expect(handlers.onPause).toHaveBeenCalled();
    });
  });
});
