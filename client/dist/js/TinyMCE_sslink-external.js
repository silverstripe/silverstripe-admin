webpackJsonp([1],{100:function(e,n){e.exports=TinyMCEActionRegistrar},125:function(e,n){e.exports=ReactApollo},180:function(e,n){e.exports=InsertLinkModal},24:function(e,n){e.exports=i18n},43:function(e,n){e.exports=Injector},935:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var r=t(24),o=i(r),a=t(100),l=i(a),s=t(0),d=i(s),u=t(25),c=i(u),f=t(125),p=t(27),x=i(p),m=t(180),k=t(43);l.default.addAction("sslink",{text:o.default._t("Admin.LINKLABEL_EXTERNALURL","Link to external URL"),onclick:function(e){return e.execCommand("sslinkexternal")}});var _={init:function(e){e.addCommand("sslinkexternal",function(){window.jQuery("#"+e.id).entwine("ss").openLinkExternalDialog()})}},L="insert-link__dialog-wrapper--external",A=(0,k.provideInjector)((0,m.createInsertLinkModal)("SilverStripe\\Admin\\LeftAndMain","EditorExternalLink"));x.default.entwine("ss",function(e){e("textarea.htmleditor").entwine({openLinkExternalDialog:function(){var n=e("#"+L);n.length||(n=e('<div id="'+L+'" />'),e("body").append(n)),n.addClass("insert-link__dialog-wrapper"),n.setElement(this),n.open()}}),e("#"+L).entwine({renderModal:function(e){var n=this,t=ss.store,i=ss.apolloClient,r=function(){return n.close()},a=function(){return n.handleInsert.apply(n,arguments)},l=this.getOriginalAttributes();c.default.render(d.default.createElement(f.ApolloProvider,{store:t,client:i},d.default.createElement(A,{show:e,onInsert:a,onHide:r,title:o.default._t("Admin.LINK_EXTERNAL","Insert external link"),bodyClassName:"modal__dialog",className:"insert-link__dialog-wrapper--external",fileAttributes:l,identifier:"Admin.InsertLinkExternalModal"})),this[0])},buildAttributes:function(e){var n=this._super(e),t=n.href;return t.match(/:\/\//)||(t=window.location.protocol+"//"+t),t=t.replace(/:\/\/(#.*)$/,"$2"),t.match(/:\/\/$/)&&(t=""),n.href=t,n}})}),tinymce.PluginManager.add("sslinkexternal",function(e){return _.init(e)}),n.default=_}},[935]);