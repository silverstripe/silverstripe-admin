!function(e){function t(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s="./client/src/legacy/TinyMCE_sslink-email.js")}({"./client/src/legacy/TinyMCE_sslink-email.js":function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n("i18n"),o=i(r),a=n("lib/TinyMCEActionRegistrar"),l=i(a),s=n("react"),c=i(s),d=n("react-dom"),u=i(d),m=n("jquery"),f=i(m),p=n("containers/InsertLinkModal/InsertLinkModal"),g=n("lib/Injector");l.default.addAction("sslink",{text:o.default._t("Admin.LINKLABEL_EMAIL","Link to email address"),onclick:function(e){return e.execCommand("sslinkemail")},priority:51},editorIdentifier).addCommandWithUrlTest("sslinkemail",/^mailto:/);var k={init:function(e){e.addCommand("sslinkemail",function(){window.jQuery("#"+e.id).entwine("ss").openLinkEmailDialog()})}},b="insert-link__dialog-wrapper--email",y=(0,g.loadComponent)((0,p.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorEmailLink"));f.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkEmailDialog:function(){var t=e("#"+b);t.length||(t=e('<div id="'+b+'" />'),e("body").append(t)),t.addClass("insert-link__dialog-wrapper"),t.setElement(this),t.open()}}),e("#"+b).entwine({renderModal:function(e){var t=this,n=function(){return t.close()},i=function(){return t.handleInsert.apply(t,arguments)},r=this.getOriginalAttributes(),a=tinymce.activeEditor.selection,l=a.getContent()||"";l||(l=a.getSel().toString()),l=l||"";var s=a.getNode().tagName,d="A"!==s&&""===l.trim();u.default.render(c.default.createElement(y,{isOpen:e,onInsert:i,onClosed:n,title:o.default._t("Admin.LINK_EMAIL","Insert email link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--email",fileAttributes:r,identifier:"Admin.InsertLinkEmailModal",requireLinkText:d}),this[0])},getOriginalAttributes:function(){var t=this.getElement().getEditor(),n=e(t.getSelectedNode()),i=(n.attr("href")||"").split("?"),r=i[0].replace(/^mailto:/,"").split("?")[0];r.match(/.+@.+\..+/)||(r="");var o=i[1]?i[1].match(/subject=([^&]+)/):"";return{Link:r,Subject:o?decodeURIComponent(o[1]):"",Description:n.attr("title")}},buildAttributes:function(e){var t=this._super(e),n="",i=t.href.replace(/^mailto:/,"").split("?")[0];return i.match(/.+@.+\..+/)||(i=""),i&&(n="mailto:"+i),n&&e.Subject&&(n=n+"?subject="+encodeURIComponent(e.Subject)),t.href=n,delete t.target,t}})}),tinymce.PluginManager.add("sslinkemail",function(e){return k.init(e)}),t.default=k},"containers/InsertLinkModal/InsertLinkModal":function(e,t){e.exports=InsertLinkModal},i18n:function(e,t){e.exports=i18n},jquery:function(e,t){e.exports=jQuery},"lib/Injector":function(e,t){e.exports=Injector},"lib/TinyMCEActionRegistrar":function(e,t){e.exports=TinyMCEActionRegistrar},react:function(e,t){e.exports=React},"react-dom":function(e,t){e.exports=ReactDom}});