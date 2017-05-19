/* global window, tinymce */

/**
 * Create an inline / floating tinymce toolbar. For example, this is used for
 * edit and remove link when a node is focused.
 *
 * @param  {Object} tinymce editor instance
 * @param  {Array} array of button literal object
 */
export default function createTinyMceInlineToolbar(editor, buttons) {
  const toolbar = tinymce.ui.Factory.create({
    type: 'panel',
    classes: 'inline-toolbar',
    layout: 'stack',
    items: [
      {
        type: 'toolbar',
        items: buttons,
      },
    ],
  })
    .hide()
    .renderTo(window.document.body);

  tinymce.DOM.setStyles(toolbar.getEl(), {
    position: 'absolute',
    top: 100,
    left: 500,
  });

  editor.on('remove', () => {
    toolbar.remove();
  });

  editor.on('nodechange', (e) => {
    if (e.element.tagName === 'A') {
      toolbar.show();
    } else {
      toolbar.hide();
    }
  });

  editor.on('blur', () => {
    toolbar.hide();
  });

  return toolbar;
}

