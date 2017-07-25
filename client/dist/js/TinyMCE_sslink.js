<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
webpackJsonp([3],{100:function(t,e){t.exports=TinyMCEActionRegistrar},776:function(t,e,n){"use strict";function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e,n){var o=Array.isArray(n)?n:[n||""];return Boolean(t&&o.map(function(t){return String(t)}).map(function(t){return t.toLowerCase()}).includes((t.tagName||"").toLowerCase())&&e)}function r(t,e){function n(){i(l,u,o)&&(r.hide(),clearTimeout(c),c=setTimeout(function(){r.show(),r.reposition(l)},300))}var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:["a"],r=new a(t,e),l=null,c=null,u=!1;return r.hide().renderTo(window.document.body),t.on("remove",function(){r.remove()}),t.on("focus",function(){u=!0}),t.on("blur hide",function(){r.hide(),u=!1}),t.on("nodechange",function(e){var n={element:e.element,parents:e.parents,collapsed:t.selection.isCollapsed()};l=n.selection||n.element,i(l,u,o)?(r.show(),r.reposition(l)):r.hide()}),window.addEventListener("scroll",function(e){e.target.contains(document.querySelector("#"+t.id))&&n()},!0),t.contentDocument.addEventListener("scroll",n),r}Object.defineProperty(e,"__esModule",{value:!0});var l=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),a=function(){function t(e,n){o(this,t),this.mceIframe=document.getElementById(e.id+"_ifr"),this.container=e.getContainer(),this.mceToolbar=null,this.mceStatusbar=null,this.container&&(this.mceToolbar=this.container.querySelector(".mce-toolbar-grp"),this.mceStatusbar=this.container.querySelector(".mce-statusbar")),this.control=tinymce.ui.Factory.create({type:"panel",classes:"inline-toolbar",layout:"stack",items:[{type:"toolbar",items:n}]})}return l(t,[{key:"remove",value:function(){return this.control.remove(),this}},{key:"hide",value:function(){return this.control.hide(),this}},{key:"show",value:function(){return this.control.show(),this}},{key:"renderTo",value:function(t){return this.control.renderTo(t),this}},{key:"setStyles",value:function(t){return tinymce.DOM.setStyles(this.control.getEl(),t),this}},{key:"reposition",value:function(t){if(!t)return this;var e=window.pageXOffset||document.documentElement.scrollLeft,n=window.pageYOffset||document.documentElement.scrollTop,o=window.innerWidth,i=window.innerHeight,r=this.mceIframe?this.mceIframe.getBoundingClientRect():{top:0,right:o,bottom:i,left:0,width:o,height:i},l=this.control.getEl(),a=l.offsetWidth,c=l.offsetHeight,u=t.getBoundingClientRect(),s=(u.left+u.right)/2,d=c+8+5,f=this.mceToolbar?this.mceToolbar.getBoundingClientRect().bottom:0,h=this.mceStatusbar?i-this.mceStatusbar.getBoundingClientRect().top:0,m=Math.max(0,f,r.top),p=Math.max(0,h,i-r.bottom),g=u.top+r.top-m,b=i-r.top-u.bottom-p,w=i-m-p,y="",v=0,k=0;return g>=w||b>=w?this.hide():(this.bottom?b>=d?(y=" mce-arrow-up",v=u.bottom+r.top+n+10):g>=d&&(y=" mce-arrow-down",v=u.top+r.top+n-c-8):g>=d?(y=" mce-arrow-down",v=u.top+r.top+n-c-8):b>=d&&w/2>u.bottom+r.top-m&&(y=" mce-arrow-up",v=u.bottom+r.top+n+10),void 0===v&&(v=n+m+5),k=s-a/2+r.left+e,u.left<0||u.right>r.width?k=r.left+e+(r.width-a)/2:a>=o?(y+=" mce-arrow-full",k=0):k<0&&u.left+a>o||k+a>o&&u.right-a<0?k=(o-a)/2:k<r.left+e?(y+=" mce-arrow-left",k=u.left+r.left+e):k+a>r.width+r.left+e&&(y+=" mce-arrow-right",k=u.right-a+r.left+e),l.className=l.className.replace(/ ?mce-arrow-[\w]+/g,"")+y,this.setStyles({left:k,top:v}),this)}}]),t}();e.default=a,e.setupTinyMceInlineToolbar=r,e.shouldShowToolbar=i},935:function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(100),r=o(i),l=n(25),a=o(l),c=n(27),u=o(c),s=n(776),d={init:function(t){function e(){var e=tinymce.activeEditor.selection.getNode(),n=e.getAttribute("href");n&&t.execCommand(r.default.getEditorCommandFromUrl(n))}var n=r.default.getActions("sslink").map(function(e){return Object.assign({},e,{onclick:function(){return e.onclick(t)}})});t.addButton("sslink",{icon:"link",title:"Insert Link",type:"menubutton",menu:n}),t.addMenuItem("sslink",{icon:"link",text:"Insert Link",menu:n}),t.on("preinit",function(){(0,s.setupTinyMceInlineToolbar)(t,[{type:"button",onClick:e,text:"Edit link"},{type:"button",onClick:function(){return t.execCommand("unlink")},text:"Remove link"}])})}};u.default.entwine("ss",function(t){t(".insert-link__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){a.default.unmountComponentAtNode(this[0])},open:function(){this.renderModal(!0)},close:function(){this.setData({}),this.renderModal(!1)},renderModal:function(){},handleInsert:function(t){var e=this.buildAttributes(t);return this.insertLinkInEditor(e),this.close(),Promise.resolve()},buildAttributes:function(t){var e=t.Anchor&&t.Anchor.length?"#"+t.Anchor:"";return{href:""+t.Link+e,target:t.TargetBlank?"_blank":"",title:t.Description}},insertLinkInEditor:function(t){var e=this.getElement().getEditor();e.insertLink(t),e.addUndo(),e.repaint()},getOriginalAttributes:function(){var e=this.getElement().getEditor(),n=t(e.getSelectedNode()),o=(n.attr("href")||"").split("#");return{Link:o[0]||"",Anchor:o[1]||"",Description:n.attr("title"),TargetBlank:!!n.attr("target")}}})}),tinymce.PluginManager.add("sslink",function(t){return d.init(t)}),e.default=d}},[935]);
=======
webpackJsonp([3],{100:function(t,e){t.exports=TinyMCEActionRegistrar},775:function(t,e,n){"use strict";function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e,n){var o=Array.isArray(n)?n:[n||""];return Boolean(t&&o.map(function(t){return String(t)}).map(function(t){return t.toLowerCase()}).includes((t.tagName||"").toLowerCase())&&e)}function r(t,e){function n(){i(l,u,o)&&(r.hide(),clearTimeout(c),c=setTimeout(function(){r.show(),r.reposition(l)},300))}var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:["a"],r=new a(t,e),l=null,c=null,u=!1;return r.hide().renderTo(window.document.body),t.on("remove",function(){r.remove()}),t.on("focus",function(){u=!0}),t.on("blur hide",function(){r.hide(),u=!1}),t.on("nodechange",function(e){var n={element:e.element,parents:e.parents,collapsed:t.selection.isCollapsed()};l=n.selection||n.element,i(l,u,o)?(r.show(),r.reposition(l)):r.hide()}),window.addEventListener("scroll",function(e){e.target.contains(document.querySelector("#"+t.id))&&n()},!0),t.contentDocument.addEventListener("scroll",n),r}Object.defineProperty(e,"__esModule",{value:!0});var l=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),a=function(){function t(e,n){o(this,t),this.mceIframe=document.getElementById(e.id+"_ifr"),this.container=e.getContainer(),this.mceToolbar=null,this.mceStatusbar=null,this.container&&(this.mceToolbar=this.container.querySelector(".mce-toolbar-grp"),this.mceStatusbar=this.container.querySelector(".mce-statusbar")),this.control=tinymce.ui.Factory.create({type:"panel",classes:"inline-toolbar",layout:"stack",items:[{type:"toolbar",items:n}]})}return l(t,[{key:"remove",value:function(){return this.control.remove(),this}},{key:"hide",value:function(){return this.control.hide(),this}},{key:"show",value:function(){return this.control.show(),this}},{key:"renderTo",value:function(t){return this.control.renderTo(t),this}},{key:"setStyles",value:function(t){return tinymce.DOM.setStyles(this.control.getEl(),t),this}},{key:"reposition",value:function(t){if(!t)return this;var e=window.pageXOffset||document.documentElement.scrollLeft,n=window.pageYOffset||document.documentElement.scrollTop,o=window.innerWidth,i=window.innerHeight,r=this.mceIframe?this.mceIframe.getBoundingClientRect():{top:0,right:o,bottom:i,left:0,width:o,height:i},l=this.control.getEl(),a=l.offsetWidth,c=l.offsetHeight,u=t.getBoundingClientRect(),s=(u.left+u.right)/2,d=c+8+5,f=this.mceToolbar?this.mceToolbar.getBoundingClientRect().bottom:0,h=this.mceStatusbar?i-this.mceStatusbar.getBoundingClientRect().top:0,m=Math.max(0,f,r.top),p=Math.max(0,h,i-r.bottom),g=u.top+r.top-m,b=i-r.top-u.bottom-p,w=i-m-p,y="",v=0,k=0;return g>=w||b>=w?this.hide():(this.bottom?b>=d?(y=" mce-arrow-up",v=u.bottom+r.top+n+10):g>=d&&(y=" mce-arrow-down",v=u.top+r.top+n-c-8):g>=d?(y=" mce-arrow-down",v=u.top+r.top+n-c-8):b>=d&&w/2>u.bottom+r.top-m&&(y=" mce-arrow-up",v=u.bottom+r.top+n+10),void 0===v&&(v=n+m+5),k=s-a/2+r.left+e,u.left<0||u.right>r.width?k=r.left+e+(r.width-a)/2:a>=o?(y+=" mce-arrow-full",k=0):k<0&&u.left+a>o||k+a>o&&u.right-a<0?k=(o-a)/2:k<r.left+e?(y+=" mce-arrow-left",k=u.left+r.left+e):k+a>r.width+r.left+e&&(y+=" mce-arrow-right",k=u.right-a+r.left+e),l.className=l.className.replace(/ ?mce-arrow-[\w]+/g,"")+y,this.setStyles({left:k,top:v}),this)}}]),t}();e.default=a,e.setupTinyMceInlineToolbar=r,e.shouldShowToolbar=i},934:function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(100),r=o(i),l=n(25),a=o(l),c=n(27),u=o(c),s=n(775),d={init:function(t){function e(){var e=tinymce.activeEditor.selection.getNode(),n=e.getAttribute("href");n&&t.execCommand(r.default.getEditorCommandFromUrl(n))}var n=r.default.getActions("sslink").map(function(e){return Object.assign({},e,{onclick:function(){return e.onclick(t)}})});t.addButton("sslink",{icon:"link",title:"Insert Link",type:"menubutton",menu:n}),t.addMenuItem("sslink",{icon:"link",text:"Insert Link",menu:n}),t.on("preinit",function(){(0,s.setupTinyMceInlineToolbar)(t,[{type:"button",onClick:e,text:"Edit link"},{type:"button",onClick:function(){return t.execCommand("unlink")},text:"Remove link"}])})}};u.default.entwine("ss",function(t){t(".insert-link__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){a.default.unmountComponentAtNode(this[0])},open:function(){this.renderModal(!0)},close:function(){this.setData({}),this.renderModal(!1)},renderModal:function(){},handleInsert:function(t){var e=this.buildAttributes(t);return this.insertLinkInEditor(e),this.close(),Promise.resolve()},buildAttributes:function(t){var e=t.Anchor&&t.Anchor.length?"#"+t.Anchor:"";return{href:""+t.Link+e,target:t.TargetBlank?"_blank":"",title:t.Description}},insertLinkInEditor:function(t){var e=this.getElement().getEditor();e.insertLink(t),e.addUndo(),e.repaint()},getOriginalAttributes:function(){var e=this.getElement().getEditor(),n=t(e.getSelectedNode()),o=(n.attr("href")||"").split("#");return{Link:o[0]||"",Anchor:o[1]||"",Description:n.attr("title"),TargetBlank:!!n.attr("target")}}})}),tinymce.PluginManager.add("sslink",function(t){return d.init(t)}),e.default=d}},[934]);
>>>>>>> Expand injector form API to be more state aware with FormStateManager
=======
webpackJsonp([3],{100:function(t,e){t.exports=TinyMCEActionRegistrar},776:function(t,e,n){"use strict";function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e,n){var o=Array.isArray(n)?n:[n||""];return Boolean(t&&o.map(function(t){return String(t)}).map(function(t){return t.toLowerCase()}).includes((t.tagName||"").toLowerCase())&&e)}function r(t,e){function n(){i(l,u,o)&&(r.hide(),clearTimeout(c),c=setTimeout(function(){r.show(),r.reposition(l)},300))}var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:["a"],r=new a(t,e),l=null,c=null,u=!1;return r.hide().renderTo(window.document.body),t.on("remove",function(){r.remove()}),t.on("focus",function(){u=!0}),t.on("blur hide",function(){r.hide(),u=!1}),t.on("nodechange",function(e){var n={element:e.element,parents:e.parents,collapsed:t.selection.isCollapsed()};l=n.selection||n.element,i(l,u,o)?(r.show(),r.reposition(l)):r.hide()}),window.addEventListener("scroll",function(e){e.target.contains(document.querySelector("#"+t.id))&&n()},!0),t.contentDocument.addEventListener("scroll",n),r}Object.defineProperty(e,"__esModule",{value:!0});var l=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),a=function(){function t(e,n){o(this,t),this.mceIframe=document.getElementById(e.id+"_ifr"),this.container=e.getContainer(),this.mceToolbar=null,this.mceStatusbar=null,this.container&&(this.mceToolbar=this.container.querySelector(".mce-toolbar-grp"),this.mceStatusbar=this.container.querySelector(".mce-statusbar")),this.control=tinymce.ui.Factory.create({type:"panel",classes:"inline-toolbar",layout:"stack",items:[{type:"toolbar",items:n}]})}return l(t,[{key:"remove",value:function(){return this.control.remove(),this}},{key:"hide",value:function(){return this.control.hide(),this}},{key:"show",value:function(){return this.control.show(),this}},{key:"renderTo",value:function(t){return this.control.renderTo(t),this}},{key:"setStyles",value:function(t){return tinymce.DOM.setStyles(this.control.getEl(),t),this}},{key:"reposition",value:function(t){if(!t)return this;var e=window.pageXOffset||document.documentElement.scrollLeft,n=window.pageYOffset||document.documentElement.scrollTop,o=window.innerWidth,i=window.innerHeight,r=this.mceIframe?this.mceIframe.getBoundingClientRect():{top:0,right:o,bottom:i,left:0,width:o,height:i},l=this.control.getEl(),a=l.offsetWidth,c=l.offsetHeight,u=t.getBoundingClientRect(),s=(u.left+u.right)/2,d=c+8+5,f=this.mceToolbar?this.mceToolbar.getBoundingClientRect().bottom:0,h=this.mceStatusbar?i-this.mceStatusbar.getBoundingClientRect().top:0,m=Math.max(0,f,r.top),p=Math.max(0,h,i-r.bottom),g=u.top+r.top-m,b=i-r.top-u.bottom-p,w=i-m-p,y="",v=0,k=0;return g>=w||b>=w?this.hide():(this.bottom?b>=d?(y=" mce-arrow-up",v=u.bottom+r.top+n+10):g>=d&&(y=" mce-arrow-down",v=u.top+r.top+n-c-8):g>=d?(y=" mce-arrow-down",v=u.top+r.top+n-c-8):b>=d&&w/2>u.bottom+r.top-m&&(y=" mce-arrow-up",v=u.bottom+r.top+n+10),void 0===v&&(v=n+m+5),k=s-a/2+r.left+e,u.left<0||u.right>r.width?k=r.left+e+(r.width-a)/2:a>=o?(y+=" mce-arrow-full",k=0):k<0&&u.left+a>o||k+a>o&&u.right-a<0?k=(o-a)/2:k<r.left+e?(y+=" mce-arrow-left",k=u.left+r.left+e):k+a>r.width+r.left+e&&(y+=" mce-arrow-right",k=u.right-a+r.left+e),l.className=l.className.replace(/ ?mce-arrow-[\w]+/g,"")+y,this.setStyles({left:k,top:v}),this)}}]),t}();e.default=a,e.setupTinyMceInlineToolbar=r,e.shouldShowToolbar=i},935:function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(100),r=o(i),l=n(25),a=o(l),c=n(27),u=o(c),s=n(776),d={init:function(t){function e(){var e=tinymce.activeEditor.selection.getNode(),n=e.getAttribute("href");n&&t.execCommand(r.default.getEditorCommandFromUrl(n))}var n=r.default.getActions("sslink").map(function(e){return Object.assign({},e,{onclick:function(){return e.onclick(t)}})});t.addButton("sslink",{icon:"link",title:"Insert Link",type:"menubutton",menu:n}),t.addMenuItem("sslink",{icon:"link",text:"Insert Link",menu:n}),t.on("preinit",function(){(0,s.setupTinyMceInlineToolbar)(t,[{type:"button",onClick:e,text:"Edit link"},{type:"button",onClick:function(){return t.execCommand("unlink")},text:"Remove link"}])})}};u.default.entwine("ss",function(t){t(".insert-link__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){a.default.unmountComponentAtNode(this[0])},open:function(){this.renderModal(!0)},close:function(){this.setData({}),this.renderModal(!1)},renderModal:function(){},handleInsert:function(t){var e=this.buildAttributes(t);return this.insertLinkInEditor(e),this.close(),Promise.resolve()},buildAttributes:function(t){var e=t.Anchor&&t.Anchor.length?"#"+t.Anchor:"";return{href:""+t.Link+e,target:t.TargetBlank?"_blank":"",title:t.Description}},insertLinkInEditor:function(t){var e=this.getElement().getEditor();e.insertLink(t),e.addUndo(),e.repaint()},getOriginalAttributes:function(){var e=this.getElement().getEditor(),n=t(e.getSelectedNode()),o=(n.attr("href")||"").split("#");return{Link:o[0]||"",Anchor:o[1]||"",Description:n.attr("title"),TargetBlank:!!n.attr("target")}}})}),tinymce.PluginManager.add("sslink",function(t){return d.init(t)}),e.default=d}},[935]);
>>>>>>> Fix bug where form state was one mutation behind the transformations
=======
webpackJsonp([3],{100:function(t,e){t.exports=TinyMCEActionRegistrar},776:function(t,e,n){"use strict";function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e,n){var o=Array.isArray(n)?n:[n||""];return Boolean(t&&o.map(function(t){return String(t)}).map(function(t){return t.toLowerCase()}).includes((t.tagName||"").toLowerCase())&&e)}function r(t,e){function n(){i(l,u,o)&&(r.hide(),clearTimeout(c),c=setTimeout(function(){r.show(),r.reposition(l)},300))}var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:["a"],r=new a(t,e),l=null,c=null,u=!1;return r.hide().renderTo(window.document.body),t.on("remove",function(){r.remove()}),t.on("focus",function(){u=!0}),t.on("blur hide",function(){r.hide(),u=!1}),t.on("nodechange",function(e){var n={element:e.element,parents:e.parents,collapsed:t.selection.isCollapsed()};l=n.selection||n.element,i(l,u,o)?(r.show(),r.reposition(l)):r.hide()}),window.addEventListener("scroll",function(e){e.target.contains(document.querySelector("#"+t.id))&&n()},!0),t.contentDocument.addEventListener("scroll",n),r}Object.defineProperty(e,"__esModule",{value:!0});var l=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),a=function(){function t(e,n){o(this,t),this.mceIframe=document.getElementById(e.id+"_ifr"),this.container=e.getContainer(),this.mceToolbar=null,this.mceStatusbar=null,this.container&&(this.mceToolbar=this.container.querySelector(".mce-toolbar-grp"),this.mceStatusbar=this.container.querySelector(".mce-statusbar")),this.control=tinymce.ui.Factory.create({type:"panel",classes:"inline-toolbar",layout:"stack",items:[{type:"toolbar",items:n}]})}return l(t,[{key:"remove",value:function(){return this.control.remove(),this}},{key:"hide",value:function(){return this.control.hide(),this}},{key:"show",value:function(){return this.control.show(),this}},{key:"renderTo",value:function(t){return this.control.renderTo(t),this}},{key:"setStyles",value:function(t){return tinymce.DOM.setStyles(this.control.getEl(),t),this}},{key:"reposition",value:function(t){if(!t)return this;var e=window.pageXOffset||document.documentElement.scrollLeft,n=window.pageYOffset||document.documentElement.scrollTop,o=window.innerWidth,i=window.innerHeight,r=this.mceIframe?this.mceIframe.getBoundingClientRect():{top:0,right:o,bottom:i,left:0,width:o,height:i},l=this.control.getEl(),a=l.offsetWidth,c=l.offsetHeight,u=t.getBoundingClientRect(),s=(u.left+u.right)/2,d=c+8+5,f=this.mceToolbar?this.mceToolbar.getBoundingClientRect().bottom:0,h=this.mceStatusbar?i-this.mceStatusbar.getBoundingClientRect().top:0,m=Math.max(0,f,r.top),p=Math.max(0,h,i-r.bottom),g=u.top+r.top-m,b=i-r.top-u.bottom-p,w=i-m-p,y="",v=0,k=0;return g>=w||b>=w?this.hide():(this.bottom?b>=d?(y=" mce-arrow-up",v=u.bottom+r.top+n+10):g>=d&&(y=" mce-arrow-down",v=u.top+r.top+n-c-8):g>=d?(y=" mce-arrow-down",v=u.top+r.top+n-c-8):b>=d&&w/2>u.bottom+r.top-m&&(y=" mce-arrow-up",v=u.bottom+r.top+n+10),void 0===v&&(v=n+m+5),k=s-a/2+r.left+e,u.left<0||u.right>r.width?k=r.left+e+(r.width-a)/2:a>=o?(y+=" mce-arrow-full",k=0):k<0&&u.left+a>o||k+a>o&&u.right-a<0?k=(o-a)/2:k<r.left+e?(y+=" mce-arrow-left",k=u.left+r.left+e):k+a>r.width+r.left+e&&(y+=" mce-arrow-right",k=u.right-a+r.left+e),l.className=l.className.replace(/ ?mce-arrow-[\w]+/g,"")+y,this.setStyles({left:k,top:v}),this)}}]),t}();e.default=a,e.setupTinyMceInlineToolbar=r,e.shouldShowToolbar=i},935:function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(100),r=o(i),l=n(25),a=o(l),c=n(27),u=o(c),s=n(776),d={init:function(t){function e(){var e=tinymce.activeEditor.selection.getNode(),n=e.getAttribute("href");n&&t.execCommand(r.default.getEditorCommandFromUrl(n))}var n=r.default.getActions("sslink").map(function(e){return Object.assign({},e,{onclick:function(){return e.onclick(t)}})});t.addButton("sslink",{icon:"link",title:"Insert Link",type:"menubutton",menu:n}),t.addMenuItem("sslink",{icon:"link",text:"Insert Link",menu:n}),t.on("preinit",function(){(0,s.setupTinyMceInlineToolbar)(t,[{type:"button",onClick:e,text:"Edit link"},{type:"button",onClick:function(){return t.execCommand("unlink")},text:"Remove link"}])})}};u.default.entwine("ss",function(t){t(".insert-link__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){a.default.unmountComponentAtNode(this[0])},open:function(){this.renderModal(!0)},close:function(){this.setData({}),this.renderModal(!1)},renderModal:function(){},handleInsert:function(t){var e=this.buildAttributes(t);return this.insertLinkInEditor(e),this.close(),Promise.resolve()},buildAttributes:function(t){var e=t.Anchor&&t.Anchor.length?"#"+t.Anchor:"";return{href:""+t.Link+e,target:t.TargetBlank?"_blank":"",title:t.Description}},insertLinkInEditor:function(t){var e=this.getElement().getEditor();e.insertLink(t),e.addUndo(),e.repaint()},getOriginalAttributes:function(){var e=this.getElement().getEditor(),n=t(e.getSelectedNode()),o=(n.attr("href")||"").split("#");return{Link:o[0]||"",Anchor:o[1]||"",Description:n.attr("title"),TargetBlank:!!n.attr("target")}}})}),tinymce.PluginManager.add("sslink",function(t){return d.init(t)}),e.default=d}},[935]);
=======
<<<<<<< HEAD
webpackJsonp([3],{100:function(t,e){t.exports=TinyMCEActionRegistrar},775:function(t,e,n){"use strict";function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e,n){var o=Array.isArray(n)?n:[n||""];return Boolean(t&&o.map(function(t){return String(t)}).map(function(t){return t.toLowerCase()}).includes((t.tagName||"").toLowerCase())&&e)}function r(t,e){function n(){i(l,u,o)&&(r.hide(),clearTimeout(c),c=setTimeout(function(){r.show(),r.reposition(l)},300))}var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:["a"],r=new a(t,e),l=null,c=null,u=!1;return r.hide().renderTo(window.document.body),t.on("remove",function(){r.remove()}),t.on("focus",function(){u=!0}),t.on("blur hide",function(){r.hide(),u=!1}),t.on("nodechange",function(e){var n={element:e.element,parents:e.parents,collapsed:t.selection.isCollapsed()};l=n.selection||n.element,i(l,u,o)?(r.show(),r.reposition(l)):r.hide()}),window.addEventListener("scroll",function(e){e.target.contains(document.querySelector("#"+t.id))&&n()},!0),t.contentDocument.addEventListener("scroll",n),r}Object.defineProperty(e,"__esModule",{value:!0});var l=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),a=function(){function t(e,n){o(this,t),this.mceIframe=document.getElementById(e.id+"_ifr"),this.container=e.getContainer(),this.mceToolbar=null,this.mceStatusbar=null,this.container&&(this.mceToolbar=this.container.querySelector(".mce-toolbar-grp"),this.mceStatusbar=this.container.querySelector(".mce-statusbar")),this.control=tinymce.ui.Factory.create({type:"panel",classes:"inline-toolbar",layout:"stack",items:[{type:"toolbar",items:n}]})}return l(t,[{key:"remove",value:function(){return this.control.remove(),this}},{key:"hide",value:function(){return this.control.hide(),this}},{key:"show",value:function(){return this.control.show(),this}},{key:"renderTo",value:function(t){return this.control.renderTo(t),this}},{key:"setStyles",value:function(t){return tinymce.DOM.setStyles(this.control.getEl(),t),this}},{key:"reposition",value:function(t){if(!t)return this;var e=window.pageXOffset||document.documentElement.scrollLeft,n=window.pageYOffset||document.documentElement.scrollTop,o=window.innerWidth,i=window.innerHeight,r=this.mceIframe?this.mceIframe.getBoundingClientRect():{top:0,right:o,bottom:i,left:0,width:o,height:i},l=this.control.getEl(),a=l.offsetWidth,c=l.offsetHeight,u=t.getBoundingClientRect(),s=(u.left+u.right)/2,d=c+8+5,f=this.mceToolbar?this.mceToolbar.getBoundingClientRect().bottom:0,h=this.mceStatusbar?i-this.mceStatusbar.getBoundingClientRect().top:0,m=Math.max(0,f,r.top),p=Math.max(0,h,i-r.bottom),g=u.top+r.top-m,b=i-r.top-u.bottom-p,w=i-m-p,y="",v=0,k=0;return g>=w||b>=w?this.hide():(this.bottom?b>=d?(y=" mce-arrow-up",v=u.bottom+r.top+n+10):g>=d&&(y=" mce-arrow-down",v=u.top+r.top+n-c-8):g>=d?(y=" mce-arrow-down",v=u.top+r.top+n-c-8):b>=d&&w/2>u.bottom+r.top-m&&(y=" mce-arrow-up",v=u.bottom+r.top+n+10),void 0===v&&(v=n+m+5),k=s-a/2+r.left+e,u.left<0||u.right>r.width?k=r.left+e+(r.width-a)/2:a>=o?(y+=" mce-arrow-full",k=0):k<0&&u.left+a>o||k+a>o&&u.right-a<0?k=(o-a)/2:k<r.left+e?(y+=" mce-arrow-left",k=u.left+r.left+e):k+a>r.width+r.left+e&&(y+=" mce-arrow-right",k=u.right-a+r.left+e),l.className=l.className.replace(/ ?mce-arrow-[\w]+/g,"")+y,this.setStyles({left:k,top:v}),this)}}]),t}();e.default=a,e.setupTinyMceInlineToolbar=r,e.shouldShowToolbar=i},934:function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var i=n(100),r=o(i),l=n(25),a=o(l),c=n(27),u=o(c),s=n(775),d={init:function(t){function e(){var e=tinymce.activeEditor.selection.getNode(),n=e.getAttribute("href");n&&t.execCommand(r.default.getEditorCommandFromUrl(n))}var n=r.default.getActions("sslink").map(function(e){return Object.assign({},e,{onclick:function(){return e.onclick(t)}})});t.addButton("sslink",{icon:"link",title:"Insert Link",type:"menubutton",menu:n}),t.addMenuItem("sslink",{icon:"link",text:"Insert Link",menu:n}),t.on("preinit",function(){(0,s.setupTinyMceInlineToolbar)(t,[{type:"button",onClick:e,text:"Edit link"},{type:"button",onClick:function(){return t.execCommand("unlink")},text:"Remove link"}])})}};u.default.entwine("ss",function(t){t(".insert-link__dialog-wrapper").entwine({Element:null,Data:{},onunmatch:function(){this._clearModal()},_clearModal:function(){a.default.unmountComponentAtNode(this[0])},open:function(){this.renderModal(!0)},close:function(){this.setData({}),this.renderModal(!1)},renderModal:function(){},handleInsert:function(t){var e=this.buildAttributes(t);return this.insertLinkInEditor(e),this.close(),Promise.resolve()},buildAttributes:function(t){var e=t.Anchor&&t.Anchor.length?"#"+t.Anchor:"";return{href:""+t.Link+e,target:t.TargetBlank?"_blank":"",title:t.Description}},insertLinkInEditor:function(t){var e=this.getElement().getEditor();e.insertLink(t),e.addUndo(),e.repaint()},getOriginalAttributes:function(){var e=this.getElement().getEditor(),n=t(e.getSelectedNode()),o=(n.attr("href")||"").split("#");return{Link:o[0]||"",Anchor:o[1]||"",Description:n.attr("title"),TargetBlank:!!n.attr("target")}}})}),tinymce.PluginManager.add("sslink",function(t){return d.init(t)}),e.default=d}},[934]);
=======
webpackJsonp([3],{

/***/ 100:
/***/ (function(module, exports) {

module.exports = TinyMCEActionRegistrar;

/***/ }),

/***/ 769:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TinymceInlineToolbar = function () {
  function TinymceInlineToolbar(editor, buttons) {
    _classCallCheck(this, TinymceInlineToolbar);

    this.mceIframe = document.getElementById(editor.id + '_ifr');
    this.container = editor.getContainer();
    this.mceToolbar = null;
    this.mceStatusbar = null;

    if (this.container) {
      this.mceToolbar = this.container.querySelector('.mce-toolbar-grp');
      this.mceStatusbar = this.container.querySelector('.mce-statusbar');
    }

    this.control = tinymce.ui.Factory.create({
      type: 'panel',
      classes: 'inline-toolbar',
      layout: 'stack',
      items: [{
        type: 'toolbar',
        items: buttons
      }]
    });
  }

  _createClass(TinymceInlineToolbar, [{
    key: 'remove',
    value: function remove() {
      this.control.remove();
      return this;
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.control.hide();
      return this;
    }
  }, {
    key: 'show',
    value: function show() {
      this.control.show();
      return this;
    }
  }, {
    key: 'renderTo',
    value: function renderTo(dom) {
      this.control.renderTo(dom);
      return this;
    }
  }, {
    key: 'setStyles',
    value: function setStyles(styles) {
      tinymce.DOM.setStyles(this.control.getEl(), styles);
      return this;
    }
  }, {
    key: 'reposition',
    value: function reposition(currSelection) {
      if (!currSelection) {
        return this;
      }

      var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      var iframeRect = this.mceIframe ? this.mceIframe.getBoundingClientRect() : {
        top: 0,
        right: windowWidth,
        bottom: windowHeight,
        left: 0,
        width: windowWidth,
        height: windowHeight
      };
      var toolbarEl = this.control.getEl();
      var toolbarWidth = toolbarEl.offsetWidth;
      var toolbarHeight = toolbarEl.offsetHeight;
      var selection = currSelection.getBoundingClientRect();
      var selectionMiddle = (selection.left + selection.right) / 2;
      var buffer = 5;
      var margin = 8;
      var spaceNeeded = toolbarHeight + margin + buffer;
      var mceToolbarBottom = this.mceToolbar ? this.mceToolbar.getBoundingClientRect().bottom : 0;
      var mceStatusbarTop = this.mceStatusbar ? windowHeight - this.mceStatusbar.getBoundingClientRect().top : 0;
      var blockedTop = Math.max(0, mceToolbarBottom, iframeRect.top);
      var blockedBottom = Math.max(0, mceStatusbarTop, windowHeight - iframeRect.bottom);
      var spaceTop = selection.top + iframeRect.top - blockedTop;
      var spaceBottom = windowHeight - iframeRect.top - selection.bottom - blockedBottom;
      var editorHeight = windowHeight - blockedTop - blockedBottom;
      var topOffset = 10;
      var className = '';
      var top = 0;
      var left = 0;

      if (spaceTop >= editorHeight || spaceBottom >= editorHeight) {
        return this.hide();
      }

      if (this.bottom) {
        if (spaceBottom >= spaceNeeded) {
          className = ' mce-arrow-up';
          top = selection.bottom + iframeRect.top + scrollY + topOffset;
        } else if (spaceTop >= spaceNeeded) {
          className = ' mce-arrow-down';
          top = selection.top + iframeRect.top + scrollY - toolbarHeight - margin;
        }
      } else if (spaceTop >= spaceNeeded) {
        className = ' mce-arrow-down';
        top = selection.top + iframeRect.top + scrollY - toolbarHeight - margin;
      } else if (spaceBottom >= spaceNeeded && editorHeight / 2 > selection.bottom + iframeRect.top - blockedTop) {
        className = ' mce-arrow-up';
        top = selection.bottom + iframeRect.top + scrollY + topOffset;
      }

      if (typeof top === 'undefined') {
        top = scrollY + blockedTop + buffer;
      }

      left = selectionMiddle - toolbarWidth / 2 + iframeRect.left + scrollX;

      if (selection.left < 0 || selection.right > iframeRect.width) {
        left = iframeRect.left + scrollX + (iframeRect.width - toolbarWidth) / 2;
      } else if (toolbarWidth >= windowWidth) {
        className += ' mce-arrow-full';
        left = 0;
      } else if (left < 0 && selection.left + toolbarWidth > windowWidth || left + toolbarWidth > windowWidth && selection.right - toolbarWidth < 0) {
        left = (windowWidth - toolbarWidth) / 2;
      } else if (left < iframeRect.left + scrollX) {
        className += ' mce-arrow-left';
        left = selection.left + iframeRect.left + scrollX;
      } else if (left + toolbarWidth > iframeRect.width + iframeRect.left + scrollX) {
        className += ' mce-arrow-right';
        left = selection.right - toolbarWidth + iframeRect.left + scrollX;
      }

      toolbarEl.className = toolbarEl.className.replace(/ ?mce-arrow-[\w]+/g, '') + className;
      this.setStyles({ left: left, top: top });

      return this;
    }
  }]);

  return TinymceInlineToolbar;
}();

function shouldShowToolbar(selection, isEditorFocused, tagTypes) {
  var tags = Array.isArray(tagTypes) ? tagTypes : [tagTypes || ''];
  return Boolean(selection && tags.map(function (tag) {
    return String(tag);
  }).map(function (tag) {
    return tag.toLowerCase();
  }).includes((selection.tagName || '').toLowerCase()) && isEditorFocused);
}

function setupTinyMceInlineToolbar(editor, buttons) {
  var tagTypes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['a'];

  var toolbar = new TinymceInlineToolbar(editor, buttons);
  var currentSelection = null;
  var scrollTimeoutId = null;
  var focused = false;

  toolbar.hide().renderTo(window.document.body);

  editor.on('remove', function () {
    toolbar.remove();
  });

  editor.on('focus', function () {
    focused = true;
  });

  editor.on('blur hide', function () {
    toolbar.hide();
    focused = false;
  });

  editor.on('nodechange', function (event) {
    var args = {
      element: event.element,
      parents: event.parents,
      collapsed: editor.selection.isCollapsed()
    };

    currentSelection = args.selection || args.element;
    if (shouldShowToolbar(currentSelection, focused, tagTypes)) {
      toolbar.show();
      toolbar.reposition(currentSelection);
    } else {
      toolbar.hide();
    }
  });

  function handleScroll() {
    if (shouldShowToolbar(currentSelection, focused, tagTypes)) {
      toolbar.hide();

      clearTimeout(scrollTimeoutId);
      scrollTimeoutId = setTimeout(function () {
        toolbar.show();
        toolbar.reposition(currentSelection);
      }, 300);
    }
  }

  window.addEventListener('scroll', function (e) {
    if (e.target.contains(document.querySelector('#' + editor.id))) {
      handleScroll();
    }
  }, true);

  editor.contentDocument.addEventListener('scroll', handleScroll);

  return toolbar;
}

exports.default = TinymceInlineToolbar;
exports.setupTinyMceInlineToolbar = setupTinyMceInlineToolbar;
exports.shouldShowToolbar = shouldShowToolbar;

/***/ }),

/***/ 949:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TinyMCEActionRegistrar = __webpack_require__(100);

var _TinyMCEActionRegistrar2 = _interopRequireDefault(_TinyMCEActionRegistrar);

var _reactDom = __webpack_require__(26);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _jquery = __webpack_require__(27);

var _jquery2 = _interopRequireDefault(_jquery);

var _TinymceInlineToolbar = __webpack_require__(769);

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

    function openLinkDialog() {
      var node = tinymce.activeEditor.selection.getNode();
      var href = node.getAttribute('href');
      if (href) {
        editor.execCommand(_TinyMCEActionRegistrar2.default.getEditorCommandFromUrl(href));
      }
    }

    editor.on('preinit', function () {
      (0, _TinymceInlineToolbar.setupTinyMceInlineToolbar)(editor, [{ type: 'button', onClick: openLinkDialog, text: 'Edit link' }, { type: 'button', onClick: function onClick() {
          return editor.execCommand('unlink');
        }, text: 'Remove link' }]);
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

/***/ })

},[949]);
//# sourceMappingURL=TinyMCE_sslink.js.map
>>>>>>> Save button's visual (changed and unchanged states)
>>>>>>> Save button's visual (changed and unchanged states)
>>>>>>> Save button's visual (changed and unchanged states)
