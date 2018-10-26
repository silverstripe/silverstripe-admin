/* eslint-disable import/no-extraneous-dependencies */
/* global jest, describe, beforeEach, it, expect */

import React from 'react';
import PopoverOptionSet from '../PopoverOptionSet';
import { Button, InputGroup } from 'reactstrap';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15.4';

Enzyme.configure({ adapter: new Adapter() });

describe('PopoverOptionSet', () => {
  let props = null;
  let buttonTypeA = null;
  let buttonTypeB = null;

  const mockToggle = jest.fn();

    beforeEach(() => {
    buttonTypeA = {
      key: 'dummy-key-a',
      content: 'Hello A',
      className: 'dummy-classname-a'
    };

    buttonTypeB = {
      key: 'dummy-key-b',
      content: 'Hello B',
      className: 'dummy-classname-b',
    };

    props = {
      buttons: [buttonTypeA, buttonTypeB],
      provideButtonClickHandler: jest.fn(),
      container: jest.fn(),
      extraClass: '',
      isOpen: false,
      placement: 'auto',
      toggle: mockToggle,
      searchPlaceholder: '',
      target: () => <div />
    };
  });

  describe('handleToggle', () => {
    it('should call the toggle and the handleClear function', () => {
      const wrapper = shallow(
        <PopoverOptionSet
          {...props}
        />
      );

      wrapper.instance().handleToggle();
      expect(mockToggle).toHaveBeenCalled();
    });
  });

  describe('handleSearchValueClear', () => {
    it('should set the state', () => {
      const wrapper = shallow(
        <PopoverOptionSet
          {...props}
        />
      );

      wrapper.setState({ searchValue: 'something ' });
      wrapper.instance().handleSearchValueClear();
      expect(wrapper.state('searchValue')).toEqual('');
    });
  });

  describe('handleSearchValueChange', () => {
    it('should update the internal state on user input change', () => {
      const wrapper = shallow(
        <PopoverOptionSet {...props} />
      );

      const event = {
        target: {
          value: 'a'
        }
      };

      wrapper.instance().handleSearchValueChange(event);
      expect(wrapper.state('searchValue')).toEqual('a');
    });
  });

  describe('renderSearchValueClearLink', () => {
    it('should render a link to clear the search field', () => {
      const wrapper = shallow(
        <PopoverOptionSet {...props} />
      );
      wrapper.setState({ searchValue: 'something' });
      expect(wrapper.find('.popover-option-set__search-clear').length).toEqual(1);
    });
  });

  describe('renderOptionButtons', () => {
    it('render all available buttons', () => {
      const wrapper = shallow(
        <PopoverOptionSet {...props} />
      );
      wrapper.setState({ searchValue: '' });
      expect(wrapper.find(Button).length).toEqual(2);
    });

    it('render all buttons matching the search term', () => {
      const wrapper = shallow(
        <PopoverOptionSet {...props} />
      );
      wrapper.setState({ searchValue: 'Hello B' });
      expect(wrapper.find(Button).length).toEqual(1);
    });

    it('render a message if no buttons are available', () => {
      const wrapper = shallow(
        <PopoverOptionSet {...props} />
      );
      wrapper.setState({ searchValue: 'Hello C' });
      expect(wrapper.find(Button).length).toEqual(0);
    });
  });

  describe('renderPopoverOptionSetContent', () => {
    it('render container component', () => {
      const wrapper = shallow(
        <PopoverOptionSet {...props} />
      );

      expect(wrapper.find('.popover-option-set__button-container').length).toEqual(1);
    });
  });

  describe('render', () => {
    it('should render a Popover', () => {
      const wrapper = shallow(
        <PopoverOptionSet {...props} />
      );

      expect(wrapper.find(InputGroup)).toHaveLength(1);
      expect(wrapper.find('.popover-option-set__button-container').length).toEqual(1);
    });
  });
});

