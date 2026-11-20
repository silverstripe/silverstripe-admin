import ACTION_TYPES from '../TreeViewActionTypes';

// Make a page item with the fields of an item from the page tree endpoints in cms.
export function makePage(id, parentId, treeTitle, extra = {}) {
  return {
    id,
    parentId,
    treeTitle,
    tooltip: `(Record type: Page) ${treeTitle}`,
    recordClass: 'Page',
    classes: 'class-Page',
    iconClasses: 'record-icon font-icon-page class-Page',
    statusFlags: [],
    hasChildren: false,
    limited: false,
    listViewUrl: null,
    editUrl: `admin/pages/edit/show/${id}`,
    canView: true,
    canEdit: true,
    canAddChildren: true,
    ...extra,
  };
}

const modified = { key: 'modified', text: 'Modified', title: 'Item has unpublished changes' };
const draft = { key: 'addedtodraft', text: 'Draft', title: 'Item has not been published yet' };
// A status flag from an extension that gives the flag as a plain string. The server sends no title for that flag.
const externalLink = { key: 'externallink', text: 'External', title: null };

// The children by parent id. Page 3 is limited: it has too many children to show, so the server sends none. The member
// cannot view page 9.
const server = {
  0: [
    makePage(1, 0, 'Home', { iconClasses: 'record-icon font-icon-page class-Page homepage' }),
    makePage(2, 0, 'About us', { hasChildren: true }),
    makePage(3, 0, 'News', { hasChildren: true, limited: true, listViewUrl: 'admin/pages?ParentID=3' }),
    makePage(4, 0, 'Contact us', {
      classes: 'class-Page status-modified',
      statusFlags: [modified],
    }),
  ],
  2: [
    makePage(5, 2, 'Our team', { hasChildren: true }),
    makePage(6, 2, 'History', { classes: 'class-Page status-addedtodraft', statusFlags: [draft] }),
  ],
  5: [
    makePage(7, 5, 'Jane Doe'),
    makePage(8, 5, 'Sam Smith'),
    makePage(9, 5, 'Private profile', { classes: 'class-Page nochildren disabled', canView: false }),
    makePage(10, 5, 'Staff intranet', {
      tooltip: '(Record type: Redirector Page) Staff intranet',
      recordClass: 'SilverStripe\\CMS\\Model\\RedirectorPage',
      classes: 'class-SilverStripe_CMS_Model_RedirectorPage status-externallink',
      iconClasses: 'record-icon font-icon-p-redirect class-SilverStripe_CMS_Model_RedirectorPage',
      statusFlags: [externalLink],
    }),
  ],
};

export function getItem(id) {
  return Object.values(server).flat().find((item) => item.id === id);
}

export function getChildren(parentId) {
  const parentItem = getItem(parentId);
  if (parentItem && parentItem.limited) {
    return [];
  }
  return server[parentId] || [];
}

// Return the ancestor ids of the page `id`, top level first, without 0 and without the page.
export function getPath(id) {
  const ancestorIds = [];
  let item = getItem(id);
  while (item && item.parentId !== 0) {
    ancestorIds.unshift(item.parentId);
    item = getItem(item.parentId);
  }
  return ancestorIds;
}

// Return the actions of a request for the children of `parentId` and of the response.
export function loadActions(parentId, items) {
  return [
    { type: ACTION_TYPES.FETCH_CHILDREN_REQUEST, parentId },
    { type: ACTION_TYPES.FETCH_CHILDREN_SUCCESS, parentId, items },
  ];
}

export function deferred() {
  const result = {};
  result.promise = new Promise((resolve) => {
    result.resolve = resolve;
  });
  return result;
}
