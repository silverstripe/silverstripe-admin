/* global jest, describe, it, expect */

import React from 'react';
import TagList from '../TagList';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15.4/build/index';


Enzyme.configure({ adapter: new Adapter() });

const tagData = [
  { key: 'justKey' },
  { key: 'KeyPair', value: '123' },
  { key: 'KeyLabel', label: 'Some label' },
  { key: 'KeyPairLabel', label: 'Some label', value: '123' }
];


describe('Tag List', () => {
  beforeEach(() => {
  });

  describe('Rendering', () => {
    it('Simple tags', () => {
      const wrapper = mount(<TagList tags={tagData} />);
      const tags = wrapper.find('Tag');
      expect(tags).toHaveLength(4);
      expect(tags.at(0).text()).toEqual('justKey');
      expect(tags.at(1).text()).toEqual('KeyPair: 123');
      expect(tags.at(2).text()).toEqual('Some label');
      expect(tags.at(3).text()).toEqual('Some label: 123');

      tags.forEach((tag) => {
        expect(tag.getDOMNode().attributes.getNamedItem('tabindex').value).toEqual('0');
        expect(tag.find('.tag__delete').exists()).toEqual(false);
      });
    });

    it('Deletable tags', () => {
      const wrapper = mount(<TagList tags={tagData} deletable />);
      const tags = wrapper.find('Tag');
      expect(tags).toHaveLength(4);

      tags.forEach((tag) => {
        expect(tag.getDOMNode().attributes.getNamedItem('tabindex').value).toEqual('0');
        expect(tag.find('.tag__delete').exists()).toEqual(true);
      });
    });

    it('unfocusable tags', () => {
      const wrapper = mount(<TagList tags={tagData} focusable={false} />);
      const tags = wrapper.find('Tag');
      expect(tags).toHaveLength(4);

      tags.forEach((tag) => {
        expect(tag.getDOMNode().attributes.getNamedItem('tabindex')).toEqual(null);
        expect(tag.find('.tag__delete').exists()).toEqual(false);
      });
    });
  });

  describe('handlers', () => {
    it('onTagClick', () => {
      const onTagClick = jest.fn();
      const preventDefault = jest.fn();

      const wrapper = mount(<TagList tags={tagData} deletable onTagClick={onTagClick} />);
      const tags = wrapper.find('Tag');
      tags.at(1).simulate('click', { preventDefault });

      expect(onTagClick.mock.calls).toHaveLength(1);
      expect(onTagClick.mock.calls[0]).toEqual(['KeyPair']);
    });

    it('onTagDelete', () => {
      const onTagDelete = jest.fn();
      const preventDefault = jest.fn();

      const wrapper = mount(<TagList tags={tagData} deletable onTagDelete={onTagDelete} />);
      const tags = wrapper.find('Tag');
      tags.at(2).find('.tag__delete').at(0).simulate('click', { preventDefault });

      expect(onTagDelete.mock.calls).toHaveLength(1);
      expect(onTagDelete.mock.calls[0]).toEqual(['KeyLabel']);
    });

    it('onBackspace', () => {
      const onTagDelete = jest.fn();
      const preventDefault = jest.fn();

      const wrapper = mount(<TagList tags={tagData} deletable onTagDelete={onTagDelete} />);
      const tags = wrapper.find('Tag');

      const thirdTag = tags.at(3).find('li.tag');

      thirdTag.simulate('keyDown', { key: 'Backspace', preventDefault });

      expect(onTagDelete.mock.calls).toHaveLength(1);
      expect(onTagDelete.mock.calls[0]).toEqual(['KeyPairLabel']);
    });

    it('onDeleteKey', () => {
      const onTagDelete = jest.fn();
      const preventDefault = jest.fn();

      const wrapper = mount(<TagList tags={tagData} deletable onTagDelete={onTagDelete} />);
      const tags = wrapper.find('Tag');

      const thirdTag = tags.at(3).find('li.tag');

      thirdTag.simulate('keyDown', { key: 'Delete', preventDefault });

      expect(onTagDelete.mock.calls).toHaveLength(1);
      expect(onTagDelete.mock.calls[0]).toEqual(['KeyPairLabel']);
    });
  });
});
