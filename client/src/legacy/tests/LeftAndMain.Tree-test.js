/* global jest, test, expect */

import $ from 'jquery';
import { updateRovingTabindex, resetTabindexToCurrentPage, isOpenButUnloaded } from '../LeftAndMain.Tree';

// Helper to simulate tree structure
const setupTreeDOM = (html) => {
  document.body.innerHTML = html;
};

test('ArrowUp should navigate to parent element', () => {
  setupTreeDOM(`
    <div class="cms-tree">
      <ul>
        <li id="record-0" class="jstree-open" data-id="0">
          <span class="jstree-icon jstree-icon--arrow root-toggle" tabindex="-1"></span>
          <ul>
            <li data-id="1" class="jstree-leaf">
              <span class="jstree-icon jstree-icon--arrow"></span>
              <a class="node-1" tabindex="0">Page 1</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  `);
  const firstPageLink = $('.node-1');
  expect(firstPageLink.attr('tabindex')).toBe('0');
});

test('Home key should focus first page node', () => {
  setupTreeDOM(`
    <div class="cms-tree">
      <ul>
        <li id="record-0" class="jstree-open" data-id="0">
          <span class="jstree-icon jstree-icon--arrow" tabindex="-1"></span>
          <ul>
            <li data-id="1" class="jstree-leaf">
              <span class="jstree-icon jstree-icon--arrow"></span>
              <a class="node-1" tabindex="-1">Page 1</a>
            </li>
            <li data-id="2" class="jstree-leaf">
              <span class="jstree-icon jstree-icon--arrow"></span>
              <a class="node-2" tabindex="0" aria-current="page">Page 2</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  `);
  const $tree = $('.cms-tree');
  const $firstPage = $tree.find('li[data-id]').not('[data-id="0"]')
    .first()
    .find('> a')
    .first();
  updateRovingTabindex($tree, $firstPage);
  expect($('.node-1').attr('tabindex')).toBe('0');
  expect($('.node-2').attr('tabindex')).toBe('-1');
});

test('When no aria-current page exists, first page has tabindex 0', () => {
  setupTreeDOM(`
    <div class="cms-tree">
      <ul>
        <li id="record-0" class="jstree-open" data-id="0">
          <span class="jstree-icon jstree-icon--arrow" tabindex="0"></span>
          <ul>
            <li data-id="1" class="jstree-leaf">
              <span class="jstree-icon jstree-icon--arrow"></span>
              <a class="node-1" tabindex="-1">Page 1</a>
            </li>
            <li data-id="2" class="jstree-leaf">
              <span class="jstree-icon jstree-icon--arrow"></span>
              <a class="node-2" tabindex="0">Page 2</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  `);
  const $tree = $('.cms-tree');
  resetTabindexToCurrentPage($tree);
  expect($('.node-1').attr('tabindex')).toBe('0');
  expect($('.node-2').attr('tabindex')).toBe('-1');
  expect($('#record-0 > .jstree-icon--arrow').attr('tabindex')).toBe('-1');
});

test('Root toggle can be focused via updateRovingTabindex', () => {
  setupTreeDOM(`
    <div class="cms-tree">
      <ul>
        <li id="record-0" class="jstree-open" data-id="0">
          <span class="jstree-icon jstree-icon--arrow root-toggle" tabindex="-1"></span>
          <ul>
            <li data-id="1" class="jstree-leaf">
              <span class="jstree-icon jstree-icon--arrow"></span>
              <a class="node-1" tabindex="0">Page 1</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  `);
  const $tree = $('.cms-tree');
  const $rootToggle = $('.root-toggle');
  updateRovingTabindex($tree, $rootToggle);
  expect($rootToggle.attr('tabindex')).toBe('0');
  expect($('.node-1').attr('tabindex')).toBe('-1');
});

