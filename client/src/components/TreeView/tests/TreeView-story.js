import React from 'react';
import { action } from '@storybook/addon-actions';
import TreeView from '../TreeView';
import { getChildren, getPath } from './mockTree';

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function fetchChildren(parentId) {
  return delay(600).then(() => getChildren(parentId));
}

function fetchPath(id) {
  return delay(300).then(() => getPath(id));
}

const failedParentIds = new Set();

// Fail the first request for each parent. The `LoadFailure` story then shows the failed item and the retry.
function fetchChildrenFailingOnce(parentId) {
  return delay(600).then(() => {
    if (!failedParentIds.has(parentId)) {
      failedParentIds.add(parentId);
      throw new Error('Server error');
    }
    return getChildren(parentId);
  });
}

export default {
  title: 'Admin/TreeView',
  component: TreeView,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A tree of hierarchical records, such as the site tree of pages. It loads the children of one
        parent at a time through \`fetchChildren\`, and reports a click through \`onOpen\` rather than navigating.
        A tree that mounts again with the same \`treeId\` renders as the user left it, with no request. The current item is revealed only
        when \`currentId\` changes. Page 3, "News", is limited: it has too many children to show, and offers to show them as a
        list. Page 9, "Private profile", is disabled: a click on it does nothing.`,
      },
      canvas: {
        sourceState: 'hide',
      },
      story: {
        height: '400px',
      },
    },
  },
  argTypes: {
    currentId: { control: 'number' },
  },
};

export const Default = (args) => <TreeView {...args} />;
Default.args = {
  treeId: 'story-default',
  label: 'Site pages',
  titleRowText: 'Your site name',
  currentId: 6,
  fetchChildren,
  fetchPath,
  onOpen: action('onOpen'),
  onShowAsList: action('onShowAsList'),
};

export const DeepLink = (args) => <TreeView {...args} />;
DeepLink.args = {
  ...Default.args,
  treeId: 'story-deep-link',
  currentId: 8,
};

export const LoadFailure = (args) => <TreeView {...args} />;
LoadFailure.args = {
  ...Default.args,
  treeId: 'story-load-failure',
  currentId: null,
  fetchChildren: fetchChildrenFailingOnce,
};
