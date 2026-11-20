/* global jest, test, expect */
import ACTION_TYPES from '../TreeViewActionTypes';
import reducer, { initialTreeState } from '../TreeViewReducer';
import { STATUS } from '../TreeViewConstants';
import { loadChildren, reloadTree, revealItem, trackOpenRequest } from '../TreeViewActions';
import { deferred, loadActions } from './mockTree';

function makeStore(actions = []) {
  let state = actions.reduce(reducer, initialTreeState);
  return {
    getState: () => state,
    dispatch: (action) => {
      state = reducer(state, action);
    },
  };
}

// Load items 1 and 2 at the top level, 5 and 6 under 2, and 7 under 5.
function makeLoadedStore() {
  return makeStore([
    ...loadActions(0, [{ id: 1, parentId: 0 }, { id: 2, parentId: 0, hasChildren: true }]),
    ...loadActions(2, [{ id: 5, parentId: 2, hasChildren: true }, { id: 6, parentId: 2 }]),
    ...loadActions(5, [{ id: 7, parentId: 5 }]),
  ]);
}

test('loadChildren marks the parent failed when the fetch throws or the response is not an array of items with ids', async () => {
  const fetches = [
    () => { throw new Error('Bad URL'); },
    () => Promise.resolve({ error: 'Denied' }),
    () => Promise.resolve([{ id: 1, parentId: 0 }, null]),
    () => Promise.resolve([{ id: 'new', parentId: 0 }]),
  ];
  await Promise.all(fetches.map(async (fetchChildren) => {
    const store = makeStore();
    await expect(loadChildren(store, 0, fetchChildren)).resolves.toBeUndefined();
    expect(store.getState().status[0]).toBe(STATUS.FAILED);
    expect(store.getState().childIds[0]).toBeUndefined();
  }));
});

test('loadChildren stores an item id that the server sends as a string as a number', async () => {
  const store = makeStore();
  await loadChildren(store, 0, () => Promise.resolve([{ id: '4', parentId: 0 }]));
  expect(store.getState().childIds[0]).toEqual([4]);
  expect(store.getState().items[4].id).toBe(4);
});

test('reloadTree fetches the children on screen, and fetches again children that were loading before the reload', async () => {
  const store = makeLoadedStore();
  store.dispatch({ type: ACTION_TYPES.EXPAND_ITEM, id: 2 });
  const beforeReload = deferred();
  const server = { 0: [{ id: 2, parentId: 0 }], 2: [{ id: 8, parentId: 2 }] };
  const fetchChildren = jest.fn((parentId) => (
    fetchChildren.mock.calls.length === 1 ? beforeReload.promise : Promise.resolve(server[parentId])
  ));
  loadChildren(store, 2, fetchChildren);

  const reloaded = reloadTree(store, 1, { fetchChildren });
  expect(fetchChildren.mock.calls).toEqual([[2], [0]]);
  expect(store.getState().childIds[5]).toBeUndefined();

  beforeReload.resolve([{ id: 6, parentId: 2 }]);
  await reloaded;
  expect(fetchChildren.mock.calls).toEqual([[2], [0], [2]]);
  expect(store.getState().childIds).toEqual({ 0: [2], 2: [8] });
});

test('revealItem fetches once the children of each parent above the item that are not loaded or lack the next item down', async () => {
  const store = makeLoadedStore();
  const fetchChildren = jest.fn((parentId) => Promise.resolve(
    parentId === 2 ? [{ id: 5, parentId: 2, hasChildren: true }, { id: 8, parentId: 2, hasChildren: true }] : []
  ));

  await revealItem(store, 9, fetchChildren, () => Promise.resolve(['0', '2', 8]));

  expect(fetchChildren.mock.calls).toEqual([[2], [8]]);
  expect(store.getState().childIds[2]).toEqual([5, 8]);
  expect(store.getState().expanded).toEqual([2, 8]);
});

