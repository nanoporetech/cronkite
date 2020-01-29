var __awaiter=this&&this.__awaiter||function(t,e,n,r){function o(t){return t instanceof n?t:new n((function(e){e(t)}))}return new(n||(n=Promise))((function(n,u){function i(t){try{c(r.next(t))}catch(e){u(e)}}function a(t){try{c(r["throw"](t))}catch(e){u(e)}}function c(t){t.done?n(t.value):o(t.value).then(i,a)}c((r=r.apply(t,e||[])).next())}))};var __generator=this&&this.__generator||function(t,e){var n={label:0,sent:function(){if(u[0]&1)throw u[1];return u[1]},trys:[],ops:[]},r,o,u,i;return i={next:a(0),throw:a(1),return:a(2)},typeof Symbol==="function"&&(i[Symbol.iterator]=function(){return this}),i;function a(t){return function(e){return c([t,e])}}function c(i){if(r)throw new TypeError("Generator is already executing.");while(n)try{if(r=1,o&&(u=i[0]&2?o["return"]:i[0]?o["throw"]||((u=o["return"])&&u.call(o),0):o.next)&&!(u=u.call(o,i[1])).done)return u;if(o=0,u)i=[i[0]&2,u.value];switch(i[0]){case 0:case 1:u=i;break;case 4:n.label++;return{value:i[1],done:false};case 5:n.label++;o=i[1];i=[0];continue;case 7:i=n.ops.pop();n.trys.pop();continue;default:if(!(u=n.trys,u=u.length>0&&u[u.length-1])&&(i[0]===6||i[0]===2)){n=0;continue}if(i[0]===3&&(!u||i[1]>u[0]&&i[1]<u[3])){n.label=i[1];break}if(i[0]===6&&n.label<u[1]){n.label=u[1];u=i;break}if(u&&n.label<u[2]){n.label=u[2];n.ops.push(i);break}if(u[2])n.ops.pop();n.trys.pop();continue}i=e.call(t,n)}catch(a){i=[6,a];o=0}finally{r=u=0}if(i[0]&5)throw i[1];return{value:i[0]?i[1]:void 0,done:true}}};System.register(["./p-00ae5dc6.system.js","./p-2294249a.system.js"],(function(t){"use strict";var e,n,r,o,u,i,a,c;return{setters:[function(t){e=t.r;n=t.e;r=t.k;o=t.h;u=t.H;i=t.c},function(t){a=t.o;c=t.c}],execute:function(){var s=t("ion_back_button",function(){function t(t){var r=this;e(this,t);this.mode=n(this);this.disabled=false;this.type="button";this.onClick=function(t){return __awaiter(r,void 0,void 0,(function(){var e,n;return __generator(this,(function(r){switch(r.label){case 0:e=this.el.closest("ion-nav");t.preventDefault();n=e;if(!n)return[3,2];return[4,e.canGoBack()];case 1:n=r.sent();r.label=2;case 2:if(n){return[2,e.pop({skipIfBusy:true})]}return[2,a(this.defaultHref,t,"back")]}}))}))}}Object.defineProperty(t.prototype,"backButtonIcon",{get:function(){return this.icon!=null?this.icon:r.get("backButtonIcon","arrow-back")},enumerable:true,configurable:true});Object.defineProperty(t.prototype,"backButtonText",{get:function(){var t=this.mode==="ios"?"Back":null;return this.text!=null?this.text:r.get("backButtonText",t)},enumerable:true,configurable:true});Object.defineProperty(t.prototype,"hasIconOnly",{get:function(){return this.backButtonIcon&&!this.backButtonText},enumerable:true,configurable:true});Object.defineProperty(t.prototype,"rippleType",{get:function(){if(this.hasIconOnly){return"unbounded"}return"bounded"},enumerable:true,configurable:true});t.prototype.render=function(){var t;var e=this,n=e.color,r=e.defaultHref,i=e.disabled,a=e.type,s=e.mode,l=e.hasIconOnly,f=e.backButtonIcon,b=e.backButtonText;var p=r!==undefined;return o(u,{onClick:this.onClick,class:Object.assign(Object.assign({},c(n)),(t={},t[s]=true,t["button"]=true,t["back-button-disabled"]=i,t["back-button-has-icon-only"]=l,t["ion-activatable"]=true,t["ion-focusable"]=true,t["show-back-button"]=p,t))},o("button",{type:a,disabled:i,class:"button-native"},o("span",{class:"button-inner"},f&&o("ion-icon",{icon:f,lazy:false}),b&&o("span",{class:"button-text"},b)),s==="md"&&o("ion-ripple-effect",{type:this.rippleType})))};Object.defineProperty(t.prototype,"el",{get:function(){return i(this)},enumerable:true,configurable:true});Object.defineProperty(t,"style",{get:function(){return".sc-ion-back-button-ios-h{--background:transparent;--color-focused:var(--color);--color-hover:var(--color);--icon-margin-top:0;--icon-margin-bottom:0;--icon-padding-top:0;--icon-padding-end:0;--icon-padding-bottom:0;--icon-padding-start:0;--margin-top:0;--margin-end:0;--margin-bottom:0;--margin-start:0;--min-width:auto;--min-height:auto;--padding-top:0;--padding-end:0;--padding-bottom:0;--padding-start:0;--opacity:1;--ripple-color:currentColor;--transition:background-color,opacity 100ms linear;display:none;min-width:var(--min-width);min-height:var(--min-height);color:var(--color);font-family:var(--ion-font-family,inherit);text-align:center;text-decoration:none;text-overflow:ellipsis;text-transform:none;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-font-kerning:none;font-kerning:none}.ion-color.sc-ion-back-button-ios-h .button-native.sc-ion-back-button-ios{color:var(--ion-color-base)}.show-back-button.sc-ion-back-button-ios-h, .can-go-back.sc-ion-back-button-ios-h > ion-header.sc-ion-back-button-ios, .can-go-back > ion-header .sc-ion-back-button-ios-h{display:block}.back-button-disabled.sc-ion-back-button-ios-h{cursor:default;opacity:.5;pointer-events:none}.button-native.sc-ion-back-button-ios{border-radius:var(--border-radius);-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;margin-left:var(--margin-start);margin-right:var(--margin-end);margin-top:var(--margin-top);margin-bottom:var(--margin-bottom);padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;display:block;position:relative;width:100%;height:100%;min-height:inherit;-webkit-transition:var(--transition);transition:var(--transition);border:0;outline:none;background:var(--background);line-height:1;cursor:pointer;opacity:var(--opacity);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:0;-webkit-appearance:none;-moz-appearance:none;appearance:none}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.button-native.sc-ion-back-button-ios{margin-left:unset;margin-right:unset;-webkit-margin-start:var(--margin-start);margin-inline-start:var(--margin-start);-webkit-margin-end:var(--margin-end);margin-inline-end:var(--margin-end);padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}.button-inner.sc-ion-back-button-ios{display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%}ion-icon.sc-ion-back-button-ios{padding-left:var(--icon-padding-start);padding-right:var(--icon-padding-end);padding-top:var(--icon-padding-top);padding-bottom:var(--icon-padding-bottom);margin-left:var(--icon-margin-start);margin-right:var(--icon-margin-end);margin-top:var(--icon-margin-top);margin-bottom:var(--icon-margin-bottom);display:inherit;font-size:var(--icon-font-size);font-weight:var(--icon-font-weight);pointer-events:none}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){ion-icon.sc-ion-back-button-ios{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--icon-padding-start);padding-inline-start:var(--icon-padding-start);-webkit-padding-end:var(--icon-padding-end);padding-inline-end:var(--icon-padding-end);margin-left:unset;margin-right:unset;-webkit-margin-start:var(--icon-margin-start);margin-inline-start:var(--icon-margin-start);-webkit-margin-end:var(--icon-margin-end);margin-inline-end:var(--icon-margin-end)}}\@media (any-hover:hover){.sc-ion-back-button-ios-h:hover .button-native.sc-ion-back-button-ios{background:var(--background-hover);color:var(--color-hover)}}.ion-focused.sc-ion-back-button-ios-h .button-native.sc-ion-back-button-ios{background:var(--background-focused);color:var(--color-focused)}\@media (any-hover:hover){.ion-color.sc-ion-back-button-ios-h:hover .button-native.sc-ion-back-button-ios{color:var(--ion-color-base)}}.ion-color.ion-focused.sc-ion-back-button-ios-h .button-native.sc-ion-back-button-ios{color:var(--ion-color-base)}ion-toolbar.sc-ion-back-button-ios-h:not(.ion-color):not(.ion-color), ion-toolbar:not(.ion-color) .sc-ion-back-button-ios-h:not(.ion-color){color:var(--ion-toolbar-color,var(--color))}.sc-ion-back-button-ios-h{--background-focused:rgba(var(--ion-color-primary-rgb,56,128,255),0.1);--border-radius:4px;--color:var(--ion-color-primary,#3880ff);--icon-margin-end:-5px;--icon-margin-start:-4px;--icon-font-size:1.85em;--min-height:32px;font-size:17px}.button-native.sc-ion-back-button-ios{-webkit-transform:translateZ(0);transform:translateZ(0);overflow:visible;z-index:99}.activated.sc-ion-back-button-ios-h .button-native.sc-ion-back-button-ios{opacity:.4}\@media (any-hover:hover){.sc-ion-back-button-ios-h:hover{--opacity:.6}}.ion-color.ion-focused.sc-ion-back-button-ios-h .button-native.sc-ion-back-button-ios{background:rgba(var(--ion-color-base-rgb),.1)}"},enumerable:true,configurable:true});return t}())}}}));