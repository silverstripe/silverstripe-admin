!function(){"use strict";var t={745:function(t,e,n){var i=n(394);e.createRoot=i.createRoot,e.hydrateRoot=i.hydrateRoot},648:function(t){t.exports=Injector},595:function(t){t.exports=InsertLinkModal},363:function(t){t.exports=React},394:function(t){t.exports=ReactDom},196:function(t){t.exports=TinyMCEActionRegistrar},754:function(t){t.exports=i18n},311:function(t){t.exports=jQuery}},e={};function n(i){var r=e[i];if(void 0!==r)return r.exports;var o=e[i]={exports:{}};return t[i](o,o.exports,n),o.exports}!function(){var t=s(n(754)),e=s(n(196)),i=s(n(363)),r=n(745),o=s(n(311)),a=n(595),l=n(648);function s(t){return t&&t.__esModule?t:{default:t}}let d;e.default.addAction("sslink",{text:t.default._t("Admin.LINKLABEL_EXTERNALURL","Link to external URL"),onAction:t=>t.execCommand("sslinkexternal"),priority:70},d);const c={init(t){t.addCommand("sslinkexternal",(()=>{window.jQuery(`#${t.id}`).entwine("ss").openLinkExternalDialog()}))}},u="insert-link__dialog-wrapper--external",p=(0,l.loadComponent)((0,a.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorExternalLink"));o.default.entwine("ss",(e=>{e("textarea.htmleditor").entwine({openLinkExternalDialog(){let t=e(`#${u}`);t.length||(t=e(`<div id="${u}" />`),e("body").append(t)),t.addClass("insert-link__dialog-wrapper"),t.setElement(this),t.open()}}),e(`#${u}`).entwine({ReactRoot:null,renderModal(e){var n=this;const o=this.getOriginalAttributes(),a=this.getElement().getEditor(),l=a.getInstance().selection,s=a.getSelection(),d="A"!==l.getNode().tagName&&""===s.trim();let c=this.getReactRoot();c||(c=(0,r.createRoot)(this[0]),this.setReactRoot(c)),c.render(i.default.createElement(p,{isOpen:e,onInsert:function(){return n.handleInsert(...arguments)},onClosed:()=>this.close(),title:t.default._t("Admin.LINK_EXTERNAL","Insert external link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--external",fileAttributes:o,identifier:"Admin.InsertLinkExternalModal",requireLinkText:d}))},buildAttributes(t){const e=this._super(t);let n=e.href;return n.match(/:\/\//)||(n=`${window.location.protocol}//${n}`),n=n.replace(/.*:\/\/(#.*)$/,"$1"),n.match(/:\/\/$/)&&(n=""),e.href=n,e}})})),tinymce.PluginManager.add("sslinkexternal",(t=>{d=t.getParam("editorIdentifier"),c.init(t)}))}()}();