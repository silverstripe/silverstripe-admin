<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
webpackJsonp([1],{100:function(e,n){e.exports=TinyMCEActionRegistrar},125:function(e,n){e.exports=ReactApollo},180:function(e,n){e.exports=InsertLinkModal},24:function(e,n){e.exports=i18n},43:function(e,n){e.exports=Injector},935:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var r=t(24),o=i(r),a=t(100),l=i(a),s=t(0),d=i(s),u=t(25),c=i(u),f=t(125),p=t(27),x=i(p),m=t(180),k=t(43);l.default.addAction("sslink",{text:o.default._t("Admin.LINKLABEL_EXTERNALURL","Link to external URL"),onclick:function(e){return e.execCommand("sslinkexternal")}});var _={init:function(e){e.addCommand("sslinkexternal",function(){window.jQuery("#"+e.id).entwine("ss").openLinkExternalDialog()})}},L="insert-link__dialog-wrapper--external",A=(0,k.provideInjector)((0,m.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorExternalLink"));x.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkExternalDialog:function(){var n=e("#"+L);n.length||(n=e('<div id="'+L+'" />'),e("body").append(n)),n.addClass("insert-link__dialog-wrapper"),n.setElement(this),n.open()}}),e("#"+L).entwine({renderModal:function(e){var n=this,t=ss.store,i=ss.apolloClient,r=function(){return n.close()},a=function(){return n.handleInsert.apply(n,arguments)},l=this.getOriginalAttributes();c.default.render(d.default.createElement(f.ApolloProvider,{store:t,client:i},d.default.createElement(A,{show:e,onInsert:a,onHide:r,title:o.default._t("Admin.LINK_EXTERNAL","Insert external link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--external",fileAttributes:l,identifier:"Admin.InsertLinkExternalModal"})),this[0])},buildAttributes:function(e){var n=this._super(e),t=n.href;return t.match(/:\/\//)||(t=window.location.protocol+"//"+t),t=t.replace(/:\/\/(#.*)$/,"$2"),t.match(/:\/\/$/)&&(t=""),n.href=t,n}})}),tinymce.PluginManager.add("sslinkexternal",function(e){return _.init(e)}),n.default=_}},[935]);
=======
<<<<<<< HEAD
webpackJsonp([1],{100:function(e,n){e.exports=TinyMCEActionRegistrar},125:function(e,n){e.exports=ReactApollo},180:function(e,n){e.exports=InsertLinkModal},24:function(e,n){e.exports=i18n},45:function(e,n){e.exports=Injector},934:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var r=t(24),o=i(r),a=t(100),l=i(a),s=t(0),d=i(s),u=t(25),c=i(u),f=t(125),p=t(27),x=i(p),m=t(180),k=t(45);l.default.addAction("sslink",{text:o.default._t("Admin.LINKLABEL_EXTERNALURL","Link to external URL"),onclick:function(e){return e.execCommand("sslinkexternal")}});var _={init:function(e){e.addCommand("sslinkexternal",function(){window.jQuery("#"+e.id).entwine("ss").openLinkExternalDialog()})}},L="insert-link__dialog-wrapper--external",A=(0,k.provideInjector)((0,m.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorExternalLink"));x.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkExternalDialog:function(){var n=e("#"+L);n.length||(n=e('<div id="'+L+'" />'),e("body").append(n)),n.addClass("insert-link__dialog-wrapper"),n.setElement(this),n.open()}}),e("#"+L).entwine({renderModal:function(e){var n=this,t=ss.store,i=ss.apolloClient,r=function(){return n.close()},a=function(){return n.handleInsert.apply(n,arguments)},l=this.getOriginalAttributes();c.default.render(d.default.createElement(f.ApolloProvider,{store:t,client:i},d.default.createElement(A,{show:e,onInsert:a,onHide:r,title:o.default._t("Admin.LINK_EXTERNAL","Insert external link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--external",fileAttributes:l,identifier:"Admin.InsertLinkExternalModal"})),this[0])},buildAttributes:function(e){var n=this._super(e),t=n.href;return t.match(/:\/\//)||(t=window.location.protocol+"//"+t),t=t.replace(/:\/\/(#.*)$/,"$2"),t.match(/:\/\/$/)&&(t=""),n.href=t,n}})}),tinymce.PluginManager.add("sslinkexternal",function(e){return _.init(e)}),n.default=_}},[934]);
=======
webpackJsonp([1],{125:function(e,n){e.exports=ReactApollo},180:function(e,n){e.exports=InsertLinkModal},24:function(e,n){e.exports=i18n},45:function(e,n){e.exports=Injector},933:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var r=t(24),o=i(r),a=t(99),l=i(a),s=t(0),d=i(s),u=t(25),c=i(u),f=t(125),p=t(27),m=i(p),x=t(180),k=t(45);l.default.addAction("sslink",{text:o.default._t("Admin.LINKLABEL_EXTERNALURL","Link to external URL"),onclick:function(e){return e.execCommand("sslinkexternal")}});var L={init:function(e){e.addCommand("sslinkexternal",function(){window.jQuery("#"+e.id).entwine("ss").openLinkExternalDialog()})}},_="insert-link__dialog-wrapper--external",A=(0,k.provideInjector)((0,x.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorExternalLink"));m.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkExternalDialog:function(){var n=e("#"+_);n.length||(n=e('<div id="'+_+'" />'),e("body").append(n)),n.addClass("insert-link__dialog-wrapper"),n.setElement(this),n.open()}}),e("#"+_).entwine({renderModal:function(e){var n=this,t=ss.store,i=ss.apolloClient,r=function(){return n.close()},a=function(){return n.handleInsert.apply(n,arguments)},l=this.getOriginalAttributes(),s=tinymce.activeEditor.selection.getContent()||"";c.default.render(d.default.createElement(f.ApolloProvider,{store:t,client:i},d.default.createElement(A,{show:e,onInsert:a,onHide:r,title:o.default._t("Admin.LINK_EXTERNAL","Insert external link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--external",fileAttributes:l,identifier:"Admin.InsertLinkExternalModal",requireLinkText:""===s.trim()})),this[0])},buildAttributes:function(e){var n=this._super(e),t=n.href;return t.match(/:\/\//)||(t=window.location.protocol+"//"+t),t=t.replace(/:\/\/(#.*)$/,"$2"),t.match(/:\/\/$/)&&(t=""),n.href=t,n}})}),tinymce.PluginManager.add("sslinkexternal",function(e){return L.init(e)}),n.default=L},99:function(e,n){e.exports=TinyMCEActionRegistrar}},[933]);
>>>>>>> Add "Link text" field
>>>>>>> Add "Link text" field
=======
webpackJsonp([1],{100:function(e,n){e.exports=TinyMCEActionRegistrar},125:function(e,n){e.exports=ReactApollo},180:function(e,n){e.exports=InsertLinkModal},24:function(e,n){e.exports=i18n},45:function(e,n){e.exports=Injector},934:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var r=t(24),o=i(r),a=t(100),l=i(a),s=t(0),d=i(s),u=t(25),c=i(u),f=t(125),p=t(27),m=i(p),x=t(180),k=t(45);l.default.addAction("sslink",{text:o.default._t("Admin.LINKLABEL_EXTERNALURL","Link to external URL"),onclick:function(e){return e.execCommand("sslinkexternal")}});var L={init:function(e){e.addCommand("sslinkexternal",function(){window.jQuery("#"+e.id).entwine("ss").openLinkExternalDialog()})}},_="insert-link__dialog-wrapper--external",A=(0,k.provideInjector)((0,x.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorExternalLink"));m.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkExternalDialog:function(){var n=e("#"+_);n.length||(n=e('<div id="'+_+'" />'),e("body").append(n)),n.addClass("insert-link__dialog-wrapper"),n.setElement(this),n.open()}}),e("#"+_).entwine({renderModal:function(e){var n=this,t=ss.store,i=ss.apolloClient,r=function(){return n.close()},a=function(){return n.handleInsert.apply(n,arguments)},l=this.getOriginalAttributes(),s=tinymce.activeEditor.selection.getContent()||"";c.default.render(d.default.createElement(f.ApolloProvider,{store:t,client:i},d.default.createElement(A,{show:e,onInsert:a,onHide:r,title:o.default._t("Admin.LINK_EXTERNAL","Insert external link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--external",fileAttributes:l,identifier:"Admin.InsertLinkExternalModal",requireLinkText:""===s.trim()})),this[0])},buildAttributes:function(e){var n=this._super(e),t=n.href;return t.match(/:\/\//)||(t=window.location.protocol+"//"+t),t=t.replace(/:\/\/(#.*)$/,"$2"),t.match(/:\/\/$/)&&(t=""),n.href=t,n}})}),tinymce.PluginManager.add("sslinkexternal",function(e){return L.init(e)}),n.default=L}},[934]);
>>>>>>> Ensure ModalController uses parent request
=======
webpackJsonp([1],{100:function(e,t){e.exports=TinyMCEActionRegistrar},125:function(e,t){e.exports=ReactApollo},180:function(e,t){e.exports=InsertLinkModal},24:function(e,t){e.exports=i18n},45:function(e,t){e.exports=Injector},934:function(e,t,n){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(24),o=i(r),a=n(100),l=i(a),s=n(0),d=i(s),u=n(25),c=i(u),f=n(125),p=n(27),m=i(p),x=n(180),k=n(45);l.default.addAction("sslink",{text:o.default._t("Admin.LINKLABEL_EXTERNALURL","Link to external URL"),onclick:function(e){return e.execCommand("sslinkexternal")}});var L={init:function(e){e.addCommand("sslinkexternal",function(){window.jQuery("#"+e.id).entwine("ss").openLinkExternalDialog()})}},_="insert-link__dialog-wrapper--external",A=(0,k.provideInjector)((0,x.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorExternalLink"));m.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkExternalDialog:function(){var t=e("#"+_);t.length||(t=e('<div id="'+_+'" />'),e("body").append(t)),t.addClass("insert-link__dialog-wrapper"),t.setElement(this),t.open()}}),e("#"+_).entwine({renderModal:function(e){var t=this,n=ss.store,i=ss.apolloClient,r=function(){return t.close()},a=function(){return t.handleInsert.apply(t,arguments)},l=this.getOriginalAttributes(),s=tinymce.activeEditor.selection,u=s.getContent()||"",p=s.getNode().tagName,m="A"!==p&&""===u.trim();c.default.render(d.default.createElement(f.ApolloProvider,{store:n,client:i},d.default.createElement(A,{show:e,onInsert:a,onHide:r,title:o.default._t("Admin.LINK_EXTERNAL","Insert external link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--external",fileAttributes:l,identifier:"Admin.InsertLinkExternalModal",requireLinkText:m})),this[0])},buildAttributes:function(e){var t=this._super(e),n=t.href;return n.match(/:\/\//)||(n=window.location.protocol+"//"+n),n=n.replace(/:\/\/(#.*)$/,"$2"),n.match(/:\/\/$/)&&(n=""),t.href=n,t}})}),tinymce.PluginManager.add("sslinkexternal",function(e){return L.init(e)}),t.default=L}},[934]);
>>>>>>> BUG: "Link text" field shouldn't show when editing a (existing) link
