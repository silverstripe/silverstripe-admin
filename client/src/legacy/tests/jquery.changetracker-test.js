/* global jest, describe, it, expect */

const jQuery = require('jquery');

global.$ = jQuery;
global.jQuery = jQuery;
require('../jquery.changetracker');

const errorSpy = jest.spyOn(global.console, 'error');
const warnSpy = jest.spyOn(global.console, 'warn');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('ChangeTracker', () => {
  describe('Basics()', () => {
    beforeEach(() => {
      jQuery('body').append(
        '<form method="GET" id="form_test" action="#"></form>'
      );
    });

    afterEach(() => {
      jQuery('#form_test').remove();
    });

    it('doesnt mark unaltered forms as changed', async () => {
      jQuery('#form_test').append(
        '<input type="text" name="field_text" value="origval" />'
      );

      jQuery('#form_test').changetracker();

      // This delay isn't necessary per se but it keeps the test consistent with the later tests
      await delay(300);

      expect(jQuery('#form_test').is('.changed')).toBeFalsy();
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('can track changes on input type=text fields with existing values', async () => {
      jQuery('#form_test').append(
        '<input type="text" name="field_text" value="origval" />'
      );

      jQuery('#form_test').changetracker();

      // We need to wait after initialisation or the test will fail - likely due to the debounce
      await delay(300);

      jQuery(':input[name=field_text]').val('newval').trigger('change');

      expect(jQuery('#form_test').is('.changed')).toBeTruthy();
      expect(jQuery(':input[name=field_text]').is('.changed')).toBeTruthy();
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('can track changes on input type=radio fields with existing values', async () => {
      jQuery('#form_test').append(
        '<input type="radio" id="field_radio1" name="field_radio" value="1" checked="checked" />'
        + '<input type="radio" id="field_radio2" name="field_radio" value="2" />'
      );
      jQuery('#form_test').changetracker();

      // We need to wait after initialisation or the test will fail - likely due to the debounce
      await delay(300);

      jQuery('#field_radio2').attr('checked', 'checked').trigger('click');

      expect(jQuery('#form_test').is('.changed')).toBeTruthy();
      expect(jQuery('#field_radio2').is('.changed')).toBeTruthy();
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('can track changes on select fields with existing values', async () => {
      jQuery('#form_test').append(
        '<select name="field_select">'
        + '<option value="1" selected="selected" />'
        + '<option value="2" />'
        + '</select>'
      );

      jQuery('#form_test').changetracker();

      // We need to wait after initialisation or the test will fail - likely due to the debounce
      await delay(300);

      jQuery(':input[name=field_select]').val(2).trigger('change');

      expect(jQuery('#form_test').is('.changed')).toBeTruthy();
      expect(jQuery(':input[name=field_select]').is('.changed')).toBeTruthy();
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('can exclude certain fields via an optional selector', async () => {
      jQuery('#form_test').append(
        '<input type="text" name="field_text" value="origval" />'
        + '<input type="text" name="field_text_ignored" value="origval" />'
      );

      jQuery('#form_test').changetracker({
        ignoreFieldSelector: ':input[name=field_text_ignored]'
      });

      // We need to wait after initialisation or the test will fail - likely due to the debounce
      await delay(300);

      jQuery(':input[name=field_text_ignored]').val('newval').trigger('change');

      expect(jQuery('#form_test').is('.changed')).toBeFalsy();
      expect(jQuery(':input[name=field_text_ignored]').is('.changed')).toBeFalsy();

      // We need to wait after the previous checks or the test will fail - likely due to debounce
      await delay(300);

      jQuery(':input[name=field_text]').val('newval').trigger('change');

      expect(jQuery('#form_test').is('.changed')).toBeTruthy();
      expect(jQuery(':input[name=field_text]').is('.changed')).toBeTruthy();
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('can attach custom CSS classes for tracking changed state', async () => {
      jQuery('#form_test').append(
        '<input type="text" name="field_text" value="origval" />'
      );

      jQuery('#form_test').changetracker({
        changedCssClass: 'customchanged'
      });

      // We need to wait after initialisation or the test will fail - likely due to the debounce
      await delay(300);

      jQuery(':input[name=field_text]').val('newval').trigger('change');

      expect(jQuery('#form_test').hasClass('changed')).toBeFalsy();
      expect(jQuery('#form_test').hasClass('customchanged')).toBeTruthy();
      expect(jQuery(':input[name=field_text]').hasClass('changed')).toBeFalsy();
      expect(jQuery(':input[name=field_text]').hasClass('customchanged')).toBeTruthy();
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('can reset changed state of individual fields', async () => {
      jQuery('#form_test').append(
        '<input type="text" name="field_text1" value="origval" />'
        + '<input type="text" name="field_text2" value="origval" />'
      );
      jQuery('#form_test').changetracker();

      // We need to wait after initialisation or the test will fail - likely due to the debounce
      await delay(300);

      jQuery(':input[name=field_text1]').val('newval').trigger('change');
      jQuery(':input[name=field_text2]').val('newval').trigger('change');
      jQuery('#form_test').changetracker('resetField', jQuery(':input[name=field_text1]'));

      // We need to wait after reset or the test will fail - likely due to the debounce
      await delay(300);

      expect(jQuery(':input[name=field_text1]').is('.changed')).toBeFalsy();
      expect(jQuery(':input[name=field_text2]').is('.changed')).toBeTruthy();
      expect(jQuery('#form_test').is('.changed')).toBeTruthy();
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('can reset all fields in the form', async () => {
      jQuery('#form_test').append(
        '<input type="text" name="field_text1" value="origval" />'
        + '<input type="text" name="field_text2" value="origval" />'
      );
      jQuery('#form_test').changetracker();

      jQuery(':input[name=field_text1]').val('newval').trigger('change');
      jQuery(':input[name=field_text2]').val('newval').trigger('change');
      jQuery('#form_test').changetracker('reset');

      // We need to wait after reset or the test will fail - likely due to the debounce
      await delay(300);

      expect(jQuery(':input[name=field_text1]').is('.changed')).toBeFalsy();
      expect(jQuery(':input[name=field_text2]').is('.changed')).toBeFalsy();
      expect(jQuery('#form_test').is('.changed')).toBeFalsy();
      expect(errorSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
