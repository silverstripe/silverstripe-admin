<<<<<<< HEAD
webpackJsonp([3],{932:function(t,n,e){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(n,"__esModule",{value:!0});var r=e(98),o=i(r),a=e(26),u=i(a),s=e(27),l=i(s),c={init:function(t){var n=o.default.getActions("sslink").map(function(n){return Object.assign({},n,{onclick:function(){return n.onclick(t)}})});t.addButton("sslink",{icon:"link",title:"Insert Link",type:"menubutton",menu:n}),t.addMenuItem("sslink",{icon:"link",text:"Insert Link",menu:n})}};l.default.entwine("ss",function(t){t(".insert-link__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){u.default.unmountComponentAtNode(this[0])},open:function(){this.renderModal(!0)},close:function(){this.setData({}),this.renderModal(!1)},renderModal:function(){},handleInsert:function(t){var n=this.buildAttributes(t);return this.insertLinkInEditor(n),this.close(),Promise.resolve()},buildAttributes:function(t){var n=t.Anchor&&t.Anchor.length?"#"+t.Anchor:"";return{href:""+t.Link+n,target:t.TargetBlank?"_blank":"",title:t.Description}},insertLinkInEditor:function(t){var n=this.getElement().getEditor();n.insertLink(t),n.addUndo(),n.repaint()},getOriginalAttributes:function(){var n=this.getElement().getEditor(),e=t(n.getSelectedNode()),i=(e.attr("href")||"").split("#");return{Link:i[0]||"",Anchor:i[1]||"",Description:e.attr("title"),TargetBlank:!!e.attr("target")}}})}),tinymce.PluginManager.add("sslink",function(t){return c.init(t)}),n.default=c},98:function(t,n){t.exports=TinyMCEActionRegistrar}},[932]);
=======
webpackJsonp([3],{

/***/ 946:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TinyMCEActionRegistrar = __webpack_require__(99);

var _TinyMCEActionRegistrar2 = _interopRequireDefault(_TinyMCEActionRegistrar);

var _reactDom = __webpack_require__(27);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _jquery = __webpack_require__(26);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var plugin = {
  init: function init(editor) {
    var actions = _TinyMCEActionRegistrar2.default.getActions('sslink').map(function (action) {
      return Object.assign({}, action, { onclick: function onclick() {
          return action.onclick(editor);
        } });
    });

    editor.addButton('sslink', {
      icon: 'link',
      title: 'Insert Link',
      type: 'menubutton',
      menu: actions
    });
    editor.addMenuItem('sslink', {
      icon: 'link',
      text: 'Insert Link',
      menu: actions
    });
  }
};

_jquery2.default.entwine('ss', function ($) {
  $('.insert-link__dialog-wrapper').entwine({
    Element: null,

    Data: {},

    onunmatch: function onunmatch() {
      this._clearModal();
    },
    _clearModal: function _clearModal() {
      _reactDom2.default.unmountComponentAtNode(this[0]);
    },
    open: function open() {
      this.renderModal(true);
    },
    close: function close() {
      this.setData({});
      this.renderModal(false);
    },
    renderModal: function renderModal() {},
    handleInsert: function handleInsert(data) {
      var attributes = this.buildAttributes(data);

      this.insertLinkInEditor(attributes);
      this.close();

      return Promise.resolve();
    },
    buildAttributes: function buildAttributes(data) {
      var anchor = data.Anchor && data.Anchor.length ? '#' + data.Anchor : '';
      var href = '' + data.Link + anchor;

      return {
        href: href,
        target: data.TargetBlank ? '_blank' : '',
        title: data.Description
      };
    },
    insertLinkInEditor: function insertLinkInEditor(attributes) {
      var editor = this.getElement().getEditor();
      editor.insertLink(attributes);
      editor.addUndo();
      editor.repaint();
    },
    getOriginalAttributes: function getOriginalAttributes() {
      var editor = this.getElement().getEditor();
      var node = $(editor.getSelectedNode());

      var hrefParts = (node.attr('href') || '').split('#');

      return {
        Link: hrefParts[0] || '',
        Anchor: hrefParts[1] || '',
        Description: node.attr('title'),
        TargetBlank: !!node.attr('target')
      };
    }
  });
});

tinymce.PluginManager.add('sslink', function (editor) {
  return plugin.init(editor);
});

exports.default = plugin;

/***/ }),

/***/ 99:
/***/ (function(module, exports) {

module.exports = TinyMCEActionRegistrar;

/***/ })

},[946]);
//# sourceMappingURL=TinyMCE_sslink.js.map
>>>>>>> getFactory moved to containers
