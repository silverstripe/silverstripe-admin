<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
webpackJsonp([2],[function(n,t,e){"use strict"
function i(n){return n&&n.__esModule?n:{default:n}}Object.defineProperty(t,"__esModule",{value:!0})
var r=Object.assign||function(n){for(var t=1;t<arguments.length;t++){var e=arguments[t]
for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(n[i]=e[i])}return n},o=e(2),a=i(o),s=e(3),c=i(s),u=e(4),l=i(u),d={init:function n(t){var e=a.default.getActions("sslink").map(function(n){return r({},n,{
onclick:function e(){return n.onclick(t)}})})
t.addButton("sslink",{icon:"link",title:"Insert Link",type:"menubutton",menu:e}),t.addMenuItem("sslink",{icon:"link",text:"Insert Link",menu:e})}}
l.default.entwine("ss",function(n){n(".insert-link__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function n(){this._clearModal()},_clearModal:function n(){c.default.unmountComponentAtNode(this[0])

},open:function n(){this.renderModal(!0)},close:function n(){this.setData({}),this.renderModal(!1)},renderModal:function n(){},handleInsert:function n(t){var e=this.buildAttributes(t)
this.insertLinkInEditor(e),this.close()},buildAttributes:function n(t){var e=t.Anchor&&t.Anchor.length?"#"+t.Anchor:"",i=""+t.Link+e
return{href:i,target:t.TargetBlank?"_blank":"",title:t.Description}},insertLinkInEditor:function n(t){var e=this.getElement().getEditor()
e.insertLink(t),e.addUndo(),e.repaint()},getOriginalAttributes:function t(){var e=this.getElement().getEditor(),i=n(e.getSelectedNode()),r=(i.attr("href")||"").split("#")
return{Link:r[0]||"",Anchor:r[1]||"",Description:i.attr("title"),TargetBlank:!!i.attr("target")}}})}),tinymce.PluginManager.add("sslink",function(n){return d.init(n)}),t.default=d},,function(n,t){"use strict"


function e(n,t){if(!(n instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0})
var i=function(){function n(n,t){for(var e=0;e<t.length;e++){var i=t[e]
i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(n,i.key,i)}}return function(t,e,i){return e&&n(t.prototype,e),i&&n(t,i),t}}(),r=function(){function n(){
e(this,n),this.actions={}}return i(n,[{key:"addAction",value:function n(t,e){this.actions[t]=this.getActions(t).concat([e])}},{key:"getActions",value:function n(t){return this.actions[t]||[]}}]),n}()
window.ss=window.ss||{},window.ss.tinymceactions=window.ss.tinymceactions||new r,t.default=window.ss.tinymceactions}])
=======
webpackJsonp([2],[
/* 0 */
/***/ (function(module, exports) {

	'use strict';
	
	(function () {
	  var sslink = {
	    init: function init(ed) {
	      ed.addButton('sslink', {
	        icon: 'link',
	        title: 'Insert Link',
	        cmd: 'sslink'
	      });
	      ed.addMenuItem('sslink', {
	        icon: 'link',
	        text: 'Insert Link',
	        cmd: 'sslink'
	      });
	
	      ed.addCommand('sslink', function () {
	        window.jQuery('#' + ed.id).entwine('ss').openLinkDialog();
	      });
	
	      ed.on('BeforeExecCommand', function (e) {
	        var cmd = e.command;
	        var ui = e.ui;
	        var val = e.value;
	        if (cmd === 'mceAdvLink' || cmd === 'mceLink') {
	          e.preventDefault();
	          ed.execCommand('sslink', ui, val);
	        }
	      });
	    }
	  };
	
	  tinymce.PluginManager.add('sslink', function (editor) {
	    return sslink.init(editor);
	  });
	})();

/***/ })
]);
//# sourceMappingURL=TinyMCE_sslink.js.map
>>>>>>> provide injector
=======
webpackJsonp([2],[function(n,i){"use strict"
!function(){var n={init:function n(i){i.addButton("sslink",{icon:"link",title:"Insert Link",cmd:"sslink"}),i.addMenuItem("sslink",{icon:"link",text:"Insert Link",cmd:"sslink"}),i.addCommand("sslink",function(){
window.jQuery("#"+i.id).entwine("ss").openLinkDialog()}),i.on("BeforeExecCommand",function(n){var e=n.command,t=n.ui,s=n.value
"mceAdvLink"!==e&&"mceLink"!==e||(n.preventDefault(),i.execCommand("sslink",t,s))})}}
tinymce.PluginManager.add("sslink",function(i){return n.init(i)})}()}])

//# sourceMappingURL=TinyMCE_sslink.js.map
>>>>>>> Context working
=======
webpackJsonp([2],[
/* 0 */
/***/ (function(module, exports) {

	'use strict';
	
	(function () {
	  var sslink = {
	    init: function init(ed) {
	      ed.addButton('sslink', {
	        icon: 'link',
	        title: 'Insert Link',
	        cmd: 'sslink'
	      });
	      ed.addMenuItem('sslink', {
	        icon: 'link',
	        text: 'Insert Link',
	        cmd: 'sslink'
	      });
	
	      ed.addCommand('sslink', function () {
	        window.jQuery('#' + ed.id).entwine('ss').openLinkDialog();
	      });
	
	      ed.on('BeforeExecCommand', function (e) {
	        var cmd = e.command;
	        var ui = e.ui;
	        var val = e.value;
	        if (cmd === 'mceAdvLink' || cmd === 'mceLink') {
	          e.preventDefault();
	          ed.execCommand('sslink', ui, val);
	        }
	      });
	    }
	  };
	
	  tinymce.PluginManager.add('sslink', function (editor) {
	    return sslink.init(editor);
	  });
	})();

/***/ })
]);
//# sourceMappingURL=TinyMCE_sslink.js.map
>>>>>>> it works