test('revealItem marks the reveal failed on a failed fetch or a malformed path', async () => {
  const fetches = [
    () => Promise.reject(new Error('Server error')),
    () => { throw new Error('Bad URL'); },
    () => Promise.resolve({ error: 'Denied' }),
    () => Promise.resolve([2, 'new']),
  ];
  await Promise.all(fetches.map(async (fetchPath) => {
    const store = makeLoadedStore();
    const done = revealItem(store, 9, undefined, fetchPath);
    const requested = store.getState();
    await expect(done).resolves.toBeUndefined();
    expect(store.getState()).toEqual({ ...requested, isRevealing: false, isRevealFailed: true });
  }));
});

test('revealItem lets a late failure of an earlier reveal of the same item leave the latest reveal alone', async () => {
  const store = makeStore();
  const requests = [];
  const fetchPath = (id) => new Promise((resolve, reject) => {
    requests.push({ id, resolve, reject });
  });
  const fetchChildren = () => Promise.resolve([]);

  const firstRevealOf7 = revealItem(store, 7, fetchChildren, fetchPath);
  const revealOf6 = revealItem(store, 6, fetchChildren, fetchPath);
  const secondRevealOf7 = revealItem(store, 7, fetchChildren, fetchPath);
  requests[0].reject(new Error('Server error'));
  await firstRevealOf7;
  expect(store.getState().isRevealing).toBe(true);
  expect(store.getState().isRevealFailed).toBe(false);

  requests[2].resolve([0, 2, 5]);
  await secondRevealOf7;
  requests[1].resolve([0, 2]);
  await revealOf6;
  expect(store.getState().isRevealFailed).toBe(false);
  expect(store.getState().expanded).toEqual([2, 5]);
});

test('revealItem fetches no children for the path of an earlier reveal of the same item that responds late', async () => {
  const store = makeStore();
  const requests = [];
  const fetchPath = (id) => new Promise((resolve) => {
    requests.push({ id, resolve });
  });
  const fetchChildren = jest.fn(() => Promise.resolve([]));

  const firstRevealOf7 = revealItem(store, 7, fetchChildren, fetchPath);
  revealItem(store, 6, fetchChildren, fetchPath);
  revealItem(store, 7, fetchChildren, fetchPath);
  requests[0].resolve([0, 2, 5]);
  await firstRevealOf7;

  expect(fetchChildren).not.toHaveBeenCalled();
  expect(store.getState().isRevealing).toBe(true);
});

// Make a thenable like the return of a jQuery request. The thenable has `then()` but is not a `Promise`.
function thenable(settle) {
  return { then: (resolve, reject) => settle(resolve, reject) };
}

test('trackOpenRequest gives the pending item up when a request that is not a Promise fails, as a jQuery request does', async () => {
  const store = makeLoadedStore();

  await trackOpenRequest(store, 5, thenable((resolve, reject) => reject(new Error('abort'))));
  expect(store.getState().pendingId).toBeNull();

  await trackOpenRequest(store, 5, thenable((resolve) => resolve(false)));
  expect(store.getState().pendingId).toBeNull();
});

test('trackOpenRequest keeps the item pending for a request that resolves with anything but false, and for no request', async () => {
  const store = makeLoadedStore();

  await trackOpenRequest(store, 5, thenable((resolve) => resolve('')));
  expect(store.getState().pendingId).toBe(5);

  await trackOpenRequest(store, 6, Promise.resolve(undefined));
  expect(store.getState().pendingId).toBe(6);

  await trackOpenRequest(store, 7, true);
  expect(store.getState().pendingId).toBe(7);

  await trackOpenRequest(store, 5, undefined);
  expect(store.getState().pendingId).toBe(5);
});

test('trackOpenRequest marks no item pending when onOpen returned false', async () => {
  const store = makeLoadedStore();

  await trackOpenRequest(store, 5, false);

  expect(store.getState().pendingId).toBeNull();
  expect(store.getState().openCount).toBe(0);
});
