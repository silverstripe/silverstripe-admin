/* global jest, test, expect, beforeEach, afterEach */
import React from 'react';
import { render } from '@testing-library/react';
import { Component as ComplexTreeView } from '../ComplexTreeView';
import useComplexTreeViewApi from '../useComplexTreeViewApi';

jest.mock('../useComplexTreeViewApi');
jest.mock('../TreeContextMenu', () => ({
  __esModule: true,
  default: () => null,
}));

beforeEach(() => {
  global.fetch = jest.fn();
  Storage.prototype.setItem = jest.fn();
  Storage.prototype.getItem = jest.fn();
  delete window.location;
  window.location = {
    assign: jest.fn(),
    href: '',
  };
  Object.defineProperty(window.location, 'href', {
    writable: true,
    value: '',
  });
  useComplexTreeViewApi.mockReturnValue({
    data: null,
    dataProvider: null,
    error: null,
    initialViewState: null,
    loading: true,
    rootId: null,
    loadSubtree: jest.fn(),
    mergeSubtree: jest.fn(),
    saveNode: jest.fn(),
    updateNodes: jest.fn(),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('ComplexTreeView accepts onEditItem callback prop', () => {
  const onEditItem = jest.fn();
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      editUrlPattern="/admin/pages/edit/%s"
      onEditItem={onEditItem}
    />
  );
  expect(container).not.toBeNull();
});

test('ComplexTreeView accepts onDuplicateItem callback prop', () => {
  const onDuplicateItem = jest.fn();
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      onDuplicateItem={onDuplicateItem}
    />
  );
  expect(container).not.toBeNull();
});

test('ComplexTreeView accepts onAddChild callback prop', () => {
  const onAddChild = jest.fn();
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      onAddChild={onAddChild}
    />
  );
  expect(container).not.toBeNull();
});

test('ComplexTreeView accepts onShowAsList callback prop', () => {
  const onShowAsList = jest.fn();
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      onShowAsList={onShowAsList}
    />
  );
  expect(container).not.toBeNull();
});

test('ComplexTreeView accepts all callback props simultaneously', () => {
  const onEditItem = jest.fn();
  const onDuplicateItem = jest.fn();
  const onAddChild = jest.fn();
  const onShowAsList = jest.fn();

  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      editUrlPattern="/admin/pages/edit/%s"
      onEditItem={onEditItem}
      onDuplicateItem={onDuplicateItem}
      onAddChild={onAddChild}
      onShowAsList={onShowAsList}
    />
  );

  expect(container).not.toBeNull();
});

test('ComplexTreeView renders without callback props (backwards compatible)', () => {
  const { container } = render(
    <ComplexTreeView
      apiEndpoint="/admin/pages/tree/jsonview"
      editUrlPattern="/admin/pages/edit/%s"
    />
  );

  expect(container).not.toBeNull();
});
