<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
webpackJsonp([3],{911:function(n,t,e){"use strict";function i(n){return n&&n.__esModule?n:{default:n}}Object.defineProperty(t,"__esModule",{value:!0});var r=e(98),o=i(r),s=e(27),a=i(s),u=e(26),c=i(u),l={init:function(n){var t=o.default.getActions("sslink").map(function(t){return Object.assign({},t,{onclick:function(){return t.onclick(n)}})});n.addButton("sslink",{icon:"link",title:"Insert Link",type:"menubutton",menu:t}),n.addMenuItem("sslink",{icon:"link",text:"Insert Link",menu:t})}};c.default.entwine("ss",function(n){n(".insert-link__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){a.default.unmountComponentAtNode(this[0])},open:function(){this.renderModal(!0)},close:function(){this.setData({}),this.renderModal(!1)},renderModal:function(){},handleInsert:function(n){var t=this.buildAttributes(n);return this.insertLinkInEditor(t),this.close(),Promise.resolve()},buildAttributes:function(n){var t=n.Anchor&&n.Anchor.length?"#"+n.Anchor:"";return{href:""+n.Link+t,target:n.TargetBlank?"_blank":"",title:n.Description}},insertLinkInEditor:function(n){var t=this.getElement().getEditor();t.insertLink(n),t.addUndo(),t.repaint()},getOriginalAttributes:function(){var t=this.getElement().getEditor(),e=n(t.getSelectedNode()),i=(e.attr("href")||"").split("#");return{Link:i[0]||"",Anchor:i[1]||"",Description:e.attr("title"),TargetBlank:!!e.attr("target")}}})}),tinymce.PluginManager.add("sslink",function(n){return l.init(n)}),t.default=l},98:function(n,t,e){"use strict";function i(n,t){if(!(n instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function n(n,t){for(var e=0;e<t.length;e++){var i=t[e];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(n,i.key,i)}}return function(t,e,i){return e&&n(t.prototype,e),i&&n(t,i),t}}(),o=function(){function n(){i(this,n),this.actions={}}return r(n,[{key:"addAction",value:function(n,t){this.actions[n]=this.getActions(n).concat([t])}},{key:"getActions",value:function(n){return this.actions[n]||[]}}]),n}();window.ss=window.ss||{},window.ss.tinymceactions=window.ss.tinymceactions||new o,t.default=window.ss.tinymceactions}},[911]);
=======
=======
>>>>>>> Enhancement Split Injector to factories, creating different instances for different parts
=======
>>>>>>> Fix bug in creating the updater callback for different services
<<<<<<< HEAD
webpackJsonp([3],{911:function(t,n,e){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(n,"__esModule",{value:!0});var r=e(97),o=i(r),a=e(27),u=i(a),s=e(26),l=i(s),c={init:function(t){var n=o.default.getActions("sslink").map(function(n){return Object.assign({},n,{onclick:function(){return n.onclick(t)}})});t.addButton("sslink",{icon:"link",title:"Insert Link",type:"menubutton",menu:n}),t.addMenuItem("sslink",{icon:"link",text:"Insert Link",menu:n})}};l.default.entwine("ss",function(t){t(".insert-link__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){u.default.unmountComponentAtNode(this[0])},open:function(){this.renderModal(!0)},close:function(){this.setData({}),this.renderModal(!1)},renderModal:function(){},handleInsert:function(t){var n=this.buildAttributes(t);return this.insertLinkInEditor(n),this.close(),Promise.resolve()},buildAttributes:function(t){var n=t.Anchor&&t.Anchor.length?"#"+t.Anchor:"";return{href:""+t.Link+n,target:t.TargetBlank?"_blank":"",title:t.Description}},insertLinkInEditor:function(t){var n=this.getElement().getEditor();n.insertLink(t),n.addUndo(),n.repaint()},getOriginalAttributes:function(){var n=this.getElement().getEditor(),e=t(n.getSelectedNode()),i=(e.attr("href")||"").split("#");return{Link:i[0]||"",Anchor:i[1]||"",Description:e.attr("title"),TargetBlank:!!e.attr("target")}}})}),tinymce.PluginManager.add("sslink",function(t){return c.init(t)}),n.default=c},97:function(t,n){t.exports=TinyMCEActionRegistrar}},[911]);
=======
webpackJsonp([3],{911:function(t,n,e){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(n,"__esModule",{value:!0});var r=e(97),o=i(r),a=e(28),u=i(a),s=e(26),l=i(s),c={init:function(t){var n=o.default.getActions("sslink").map(function(n){return Object.assign({},n,{onclick:function(){return n.onclick(t)}})});t.addButton("sslink",{icon:"link",title:"Insert Link",type:"menubutton",menu:n}),t.addMenuItem("sslink",{icon:"link",text:"Insert Link",menu:n})}};l.default.entwine("ss",function(t){t(".insert-link__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){u.default.unmountComponentAtNode(this[0])},open:function(){this.renderModal(!0)},close:function(){this.setData({}),this.renderModal(!1)},renderModal:function(){},handleInsert:function(t){var n=this.buildAttributes(t);return this.insertLinkInEditor(n),this.close(),Promise.resolve()},buildAttributes:function(t){var n=t.Anchor&&t.Anchor.length?"#"+t.Anchor:"";return{href:""+t.Link+n,target:t.TargetBlank?"_blank":"",title:t.Description}},insertLinkInEditor:function(t){var n=this.getElement().getEditor();n.insertLink(t),n.addUndo(),n.repaint()},getOriginalAttributes:function(){var n=this.getElement().getEditor(),e=t(n.getSelectedNode()),i=(e.attr("href")||"").split("#");return{Link:i[0]||"",Anchor:i[1]||"",Description:e.attr("title"),TargetBlank:!!e.attr("target")}}})}),tinymce.PluginManager.add("sslink",function(t){return c.init(t)}),n.default=c},97:function(t,n){t.exports=TinyMCEActionRegistrar}},[911]);
>>>>>>> Fix use process.env for environment check in boot
<<<<<<< HEAD
>>>>>>> Fix use process.env for environment check in boot
=======
=======
webpackJsonp([3],{912:function(t,n,e){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(n,"__esModule",{value:!0});var r=e(97),o=i(r),a=e(28),u=i(a),s=e(26),l=i(s),c={init:function(t){var n=o.default.getActions("sslink").map(function(n){return Object.assign({},n,{onclick:function(){return n.onclick(t)}})});t.addButton("sslink",{icon:"link",title:"Insert Link",type:"menubutton",menu:n}),t.addMenuItem("sslink",{icon:"link",text:"Insert Link",menu:n})}};l.default.entwine("ss",function(t){t(".insert-link__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){u.default.unmountComponentAtNode(this[0])},open:function(){this.renderModal(!0)},close:function(){this.setData({}),this.renderModal(!1)},renderModal:function(){},handleInsert:function(t){var n=this.buildAttributes(t);return this.insertLinkInEditor(n),this.close(),Promise.resolve()},buildAttributes:function(t){var n=t.Anchor&&t.Anchor.length?"#"+t.Anchor:"";return{href:""+t.Link+n,target:t.TargetBlank?"_blank":"",title:t.Description}},insertLinkInEditor:function(t){var n=this.getElement().getEditor();n.insertLink(t),n.addUndo(),n.repaint()},getOriginalAttributes:function(){var n=this.getElement().getEditor(),e=t(n.getSelectedNode()),i=(e.attr("href")||"").split("#");return{Link:i[0]||"",Anchor:i[1]||"",Description:e.attr("title"),TargetBlank:!!e.attr("target")}}})}),tinymce.PluginManager.add("sslink",function(t){return c.init(t)}),n.default=c},97:function(t,n){t.exports=TinyMCEActionRegistrar}},[912]);
>>>>>>> Enhancement Split Injector to factories, creating different instances for different parts
<<<<<<< HEAD
>>>>>>> Enhancement Split Injector to factories, creating different instances for different parts
=======
=======
webpackJsonp([3],{913:function(t,n,e){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(n,"__esModule",{value:!0});var r=e(97),o=i(r),a=e(28),u=i(a),s=e(26),l=i(s),c={init:function(t){var n=o.default.getActions("sslink").map(function(n){return Object.assign({},n,{onclick:function(){return n.onclick(t)}})});t.addButton("sslink",{icon:"link",title:"Insert Link",type:"menubutton",menu:n}),t.addMenuItem("sslink",{icon:"link",text:"Insert Link",menu:n})}};l.default.entwine("ss",function(t){t(".insert-link__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){u.default.unmountComponentAtNode(this[0])},open:function(){this.renderModal(!0)},close:function(){this.setData({}),this.renderModal(!1)},renderModal:function(){},handleInsert:function(t){var n=this.buildAttributes(t);return this.insertLinkInEditor(n),this.close(),Promise.resolve()},buildAttributes:function(t){var n=t.Anchor&&t.Anchor.length?"#"+t.Anchor:"";return{href:""+t.Link+n,target:t.TargetBlank?"_blank":"",title:t.Description}},insertLinkInEditor:function(t){var n=this.getElement().getEditor();n.insertLink(t),n.addUndo(),n.repaint()},getOriginalAttributes:function(){var n=this.getElement().getEditor(),e=t(n.getSelectedNode()),i=(e.attr("href")||"").split("#");return{Link:i[0]||"",Anchor:i[1]||"",Description:e.attr("title"),TargetBlank:!!e.attr("target")}}})}),tinymce.PluginManager.add("sslink",function(t){return c.init(t)}),n.default=c},97:function(t,n){t.exports=TinyMCEActionRegistrar}},[913]);
>>>>>>> Fix bug in creating the updater callback for different services
>>>>>>> Fix bug in creating the updater callback for different services
=======
webpackJsonp([3],{914:function(t,n,e){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(n,"__esModule",{value:!0});var r=e(97),o=i(r),a=e(27),u=i(a),s=e(26),l=i(s),c={init:function(t){var n=o.default.getActions("sslink").map(function(n){return Object.assign({},n,{onclick:function(){return n.onclick(t)}})});t.addButton("sslink",{icon:"link",title:"Insert Link",type:"menubutton",menu:n}),t.addMenuItem("sslink",{icon:"link",text:"Insert Link",menu:n})}};l.default.entwine("ss",function(t){t(".insert-link__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){u.default.unmountComponentAtNode(this[0])},open:function(){this.renderModal(!0)},close:function(){this.setData({}),this.renderModal(!1)},renderModal:function(){},handleInsert:function(t){var n=this.buildAttributes(t);return this.insertLinkInEditor(n),this.close(),Promise.resolve()},buildAttributes:function(t){var n=t.Anchor&&t.Anchor.length?"#"+t.Anchor:"";return{href:""+t.Link+n,target:t.TargetBlank?"_blank":"",title:t.Description}},insertLinkInEditor:function(t){var n=this.getElement().getEditor();n.insertLink(t),n.addUndo(),n.repaint()},getOriginalAttributes:function(){var n=this.getElement().getEditor(),e=t(n.getSelectedNode()),i=(e.attr("href")||"").split("#");return{Link:i[0]||"",Anchor:i[1]||"",Description:e.attr("title"),TargetBlank:!!e.attr("target")}}})}),tinymce.PluginManager.add("sslink",function(t){return c.init(t)}),n.default=c},97:function(t,n){t.exports=TinyMCEActionRegistrar}},[914]);
>>>>>>> rebase
=======
webpackJsonp([3],{

/***/ 938:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TinyMCEActionRegistrar = __webpack_require__(98);

var _TinyMCEActionRegistrar2 = _interopRequireDefault(_TinyMCEActionRegistrar);

var _reactDom = __webpack_require__(28);

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

/***/ 98:
/***/ (function(module, exports) {

module.exports = TinyMCEActionRegistrar;

/***/ })

},[938]);
//# sourceMappingURL=TinyMCE_sslink.js.map
>>>>>>> Merge with reducer work
=======
webpackJsonp([3],{923:function(t,n,e){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(n,"__esModule",{value:!0});var r=e(97),o=i(r),a=e(27),u=i(a),s=e(26),l=i(s),c={init:function(t){var n=o.default.getActions("sslink").map(function(n){return Object.assign({},n,{onclick:function(){return n.onclick(t)}})});t.addButton("sslink",{icon:"link",title:"Insert Link",type:"menubutton",menu:n}),t.addMenuItem("sslink",{icon:"link",text:"Insert Link",menu:n})}};l.default.entwine("ss",function(t){t(".insert-link__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){u.default.unmountComponentAtNode(this[0])},open:function(){this.renderModal(!0)},close:function(){this.setData({}),this.renderModal(!1)},renderModal:function(){},handleInsert:function(t){var n=this.buildAttributes(t);return this.insertLinkInEditor(n),this.close(),Promise.resolve()},buildAttributes:function(t){var n=t.Anchor&&t.Anchor.length?"#"+t.Anchor:"";return{href:""+t.Link+n,target:t.TargetBlank?"_blank":"",title:t.Description}},insertLinkInEditor:function(t){var n=this.getElement().getEditor();n.insertLink(t),n.addUndo(),n.repaint()},getOriginalAttributes:function(){var n=this.getElement().getEditor(),e=t(n.getSelectedNode()),i=(e.attr("href")||"").split("#");return{Link:i[0]||"",Anchor:i[1]||"",Description:e.attr("title"),TargetBlank:!!e.attr("target")}}})}),tinymce.PluginManager.add("sslink",function(t){return c.init(t)}),n.default=c},97:function(t,n){t.exports=TinyMCEActionRegistrar}},[923]);
>>>>>>> Fix add reserve keyword check to Injector
