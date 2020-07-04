/* global jest, describe, it, expect */

import React from 'react';
import Tag from '../Tag';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16/build/index';

Enzyme.configure({ adapter: new Adapter() });

describe('Tag', () => {
  beforeEach(() => {
  });

  describe('Test visible content generation', () => {
    it('Defaults to key', () => {
      const wrapper = mount(<Tag dataKey="MyTagKey" />);
      expect(wrapper.text()).toEqual('MyTagKey');
    });

    it('Use label if provided', () => {
      const wrapper = mount(<Tag dataKey="MyTagKey" label="My Tag Label" />);
      expect(wrapper.text()).toEqual('My Tag Label');
    });

    it('Children overrides everything', () => {
      const wrapper = mount(
        <Tag dataKey="MyTagKey" label="My Tag Label">
          Your label means nothing to my children
        </Tag>);
      expect(wrapper.text()).toEqual('Your label means nothing to my children');
    });

    it('value get appended', () => {
      let wrapper = mount(<Tag dataKey="MyTagKey" value="123" />);
      expect(wrapper.text()).toEqual('MyTagKey: 123');

      wrapper = mount(<Tag dataKey="MyTagKey" label="My Tag Label" value="123" />);
      expect(wrapper.text()).toEqual('My Tag Label: 123');
    });

    it('children ignores value', () => {
      const wrapper = mount(
        <Tag dataKey="MyTagKey" label="My Tag Label" value="123">
          Your value means nothing to my children
        </Tag>);
      expect(wrapper.text()).toEqual('Your value means nothing to my children');
    });
  });

  describe('deletable', () => {
    it('deletable', () => {
      const wrapper = mount(<Tag dataKey="MyTagKey" deletable />);
      expect(wrapper.exists('.tag-component__delete')).toEqual(true);
    });

    it('not deletable', () => {
      const wrapper = mount(<Tag dataKey="MyTagKey" deletable={false} />);
      expect(wrapper.exists('.tag-component__delete')).toEqual(false);
    });
  });

  describe('focusable', () => {
    it('focusable', () => {
      const wrapper = mount(<Tag dataKey="MyTagKey" />);
      expect(wrapper.getDOMNode().attributes.getNamedItem('tabindex').value).toEqual('0');
    });

    it('not focusable', () => {
      const wrapper = mount(<Tag dataKey="MyTagKey" focusable={false} />);
      expect(wrapper.getDOMNode().attributes.getNamedItem('tabindex')).toEqual(null);
    });

    it('deletable focusable', () => {
      const wrapper = mount(<Tag dataKey="MyTagKey" deletable />);
      expect(wrapper.getDOMNode().attributes.getNamedItem('tabindex').value).toEqual('0');
      expect(
        wrapper.find('.tag-component__delete').at(0)
          .getDOMNode().attributes.getNamedItem('tabindex').value
      ).toEqual('-1');
    });

    it('deletable not focusable', () => {
      const wrapper = mount(<Tag dataKey="MyTagKey" deletable focusable={false} />);
      expect(wrapper.getDOMNode().attributes.getNamedItem('tabindex')).toEqual(null);
      expect(
        wrapper.find('.tag-component__delete').at(0)
          .getDOMNode().attributes.getNamedItem('tabindex').value
      ).toEqual('-1');
    });
  });

  describe('Handlers', () => {
    it('onClick', () => {
      const onClick = jest.fn();
      const preventDefault = jest.fn();

      const wrapper = shallow(<Tag dataKey="MyTagKey" onClick={onClick} />);
      wrapper.simulate('click', { preventDefault });
      expect(onClick.mock.calls).toHaveLength(1);
      expect(onClick.mock.calls[0]).toEqual(['MyTagKey']);
    });

    it('onDelete', () => {
      const onDelete = jest.fn();
      const preventDefault = jest.fn();

      const wrapper = mount(
        <Tag dataKey="MyTagKey" onDelete={onDelete} deletable />
      );
      wrapper.find('.tag-component__delete').at(0).simulate('click', { preventDefault });
      expect(onDelete.mock.calls).toHaveLength(1);
      expect(onDelete.mock.calls[0]).toEqual(['MyTagKey']);
    });

    it('onKeyDown', () => {
      const handlers = {
        onDeleteKey: jest.fn(),
        onBackSpace: jest.fn(),
        onPrevious: jest.fn(),
        onNext: jest.fn(),
        onClick: jest.fn()
      };
      const preventDefault = jest.fn();

      const wrapper = mount(
        <Tag dataKey="MyTagKey" deletable {...handlers} />
      );

      wrapper.simulate('keyDown', { key: 'Delete', preventDefault });
      wrapper.simulate('keyDown', { key: 'Backspace', preventDefault });
      wrapper.simulate('keyDown', { key: 'ArrowLeft', preventDefault });
      wrapper.simulate('keyDown', { key: 'ArrowRight', preventDefault });

      wrapper.simulate('keyDown', { keyCode: 'Enter', preventDefault }); // Random one

      expect(handlers.onDeleteKey.mock.calls).toHaveLength(1);
      expect(handlers.onDeleteKey.mock.calls[0]).toEqual(['MyTagKey']);
      expect(handlers.onBackSpace.mock.calls).toHaveLength(1);
      expect(handlers.onBackSpace.mock.calls[0]).toEqual(['MyTagKey']);
      expect(handlers.onPrevious.mock.calls).toHaveLength(1);
      expect(handlers.onPrevious.mock.calls[0]).toEqual(['MyTagKey']);
      expect(handlers.onNext.mock.calls).toHaveLength(1);
      expect(handlers.onNext.mock.calls[0]).toEqual(['MyTagKey']);
    });
  });
});
