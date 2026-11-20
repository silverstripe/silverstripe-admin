/* global jest, test, expect, beforeEach */
import ACTION_TYPES from '../TreeViewActionTypes';
import { getTreeStore, treeStores } from '../treeViewStore';

beforeEach(() => {
  treeStores.clear();
});

test('A tree store stops calling a listener that has unsubscribed', () => {
  const store = getTreeStore('pages');
  const listener = jest.fn();
  const unsubscribe = store.subscribe(listener);

  store.dispatch({ type: ACTION_TYPES.EXPAND_ITEM, id: 2 });
  unsubscribe();
  store.dispatch({ type: ACTION_TYPES.COLLAPSE_ITEM, id: 2 });

  expect(listener).toHaveBeenCalledTimes(1);
});
