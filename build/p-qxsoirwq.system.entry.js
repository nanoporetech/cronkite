var __awaiter=this&&this.__awaiter||function(e,t,r,n){function o(e){return e instanceof r?e:new r((function(t){t(e)}))}return new(r||(r=Promise))((function(r,i){function l(e){try{s(n.next(e))}catch(t){i(t)}}function a(e){try{s(n["throw"](e))}catch(t){i(t)}}function s(e){e.done?r(e.value):o(e.value).then(l,a)}s((n=n.apply(e,t||[])).next())}))};var __generator=this&&this.__generator||function(e,t){var r={label:0,sent:function(){if(i[0]&1)throw i[1];return i[1]},trys:[],ops:[]},n,o,i,l;return l={next:a(0),throw:a(1),return:a(2)},typeof Symbol==="function"&&(l[Symbol.iterator]=function(){return this}),l;function a(e){return function(t){return s([e,t])}}function s(l){if(n)throw new TypeError("Generator is already executing.");while(r)try{if(n=1,o&&(i=l[0]&2?o["return"]:l[0]?o["throw"]||((i=o["return"])&&i.call(o),0):o.next)&&!(i=i.call(o,l[1])).done)return i;if(o=0,i)l=[l[0]&2,i.value];switch(l[0]){case 0:case 1:i=l;break;case 4:r.label++;return{value:l[1],done:false};case 5:r.label++;o=l[1];l=[0];continue;case 7:l=r.ops.pop();r.trys.pop();continue;default:if(!(i=r.trys,i=i.length>0&&i[i.length-1])&&(l[0]===6||l[0]===2)){r=0;continue}if(l[0]===3&&(!i||l[1]>i[0]&&l[1]<i[3])){r.label=l[1];break}if(l[0]===6&&r.label<i[1]){r.label=i[1];i=l;break}if(i&&r.label<i[2]){r.label=i[2];r.ops.push(l);break}if(i[2])r.ops.pop();r.trys.pop();continue}l=t.call(e,r)}catch(a){l=[6,a];o=0}finally{n=i=0}if(l[0]&5)throw l[1];return{value:l[0]?l[1]:void 0,done:true}}};System.register(["./p-00ae5dc6.system.js","./p-81be880a.system.js"],(function(e){"use strict";var t,r,n,o,i,l,a,s;return{setters:[function(e){t=e.j;r=e.w;n=e.r;o=e.e;i=e.h;l=e.c;a=e.H},function(e){s=e.c}],execute:function(){var c="all 0.2s ease-in-out";var u=function(e){var t=document.querySelector(e+".ion-cloned-element");if(t!==null){return t}var r=document.createElement(e);r.classList.add("ion-cloned-element");r.style.setProperty("display","none");document.body.appendChild(r);return r};var f=function(e){if(!e){return}var t=e.querySelectorAll("ion-toolbar");return{el:e,toolbars:Array.from(t).map((function(e){var t=e.querySelector("ion-title");return{el:e,background:e.shadowRoot.querySelector(".toolbar-background"),ionTitleEl:t,innerTitleEl:t?t.shadowRoot.querySelector(".toolbar-title"):null,ionButtonsEl:Array.from(e.querySelectorAll("ion-buttons"))||[]}}))||[[]]}};var d=function(e,n){t((function(){var t=e.scrollTop;var o=s(1,1+-t/500,1.1);r((function(){y(n.toolbars,o)}))}))};var h=function(e,t){if(t===undefined){e.background.style.removeProperty("--opacity")}else{e.background.style.setProperty("--opacity",t.toString())}};var p=function(e,t){if(!e[0].isIntersecting){return}var r=(1-e[0].intersectionRatio)*100/75;h(t.toolbars[0],r===1?undefined:r)};var v=function(e,t,n){r((function(){p(e,t);var r=e[0];var o=r.intersectionRect;var i=o.width*o.height;var l=r.rootBounds.width*r.rootBounds.height;var a=i===0&&l===0;var s=Math.abs(o.left-r.boundingClientRect.left);var c=Math.abs(o.right-r.boundingClientRect.right);var u=i>0&&(s>=5||c>=5);if(a||u){return}if(r.isIntersecting){b(t,false);b(n)}else{var f=o.x===0&&o.y===0||o.width!==0&&o.height!==0;if(f){b(t);b(n,false);h(t.toolbars[0],1)}}}))};var b=function(e,t){if(t===void 0){t=true}r((function(){if(t){e.el.classList.remove("header-collapse-condense-inactive")}else{e.el.classList.add("header-collapse-condense-inactive")}}))};var y=function(e,t,r){if(e===void 0){e=[]}if(t===void 0){t=1}if(r===void 0){r=false}e.forEach((function(e){var n=e.ionTitleEl;var o=e.innerTitleEl;if(!n||n.size!=="large"){return}o.style.transformOrigin="left center";o.style.transition=r?c:"";o.style.transform="scale3d("+t+", "+t+", 1)"}))};var g=e("ion_header",function(){function e(e){n(this,e);this.collapsibleHeaderInitialized=false;this.translucent=false}e.prototype.componentDidLoad=function(){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(e){switch(e.label){case 0:return[4,this.checkCollapsibleHeader()];case 1:e.sent();return[2]}}))}))};e.prototype.componentDidUpdate=function(){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(e){switch(e.label){case 0:return[4,this.checkCollapsibleHeader()];case 1:e.sent();return[2]}}))}))};e.prototype.componentDidUnload=function(){this.destroyCollapsibleHeader()};e.prototype.checkCollapsibleHeader=function(){return __awaiter(this,void 0,void 0,(function(){var e,t,r,n;return __generator(this,(function(i){switch(i.label){case 0:e=this.collapse==="condense";t=e&&o(this)==="ios"?e:false;if(!(!t&&this.collapsibleHeaderInitialized))return[3,1];this.destroyCollapsibleHeader();return[3,3];case 1:if(!(t&&!this.collapsibleHeaderInitialized))return[3,3];r=this.el.closest("ion-app,ion-page,.ion-page,page-inner");n=r?r.querySelector("ion-content"):null;return[4,this.setupCollapsibleHeader(n,r)];case 2:i.sent();i.label=3;case 3:return[2]}}))}))};e.prototype.destroyCollapsibleHeader=function(){if(this.intersectionObserver){this.intersectionObserver.disconnect();this.intersectionObserver=undefined}if(this.scrollEl&&this.contentScrollCallback){this.scrollEl.removeEventListener("scroll",this.contentScrollCallback);this.contentScrollCallback=undefined}};e.prototype.setupCollapsibleHeader=function(e,n){return __awaiter(this,void 0,void 0,(function(){var o;var i=this;return __generator(this,(function(l){switch(l.label){case 0:if(!e||!n){console.error("ion-header requires a content to collapse, make sure there is an ion-content.");return[2]}o=this;return[4,e.getScrollElement()];case 1:o.scrollEl=l.sent();t((function(){var e=n.querySelectorAll("ion-header");var r=Array.from(e).find((function(e){return e.collapse!=="condense"}));if(!r||!i.scrollEl){return}var o=f(r);var l=f(i.el);if(!o||!l){return}b(o,false);t((function(){var e=o.el.clientHeight;var t=function(e){v(e,o,l)};i.intersectionObserver=new IntersectionObserver(t,{threshold:[.25,.3,.4,.5,.6,.7,.8,.9,1],rootMargin:"-"+e+"px 0px 0px 0px"});i.intersectionObserver.observe(l.toolbars[0].el)}));i.contentScrollCallback=function(){d(i.scrollEl,l)};i.scrollEl.addEventListener("scroll",i.contentScrollCallback)}));r((function(){u("ion-title");u("ion-back-button")}));this.collapsibleHeaderInitialized=true;return[2]}}))}))};e.prototype.render=function(){var e;var t=o(this);var r=this.collapse||"none";return i(a,{role:"banner",class:(e={},e[t]=true,e["header-"+t]=true,e["header-translucent"]=this.translucent,e["header-collapse-"+r]=true,e["header-translucent-"+t]=this.translucent,e)})};Object.defineProperty(e.prototype,"el",{get:function(){return l(this)},enumerable:true,configurable:true});Object.defineProperty(e,"style",{get:function(){return"ion-header{display:block;position:relative;-ms-flex-order:-1;order:-1;width:100%;z-index:10}ion-header ion-toolbar:first-child{padding-top:var(--ion-safe-area-top,0)}.header-md:after{left:0;bottom:-5px;background-position:left 0 top -2px;position:absolute;width:100%;height:5px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAHBAMAAADzDtBxAAAAD1BMVEUAAAAAAAAAAAAAAAAAAABPDueNAAAABXRSTlMUCS0gBIh/TXEAAAAaSURBVAjXYxCEAgY4UIICBmMogMsgFLtAAQCNSwXZKOdPxgAAAABJRU5ErkJggg==);background-repeat:repeat-x;content:\"\"}:host-context([dir=rtl]) .header-md:after,[dir=rtl] .header-md:after{left:unset;right:unset;right:0;background-position:right 0 top -2px}.header-collapse-condense,.header-md[no-border]:after{display:none}"},enumerable:true,configurable:true});return e}())}}}));