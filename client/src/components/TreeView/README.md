# Tree View Component

A navigation tree of hierarchical records, such as the site tree. The tree loads the children of each parent when
they are first shown. The state of each tree is kept by `treeId` for the life of the page, so a tree that mounts again
renders as the user left it, scrolled to where the user left it and then just enough to show the current item. An
element around the tree scrolls it, as for the legacy tree, and the tree keeps the scroll offset of that element. A
tree with no scrolling element around it keeps no scroll offset, but still scrolls the page to show a new current item.

The tree does not use the Redux store of the admin. The store, the reducer, the selectors and the actions of the tree
are in this folder, not in `client/src/state`.

## Example
```js
const props = {
  treeId: 'pages',
  label: 'Site pages',
  titleRowText: 'My site',
  currentId: 6,
  fetchChildren: (parentId) => fetch(`tree/children/${parentId}`).then((response) => response.json()),
  fetchPath: (id) => fetch(`tree/path/${id}`).then((response) => response.json()),
  onOpen: (item) => loadRecord(item.id),
};
<TreeView {...props} />
```

## Properties

 * `treeId` (string, required): The key of the stored state. Trees mounted with the same `treeId` share one state,
   the current item included, so give those trees the same `currentId`.
 * `fetchChildren` (function, required): Called with a parent id, or `0` for the top level. Returns a promise of an
   array of items. When the promise rejects or the value is not an array of items, the tree shows a failed item with
   a retry. A parent whose children are loaded keeps them.
 * `fetchPath` (function): Called with an item id to reveal a current item that is not loaded yet. Returns a promise
   of the ancestor ids, top level first, without the item. The tree stores an id sent as a string as a number. After
   a failure, the tree calls it again on the next mount or reload.
 * `currentId` (number or string): The id of the current item. The tree reveals the item when the id changes.
 * `reloadKey` (number or string): The tree loads the top-level items and all the shown children again when this
   value differs from the value the tree last loaded with. A tree that mounts again with the same value does not
   reload. It still calls `fetchPath` and `fetchChildren` to reveal a new current item.
 * `onOpen` (function): Called with the item and the event on a plain click on an item that the member can view. The
   tree stops the click from following `editUrl`. Without `onOpen`, the click follows `editUrl`. The clicked item
   stays highlighted until `currentId` changes, unless the function returns `false`, or returns a promise that
   rejects or resolves to `false`. The highlight does not move `aria-current`, which follows `currentId`.
 * `onShowAsList` (function): Called with the item and the event on a plain click on the "show as list" link of an item
   with too many children to show. The tree stops the click from following `listViewUrl`. Without `onShowAsList`, the
   click follows `listViewUrl`.
 * `label` (string, required): The accessible name of the tree.
 * `titleRowText` (string): The text of the title row. A tree without a title has no title row.
 * `isSidePanel` (boolean): Whether the tree has the narrow layout of a side panel.

Keep the same `fetchChildren`, `onOpen` and `onShowAsList` functions across renders. A new function in any of them
renders every item again.

## Items

Each item from `fetchChildren` is an object with an `id` that is a positive whole number. The tree stores an `id`
sent as a string as a number. The tree reads these fields:

 * `id` (number, required): The id of the record.
 * `treeTitle` (string): The title of the item.
 * `tooltip` (string): The `title` attribute of the link.
 * `editUrl` (string): The `href` of the link.
 * `recordClass` (string): The class of the record, rendered as `data-recordtype`.
 * `classes` (string): Extra class names for the item.
 * `iconClasses` (string): The class names of the icon.
 * `statusFlags` (array): The status flags of the record, each with a `key` and a `text`. Each flag renders as a
   `StatusBadge`.
 * `hasChildren` (boolean): Whether the item has children to load.
 * `limited` (boolean): Whether the item has too many children to show. The tree shows a "show as list" link in
   place of the children.
 * `listViewUrl` (string): The `href` of the "show as list" link.
 * `canView` (boolean): `false` shows the item as disabled and stops a plain click on it. The browser handles any
   other click as for a link.
 * `canEdit` (boolean): `false` shows the item as disabled. A click still opens the item.

The tree does not read a `parentId` field. It records each item under the parent whose children it requested.
