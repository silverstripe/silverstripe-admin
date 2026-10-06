/* global jest, describe, it, expect, beforeEach, afterEach */

const jQuery = require('jquery');

// LeftAndMain.js calls $.noConflict(), so in the CMS there is no global $.
// Mirror that here: only the imported jQuery is available.
delete global.$;
global.jQuery = jQuery;
// The legacy file registers entwine behaviour on load, which isn't under test here
jQuery.entwine = jest.fn();
// Expose the editor wrappers so the test can reach them
window.ss = {};
require('../HtmlEditorField');

function flushPromises() {
  return new Promise(resolve => jest.requireActual('timers').setImmediate(resolve));
}

describe('HtmlEditorField', () => {
  describe('tinyMCE wrapper create()', () => {
    let container;

    beforeEach(() => {
      jQuery('body').append(
        '<div class="panel--scrollable" id="scroll_test">' +
          '<textarea id="editor_test" data-config="{}"></textarea>' +
          '<div class="tox-tinymce"></div>' +
        '</div>' +
        '<div class="mce-floatpanel" style="top: 100px"></div>'
      );
      container = jQuery('#scroll_test .tox-tinymce').get(0);
      global.tinymce = {
        EditorManager: {},
        init: jest.fn(() => Promise.resolve([{ container }])),
      };
    });

    afterEach(() => {
      jQuery('#scroll_test, .mce-floatpanel').remove();
      delete global.tinymce;
      jest.useRealTimers();
    });

    it('hides and restores floatpanels on scroll without relying on a global $', async () => {
      expect(typeof global.$).toBe('undefined');

      const wrapper = window.ss.editorWrappers.tinyMCE();
      wrapper.init('editor_test');
      // Let the tinymce.init() promise resolve so the scroll listener is bound
      await flushPromises();

      jest.useFakeTimers();
      expect(() => {
        jQuery('#scroll_test').trigger('scroll');
      }).not.toThrow();
      expect(jQuery('.mce-floatpanel').css('opacity')).toBe('0');

      // Floatpanels are shown again once scrolling has stopped for 500ms
      jest.advanceTimersByTime(500);
      expect(jQuery('.mce-floatpanel').css('opacity')).toBe('1');
    });
  });
});
