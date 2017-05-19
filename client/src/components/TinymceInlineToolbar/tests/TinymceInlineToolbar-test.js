/* global jest, describe, beforeEach, it, expect, document */
import { shouldShowToolbar, setupTinyMceInlineToolbar } from '../TinymceInlineToolbar';

// Mock tinycme.activeEditor
class Editor {
  constructor() {
    this.callbacks = [];
    this.contentDocument = document.createDocumentFragment();
    this.selection = {
      isCollapsed: () => true,
    };
  }

  getContainer() {
    // Not needed for testing
  }

  on(event, callback) {
    this.callbacks[event] = callback;
  }

  trigger(event, eventData) {
    const callback = this.callbacks[event];
    if (typeof callback === 'function') {
      callback(eventData);
    }
  }
}

describe('shouldShowToolbar function', () => {
  const tagsToCheck = ['A', 'P', 'EM', 'IMG'];

  it('should return true when one of the tag types is selected and the editor is focused', () => {
    expect(shouldShowToolbar({ tagName: 'A' }, true, tagsToCheck)).toBe(true);
  });

  it('should be case-insensitive', () => {
    expect(shouldShowToolbar({ tagName: 'img' }, true, tagsToCheck)).toBe(true);
  });

  it('should return false when there isn\'t a seleciton', () => {
    expect(shouldShowToolbar(null, true, tagsToCheck)).toBe(false);
  });

  it('should return false when the selected tag is\'t one of the tag types specified', () => {
    expect(shouldShowToolbar({ tagName: 'STRONG' }, true, tagsToCheck)).toBe(false);
    expect(shouldShowToolbar({ tagName: null }, true, tagsToCheck)).toBe(false);
    expect(shouldShowToolbar({ }, true, tagsToCheck)).toBe(false);
  });

  it('should return false when the editor is not focused', () => {
    expect(shouldShowToolbar({ tagName: 'IMG' }, false, tagsToCheck)).toBe(false);
  });

  it('should return false when the specified tag types to check is not an array', () => {
    expect(shouldShowToolbar({ tagName: 'IMG' }, true, null)).toBe(false);
    expect(shouldShowToolbar({ tagName: 'IMG' }, true, 3)).toBe(false);
    expect(shouldShowToolbar({ tagName: 'IMG' }, true, NaN)).toBe(false);
    expect(shouldShowToolbar({ tagName: 'IMG' }, true, undefined)).toBe(false);
  });
});

describe('setupTinyMceInlineToolbar function', () => {
  let editor = null;

  beforeEach(() => {
    global.tinymce = {
      ui: {
        Factory: {
          create: function create() {
            return {
              hide: jest.genMockFunction(),
              remove: jest.genMockFunction(),
              show: jest.genMockFunction(),
              renderTo: jest.genMockFunction(),
              getEl: () => document.createDocumentFragment(),
            };
          },
        },
      },
    };

    editor = new Editor();
  });

  it(`should create an instance of an inline toolbar and hook up editor's
      events to toolbar's event handlers`, () => {
    const toolbar = setupTinyMceInlineToolbar(editor, []);

    // hide() is called initially
    expect(toolbar.control.hide).toBeCalled();
    expect(toolbar.control.show).not.toBeCalled();
    expect(toolbar.control.remove).not.toBeCalled();

    editor.trigger('remove');
    expect(toolbar.control.show).not.toBeCalled();
    expect(toolbar.control.remove).toBeCalled();

    editor.trigger('focus');
    editor.trigger('nodechange', { element: document.createElement('a') });
    expect(toolbar.control.show).toBeCalled();
  });
});