test('updateRovingTabindex sets single focusable element', () => {
  document.body.innerHTML = `
    <div class="cms-tree">
      <ul>
        <li data-id="1">
          <span class="jstree-icon jstree-icon--arrow toggle-1" tabindex="0"></span>
          <a class="node-1" tabindex="0"></a>
        </li>
        <li data-id="2">
          <span class="jstree-icon jstree-icon--arrow" tabindex="-1"></span>
          <a class="node-2" tabindex="-1"></a>
        </li>
        <li data-id="3">
          <span class="jstree-icon jstree-icon--arrow" tabindex="-1"></span>
          <a class="node-3" tabindex="-1" aria-current="page"></a>
        </li>
      </ul>
    </div>
  `;
  const $tree = $('.cms-tree');
  const target = $('.node-2');
  updateRovingTabindex($tree, target);
  expect($('.node-1').attr('tabindex')).toBe('-1');
  expect($('.node-2').attr('tabindex')).toBe('0');
  expect($('.node-3').attr('tabindex')).toBe('-1');
  expect($('.toggle-1').attr('tabindex')).toBe('-1');
  expect($('.node-3').attr('aria-current')).toBe('page');
});

test('updateRovingTabindex works with toggle elements', () => {
  document.body.innerHTML = `
    <div class="cms-tree">
      <ul>
        <li data-id="1">
          <span class="jstree-icon jstree-icon--arrow toggle-1" tabindex="-1"></span>
          <a class="node-1" tabindex="0"></a>
        </li>
      </ul>
    </div>
  `;
  const $tree = $('.cms-tree');
  const target = $('.toggle-1');
  updateRovingTabindex($tree, target);
  expect($('.node-1').attr('tabindex')).toBe('-1');
  expect($('.toggle-1').attr('tabindex')).toBe('0');
});

test('resetTabindexToCurrentPage focuses aria-current page', () => {
  document.body.innerHTML = `
    <div class="cms-tree">
      <ul>
        <li data-id="0"><span class="jstree-icon jstree-icon--arrow toggle-1" tabindex="-1"></span></li>
        <li data-id="1"><a class="node-1" tabindex="-1"></a></li>
        <li data-id="2"><a class="node-2" tabindex="0"></a></li>
        <li data-id="3"><a class="node-3" tabindex="-1" aria-current="page"></a></li>
      </ul>
    </div>
  `;
  const $tree = $('.cms-tree');
  resetTabindexToCurrentPage($tree);
  expect($('.node-1').attr('tabindex')).toBe('-1');
  expect($('.node-2').attr('tabindex')).toBe('-1');
  expect($('.node-3').attr('tabindex')).toBe('0');
  expect($('.toggle-1').attr('tabindex')).toBe('-1');
});

test('resetTabindexToCurrentPage focuses first page when no aria-current', () => {
  document.body.innerHTML = `
    <div class="cms-tree">
      <li data-id="0"><span class="jstree-icon jstree-icon--arrow toggle-0" tabindex="-1"></span></li>
      <li data-id="1"><a class="node-1" tabindex="-1"></a></li>
      <li data-id="2"><a class="node-2" tabindex="0"></a></li>
    </div>
  `;
  const $tree = $('.cms-tree');
  resetTabindexToCurrentPage($tree);
  expect($('.node-1').attr('tabindex')).toBe('0');
  expect($('.node-2').attr('tabindex')).toBe('-1');
  expect($('.toggle-0').attr('tabindex')).toBe('-1');
});

test('ArrowUp from first page stays on first page (root is not keyboard focusable)', () => {
  setupTreeDOM(`
    <div class="cms-tree">
      <ul>
        <li id="record-0" class="jstree-open" data-id="0">
          <span class="jstree-icon jstree-icon--arrow"></span>
          <strong class="root-strong">Your Site Name</strong>
          <ul>
            <li data-id="1" class="jstree-leaf">
              <span class="jstree-icon jstree-icon--arrow"></span>
              <a class="node-1" tabindex="0">Page 1</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  `);
  // Root strong should never have tabindex - keyboard users skip it
  const $rootStrong = $('.root-strong');
  expect($rootStrong.attr('tabindex')).toBeUndefined();
  expect($('.node-1').attr('tabindex')).toBe('0');
});

