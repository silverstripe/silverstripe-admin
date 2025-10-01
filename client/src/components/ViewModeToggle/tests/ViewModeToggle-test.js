/* eslint-disable import/no-extraneous-dependencies */
/* global jest, test, describe, beforeEach, it, expect */

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Component as ViewModeToggle } from '../ViewModeToggle';

test('ViewModeToggle simulate click events in split mode', () => {
  const mockOnEditSelect = jest.fn();
  const { container } = render(
    <ViewModeToggle {...{
      id: 'view-mode-toggle-in-preview-nb',
      activeState: 'split',
      area: 'preview',
      splitAvailable: true,
      onEditSelect: mockOnEditSelect,
    }}
    />
  );
  expect(container.querySelector('.viewmode-toggle__chosen-view-title').innerHTML).toBe('Split mode');
  fireEvent.click(container.querySelectorAll('.font-icon-edit-write')[0].parentElement);
  expect(mockOnEditSelect).toHaveBeenCalled();
});

test('ViewModeToggle should call the preview button onClick function', () => {
  const mockOnPreviewSelect = jest.fn();
  const { container } = render(
    <ViewModeToggle {...{
      id: 'view-mode-toggle-in-preview-nb',
      activeState: 'split',
      area: 'preview',
      splitAvailable: true,
      onPreviewSelect: mockOnPreviewSelect,
    }}
    />
  );
  expect(container.querySelector('.viewmode-toggle__chosen-view-title').innerHTML).toBe('Split mode');
  fireEvent.click(container.querySelectorAll('.font-icon-eye')[0].parentElement);
  expect(mockOnPreviewSelect).toHaveBeenCalled();
});

test('ViewModeToggle simulate click events in edit mode should call the split button onClick function', () => {
  const mockOnSplitSelect = jest.fn();
  const { container } = render(
    <ViewModeToggle {...{
      id: 'view-mode-toggle-in-edit-nb',
      activeState: 'edit',
      area: 'edit',
      splitAvailable: false,
      onSplitSelect: mockOnSplitSelect,
    }}
    />
  );
  expect(container.querySelector('.viewmode-toggle__chosen-view-title').innerHTML).toBe('Edit mode');
  fireEvent.click(container.querySelectorAll('.font-icon-columns')[0].parentElement);
  expect(mockOnSplitSelect).not.toHaveBeenCalled();
});

test('ViewModeToggle simulate click events in edit mode should call the preview button onClick function', () => {
  const mockOnPreviewSelect = jest.fn();
  const { container } = render(
    <ViewModeToggle {...{
      id: 'view-mode-toggle-in-edit-nb',
      activeState: 'edit',
      area: 'edit',
      splitAvailable: false,
      onPreviewSelect: mockOnPreviewSelect,
    }}
    />
  );
  expect(container.querySelector('.viewmode-toggle__chosen-view-title').innerHTML).toBe('Edit mode');
  fireEvent.click(container.querySelectorAll('.font-icon-eye')[0].parentElement);
  expect(mockOnPreviewSelect).toHaveBeenCalled();
});

test('ViewModeToggle should not render in the edit context if the activeState is split', () => {
  const { container } = render(
    <ViewModeToggle {...{
      id: 'view-mode-toggle-in-edit-nb',
      activeState: 'split',
      area: 'edit',
      splitAvailable: true,
    }}
    />
  );
  expect(container.querySelectorAll('.viewmode-toggle')).toHaveLength(0);
});

test('ViewModeToggle should render in the edit context if the activeState is preview', () => {
  const { container } = render(
    <ViewModeToggle {...{
      id: 'view-mode-toggle-in-edit-nb',
      activeState: 'preview',
      area: 'edit',
      splitAvailable: true,
    }}
    />
  );
  expect(container.querySelectorAll('.viewmode-toggle')).toHaveLength(1);
});

test('ViewModeToggle should render in the edit context if the activeState is edit', () => {
  const { container } = render(
    <ViewModeToggle {...{
      id: 'view-mode-toggle-in-edit-nb',
      activeState: 'edit',
      area: 'edit',
      splitAvailable: false,
    }}
    />
  );
  expect(container.querySelectorAll('.viewmode-toggle')).toHaveLength(1);
});

test('ViewModeToggle classes', () => {
  const { container } = render(
    <ViewModeToggle {...{
      id: 'view-mode-toggle-in-preview-nb',
      activeState: 'split',
      area: 'preview',
      splitAvailable: true,
    }}
    />
  );
  expect(container.querySelectorAll('.font-icon-columns')).toHaveLength(2);
  expect(container.querySelectorAll('.font-icon-edit-write')).toHaveLength(1);
  expect(container.querySelectorAll('.font-icon-eye')).toHaveLength(1);
  const splitButton = container.querySelectorAll('.font-icon-columns')[1].parentElement;
  const editButton = container.querySelectorAll('.font-icon-edit-write')[0].parentElement;
  const previewButton = container.querySelectorAll('.font-icon-eye')[0].parentElement;
  expect(splitButton.classList.contains('viewmode-toggle--selected')).toBe(true);
  expect(editButton.classList.contains('viewmode-toggle--selected')).toBe(false);
  expect(previewButton.classList.contains('viewmode-toggle--selected')).toBe(false);
  expect(splitButton.getAttribute('id')).toEqual('splitModeButton');
  expect(splitButton.getAttribute('value')).toEqual('split');
  expect(editButton.getAttribute('value')).toEqual('content');
  expect(previewButton.getAttribute('value')).toEqual('preview');
});
