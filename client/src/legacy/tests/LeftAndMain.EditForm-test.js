/* global test, expect, describe, beforeEach */

import fs from 'fs';
import path from 'path';
import $ from 'jquery';
import { markTabValidationErrors } from '../LeftAndMain.EditForm';

/**
 * The fixtures are the edit form markup captured out of a CMS after a real failed save,
 * reduced to the tab, panel, nav and alert elements. See fixtures/README.md.
 */
const loadForm = (fixture) => {
  const html = fs.readFileSync(path.join(__dirname, 'fixtures', `${fixture}.html`), 'utf8');
  document.body.innerHTML = html;
  return $('.cms-edit-form');
};

const $tabLi = (panelId) => $(`li[aria-controls="${panelId}"]`);

const expectMarked = (panelId) => {
  expect($tabLi(panelId).find('.tab-attention').length).toBe(1);
  expect($tabLi(panelId).find('.tab-validation-error-sr').length).toBe(1);
};

const expectNotMarked = (panelId) => {
  expect($tabLi(panelId).find('.tab-attention').length).toBe(0);
  expect($tabLi(panelId).find('.tab-validation-error-sr').length).toBe(0);
};

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('a tab which is itself a TabSet', () => {
  test('marks the outer tab and the sub-tab on a page edit form', () => {
    const $form = loadForm('editForm-page-nested-tabset-as-tab');

    markTabValidationErrors($form);

    expectMarked('Root_Questions_set');
    expectMarked('Root_Questions_set_SectionB');
    expectNotMarked('Root_Main');
    expectNotMarked('Root_Questions_set_SectionA');
  });

  test('marks the outer tab and the sub-tab on a GridField detail form', () => {
    const $form = loadForm('editForm-gridfield-nested-tabset-as-tab');

    markTabValidationErrors($form);

    // the outer tab lives in the primary nav, which has no id="tab-<panelId>" anchors
    expectMarked('Root_Questions_set');
    expectMarked('Root_Questions_set_SectionB');
    expectNotMarked('Root_Main');
    expectNotMarked('Root_Questions_set_SectionA');
  });
});

describe('a TabSet added inside a Tab', () => {
  test('marks the outer tab and the sub-tab on a page edit form', () => {
    const $form = loadForm('editForm-page-nested-tabset-in-tab');

    markTabValidationErrors($form);

    expectMarked('Root_Other');
    expectMarked('Questions_SectionB');
    expectNotMarked('Root_Main');
    expectNotMarked('Questions_SectionA');
  });

  test('marks the outer tab and the sub-tab on a GridField detail form', () => {
    const $form = loadForm('editForm-gridfield-nested-tabset-in-tab');

    markTabValidationErrors($form);

    expectMarked('Root_Main');
    expectMarked('Questions_SectionB');
    expectNotMarked('Root_Other');
    expectNotMarked('Questions_SectionA');
  });
});

describe('flat tabs', () => {
  test('marks the invalid tab once on a page edit form', () => {
    const $form = loadForm('editForm-page-flat');

    markTabValidationErrors($form);

    expectMarked('Root_Beta');
    expectNotMarked('Root_Main');
    expectNotMarked('Root_Alpha');
    expect($form.find('.tab-attention').length).toBe(1);
  });

  test('marks the invalid tab once in the primary nav of a GridField detail form', () => {
    const $form = loadForm('editForm-gridfield-flat');

    markTabValidationErrors($form);

    expectMarked('Root_Beta');
    expectNotMarked('Root_Main');
    expectNotMarked('Root_Alpha');
    expect($form.find('.tab-attention').length).toBe(1);
  });
});

test('clears the markers from a previous render when the form is valid', () => {
  const $form = loadForm('editForm-page-flat-valid');
  // the fixture is the same form re-rendered after the error was fixed, so it still
  // carries the icon the previous render left on Root_Beta
  expect($form.find('.tab-attention').length).toBe(1);

  markTabValidationErrors($form);

  expect($form.find('.tab-attention').length).toBe(0);
  expect($form.find('.tab-validation-error-sr').length).toBe(0);
  expect($('#Form_EditForm_error').is(':visible')).toBe(false);
});

test('marks nothing when the only error is a non-field validation error', () => {
  const $form = loadForm('editForm-page-flat-valid');
  // ValidationResult::addError() puts a message in the banner without failing a field
  $('#Form_EditForm_error').html('Something went wrong');

  markTabValidationErrors($form);

  expect($form.find('.tab-attention').length).toBe(0);
  expect($('#Form_EditForm_error').html()).toBe('Something went wrong');
});

test('marks a tab once when it is the active tab and holds several invalid fields', () => {
  const $form = loadForm('editForm-page-nested-tabset-as-tab');
  const $pane = $('#Root_Questions_set_SectionB');
  // make the invalid sub-tab the open one, as it is after the editor clicks into it
  $pane.attr('aria-hidden', 'false').css('display', 'block');
  $tabLi('Root_Questions_set_SectionB').addClass('ui-tabs-active ui-state-active');
  // a second field on the same sub-tab also fails
  $pane.append($pane.find('.alert-danger').clone().attr('id', 'message-Form_EditForm_GammaValue'));
  expect($pane.find('.alert-danger').length).toBe(2);

  markTabValidationErrors($form);

  expectMarked('Root_Questions_set');
  expectMarked('Root_Questions_set_SectionB');
});

test('does not add a second icon when the form is redrawn', () => {
  const $form = loadForm('editForm-page-nested-tabset-as-tab');

  markTabValidationErrors($form);
  markTabValidationErrors($form);

  expectMarked('Root_Questions_set');
  expectMarked('Root_Questions_set_SectionB');
  expect($form.find('.tab-attention').length).toBe(2);
});

test('marks the tabs before jQuery UI has decorated the nested tabsets', () => {
  const $form = loadForm('editForm-page-nested-tabset-as-tab');
  // the handler runs on the first redraws of a form, when only the outer tabset has
  // been through tabs() and the nested one still carries the raw template markup
  $('#Root_Questions_set').find('[role="tab"], [role="tabpanel"], [role="tablist"]')
    .removeAttr('role')
    .removeAttr('aria-controls');

  markTabValidationErrors($form);

  expect($tabLi('Root_Questions_set').find('.tab-attention').length).toBe(1);
  expect($('a[id="tab-Root_Questions_set_SectionB"]').closest('li').find('.tab-attention').length)
    .toBe(1);
});

test('shows the error banner when a field on a nested tab is invalid', () => {
  const $form = loadForm('editForm-gridfield-nested-tabset-as-tab');
  const $banner = $('#Form_ItemEditForm_error');
  $banner.html('');

  markTabValidationErrors($form);

  expect($banner.html())
    .toBe('There are validation errors on this page, please fix them before saving or publishing.');
  expect($banner.attr('class')).toBe('alert alert-danger');
  expect($form.hasClass('validationerror')).toBe(true);
});