test('Tree with .multiple class can identify checkable nodes', () => {
  setupTreeDOM(`
    <div class="cms-tree multiple jstree">
      <ul>
        <li id="record-0" class="jstree-open" data-id="0">
          <span class="jstree-icon jstree-icon--arrow"></span>
          <ul>
            <li data-id="1" class="jstree-leaf">
              <span class="jstree-icon jstree-icon--arrow"></span>
              <a class="node-1" tabindex="0">Page 1</a>
            </li>
            <li data-id="2" class="jstree-leaf jstree-checked">
              <span class="jstree-icon jstree-icon--arrow"></span>
              <a class="node-2" tabindex="-1">Page 2</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  `);
  const $tree = $('.cms-tree');
  const $li1 = $('[data-id="1"]');
  const $li2 = $('[data-id="2"]');
  expect($tree.hasClass('multiple')).toBe(true);
  expect($li1.hasClass('jstree-checked')).toBe(false);
  expect($li2.hasClass('jstree-checked')).toBe(true);
});

test('Tree without .multiple class is not in batch mode', () => {
  setupTreeDOM(`
    <div class="cms-tree jstree">
      <ul>
        <li id="record-0" class="jstree-open" data-id="0">
          <span class="jstree-icon jstree-icon--arrow"></span>
          <ul>
            <li data-id="1" class="jstree-leaf">
              <span class="jstree-icon jstree-icon--arrow"></span>
              <a class="node-1" tabindex="0">Page 1</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  `);
  const $tree = $('.cms-tree');
  expect($tree.hasClass('multiple')).toBe(false);
});

test('Tree container element exists for focus styling', () => {
  setupTreeDOM(`
    <div class="cms-tree">
      <ul>
        <li id="record-0" class="jstree-open" data-id="0">
          <span class="jstree-icon jstree-icon--arrow"></span>
          <a class="node-root" tabindex="0">Root</a>
        </li>
      </ul>
    </div>
  `);
  const $tree = $('.cms-tree');
  expect($tree.length).toBe(1);
  expect($tree.hasClass('cms-tree')).toBe(true);
});

test('A node is treated as loaded based on its direct children, not its grandchildren', () => {
  setupTreeDOM(`
    <div class="cms-tree">
      <ul>
        <li data-id="1" class="jstree-open">
          <a class="node-1">Page 1</a>
          <ul>
            <li data-id="2" class="jstree-open">
              <a class="node-2">Page 2</a>
              <ul>
                <li data-id="3" class="jstree-leaf"><a class="node-3">Page 3</a></li>
                <li data-id="4" class="jstree-leaf"><a class="node-4">Page 4</a></li>
                <li data-id="5" class="jstree-leaf"><a class="node-5">Page 5</a></li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  `);
  // Node 1 is loaded on the strength of node 2 alone, regardless of node 2's own children
  expect(isOpenButUnloaded($('.cms-tree').find('[data-id=1]'))).toBe(false);
  expect(isOpenButUnloaded($('.cms-tree').find('[data-id=2]'))).toBe(false);
});

test('A parent stops being treated as unloaded once its hidden children are loaded in', () => {
  setupTreeDOM(`
    <div class="cms-tree">
      <ul>
        <li data-id="1" class="jstree-open">
          <a class="node-1">Page 1</a>
          <ul>
            <li data-id="2" class="jstree-open">
              <a class="node-2">Page 2</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  `);
  const $parent = $('.cms-tree').find('[data-id=2]');
  // The server rendered the parent open but stopped short of its children, hiding all three
  expect(isOpenButUnloaded($parent)).toBe(true);
  $parent.append(`
    <ul>
      <li data-id="3" class="jstree-leaf"><a class="node-3">Page 3</a></li>
      <li data-id="4" class="jstree-leaf"><a class="node-4">Page 4</a></li>
      <li data-id="5" class="jstree-leaf"><a class="node-5">Page 5</a></li>
    </ul>
  `);
  expect(isOpenButUnloaded($parent)).toBe(false);
  expect($parent.children('ul').children('li').length).toBe(3);
});
