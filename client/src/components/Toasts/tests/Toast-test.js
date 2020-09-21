/* global jest, describe, it, expect */

import React from 'react';
import Toast from '../Toast';
import { ToastActions as Actions } from '../ToastActions';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

describe('Toast', () => {
  it('Plain toast', () => {
    const props = {
      type: 'notice',
      text: 'Foo bar',
      onDismiss: jest.fn(),
      dismissed: false,
      id: 'abc123'
    };

    const wrapper = shallow(<Toast {...props} />);

    expect(wrapper.props()).toMatchObject({
      isOpen: true,
      className: 'toast toast--notice',
    });

    const closeButton = wrapper.find('.toast__close');
    expect(closeButton).toHaveLength(1);
    expect(closeButton.props()).toMatchObject({
      noText: true,
      children: 'Dismiss',
    });

    const toastContent = wrapper.find('.toast__content');
    expect(toastContent.props()).toMatchObject({
      'aria-live': 'assertive',
      'aria-atomic': 'true',
    });
    expect(toastContent.text()).toBe(props.text);

    const preventDefault = jest.fn();
    closeButton.simulate('click', { preventDefault });
    expect(preventDefault).toHaveBeenCalled();
    expect(props.onDismiss).toHaveBeenCalled();

    expect(wrapper.find(Actions)).toHaveLength(0);
  });

  it('Dismissed toast', () => {
    const props = {
      type: 'warning',
      text: 'Foo bar',
      onDismiss: jest.fn(),
      dismissed: true,
      id: 'abc123'
    };

    const wrapper = shallow(<Toast {...props} />);

    expect(wrapper.hasClass('toast--warning')).toBe(true);
    expect(wrapper.hasClass('toast--dismissing')).toBe(true);
  });

  it('With actions', () => {
    const props = {
      type: 'error',
      text: 'Foo bar',
      onDismiss: jest.fn(),
      dismissed: false,
      id: 'abc123',
      actions: [{ label: 'click me', href: 'http://silverstripe.org' }]
    };

    const wrapper = shallow(<Toast {...props} />);

    expect(wrapper.hasClass('toast--error')).toBe(true);

    const actionsWrapper = wrapper.find(Actions);
    expect(actionsWrapper).toHaveLength(1);
    expect(actionsWrapper.props()).toMatchObject({
      actions: props.actions,
      onDismiss: props.onDismiss,
      dismissed: false
    });
  });
});
