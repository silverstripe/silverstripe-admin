/* eslint-disable import/no-extraneous-dependencies */
/* global jest, describe, beforeEach, it, expect */

import React from 'react';
import { Component as ViewModeToggle } from '../ViewModeToggle';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15.4';

Enzyme.configure({ adapter: new Adapter() });

describe('ViewModeToggle', () => {
  let props = null;

  // Mock select functions to replace the ones provided by mapDispatchToProps
  const mockOnSplitSelect = jest.fn();
  const mockOnEditSelect = jest.fn();
  const mockOnPreviewSelect = jest.fn();

  beforeEach(() => {
    props = {};
  });

  describe('onClick functions trigger mapDispatchToProps functions to notify and update the Redux store', () => {
    describe('simulate click events in split mode', () => {
      props = {
        id: 'view-mode-toggle-in-preview-nb',
        activeState: 'split',
        area: 'preview',
        splitAvailable: true,
      };

      const wrapper = shallow(
        <ViewModeToggle
          onSplitSelect={mockOnSplitSelect}
          onEditSelect={mockOnEditSelect}
          onPreviewSelect={mockOnPreviewSelect}
          {...props}
        />
      );

      it('should call the edit button onClick function', () => {
        expect(wrapper.instance().props.activeState).toBe('split');
        wrapper.find('.font-icon-edit-write').at(0).simulate('click');
        expect(mockOnEditSelect).toHaveBeenCalled();
      });

      it('should call the preview button onClick function', () => {
        expect(wrapper.instance().props.activeState).toBe('split');
        wrapper.find('.font-icon-eye').at(0).simulate('click');
        expect(mockOnPreviewSelect).toHaveBeenCalled();
      });
    });

    describe('simulate click events in edit mode', () => {
      props = {
        id: 'view-mode-toggle-in-edit-nb',
        activeState: 'edit',
        area: 'edit',
        splitAvailable: false,
      };

      const wrapper = shallow(
        <ViewModeToggle
          onSplitSelect={mockOnSplitSelect}
          onEditSelect={mockOnEditSelect}
          onPreviewSelect={mockOnPreviewSelect}
          {...props}
        />
      );

      it('should call the split button onClick function', () => {
        expect(wrapper.instance().props.activeState).toBe('edit');
        wrapper.find('.font-icon-columns').at(0).simulate('click');
        // expect(mockOnSplitSelect).not.toHaveBeenCalled();
      });

      it('should call the preview button onClick function', () => {
        expect(wrapper.instance().props.activeState).toBe('edit');
        wrapper.find('.font-icon-eye').at(0).simulate('click');
        expect(mockOnPreviewSelect).toHaveBeenCalled();
      });
    });
  });


  describe('should render ViewModeToggle in the correct context', () => {
    it('should not render ViewModeToggle in the edit context if the activeState is split', () => {
      props = {
        id: 'view-mode-toggle-in-edit-nb',
        activeState: 'split',
        area: 'edit',
        splitAvailable: true,
      };

      const wrapper = shallow(
        <ViewModeToggle
          onSplitSelect={mockOnSplitSelect}
          onEditSelect={mockOnEditSelect}
          onPreviewSelect={mockOnPreviewSelect}
          {...props}
        />
      );

      expect(wrapper.find('div').length).toEqual(0);
    });


    it('should not render ViewModeToggle in the edit context if the activeState is preview', () => {
      props = {
        id: 'view-mode-toggle-in-edit-nb',
        activeState: 'preview',
        area: 'edit',
        splitAvailable: true,
      };

      const wrapper = shallow(
        <ViewModeToggle
          onSplitSelect={mockOnSplitSelect}
          onEditSelect={mockOnEditSelect}
          onPreviewSelect={mockOnPreviewSelect}
          {...props}
        />
      );

      expect(wrapper.find('div').length).toEqual(0);
    });

    it('should render ViewModeToggle in the edit context if the activeState is edit', () => {
      props = {
        id: 'view-mode-toggle-in-edit-nb',
        activeState: 'edit',
        area: 'edit',
        splitAvailable: false,
      };
      const wrapper = shallow(
        <ViewModeToggle
          onSplitSelect={mockOnSplitSelect}
          onEditSelect={mockOnEditSelect}
          onPreviewSelect={mockOnPreviewSelect}
          {...props}
        />
      );

      expect(wrapper.find('div').length).toEqual(1);
    });
  });

  describe('should add the correct classes', () => {
    props = {
      id: 'view-mode-toggle-in-preview-nb',
      activeState: 'split',
      area: 'preview',
      splitAvailable: true,
    };

    const wrapper = shallow(
      <ViewModeToggle
        onSplitSelect={mockOnSplitSelect}
        onEditSelect={mockOnEditSelect}
        onPreviewSelect={mockOnPreviewSelect}
        {...props}
      />
    );

    it('should add correct font icon class to the buttons and the view mode toggle itself', () => {
      const splitButtonClassInstances = wrapper.find('.font-icon-columns');
      expect(splitButtonClassInstances.length).toEqual(2);

      const editButtonClassInstances = wrapper.find('.font-icon-edit-write');
      expect(editButtonClassInstances.length).toEqual(1);

      const previewButtonClassInstances = wrapper.find('.font-icon-eye');
      expect(previewButtonClassInstances.length).toEqual(1);
    });

    it('should add the activeMode to the button representing the active state', () => {
      const splitButton = wrapper.find('.font-icon-columns').at(1);
      const editButton = wrapper.find('.font-icon-edit-write').at(0);
      const previewButton = wrapper.find('.font-icon-eye').at(0);

      expect(splitButton.hasClass('viewmode-toggle--selected')).toBe(true);
      expect(editButton.hasClass('viewmode-toggle--selected')).toBe(false);
      expect(previewButton.hasClass('viewmode-toggle--selected')).toBe(false);

      expect(splitButton.prop('id')).toEqual('splitModeButton');

      expect(splitButton.prop('value')).toEqual('split');
      expect(editButton.prop('value')).toEqual('content');
      expect(previewButton.prop('value')).toEqual('preview');
    });
  });
});
