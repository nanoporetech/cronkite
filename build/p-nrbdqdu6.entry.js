import{r as i,d as t,e as n,h as s,c as e,H as a}from"./p-f24f087d.js";const o={xs:"(min-width: 0px)",sm:"(min-width: 576px)",md:"(min-width: 768px)",lg:"(min-width: 992px)",xl:"(min-width: 1200px)",never:""},p=class{constructor(n){i(this,n),this.visible=!1,this.disabled=!1,this.when=o.lg,this.ionSplitPaneVisible=t(this,"ionSplitPaneVisible",7)}visibleChanged(i){const t={visible:i,isPane:this.isPane.bind(this)};this.ionSplitPaneVisible.emit(t)}connectedCallback(){this.styleChildren(),this.updateState()}disconnectedCallback(){this.rmL&&(this.rmL(),this.rmL=void 0)}componentWillLoad(){void 0===this.contentId&&console.warn('[DEPRECATED][ion-split-pane] Using the [main] attribute is deprecated, please use the "contentId" property instead:\nBEFORE:\n  <ion-split-pane>\n    ...\n    <div main>...</div>\n  </ion-split-pane>\n\nAFTER:\n  <ion-split-pane contentId="main-content">\n    ...\n    <div id="main-content">...</div>\n  </ion-split-pane>\n')}updateState(){if(this.rmL&&(this.rmL(),this.rmL=void 0),this.disabled)return void(this.visible=!1);const i=this.when;if("boolean"==typeof i)return void(this.visible=i);const t=o[i]||i;if(0!==t.length){if(window.matchMedia){const i=i=>{this.visible=i.matches},n=window.matchMedia(t);n.addListener(i),this.rmL=()=>n.removeListener(i),this.visible=n.matches}}else this.visible=!1}isPane(i){return!!this.visible&&i.parentElement===this.el&&i.classList.contains("split-pane-side")}styleChildren(){const i=this.contentId,t=this.el.children,n=this.el.childElementCount;let s=!1;for(let e=0;e<n;e++){const n=t[e],a=void 0!==i?n.id===i:n.hasAttribute("main");if(a){if(s)return void console.warn("split pane cannot have more than one main node");s=!0}h(n,a)}s||console.warn("split pane does not have a specified main node")}render(){const i=n(this);return s(a,{class:{[i]:!0,[`split-pane-${i}`]:!0,"split-pane-visible":this.visible}})}get el(){return e(this)}static get watchers(){return{visible:["visibleChanged"],disabled:["updateState"],when:["updateState"]}}static get style(){return"ion-split-pane{left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:absolute;-ms-flex-direction:row;flex-direction:row;-ms-flex-wrap:nowrap;flex-wrap:nowrap;contain:strict}.split-pane-visible>.split-pane-main,.split-pane-visible>.split-pane-side{left:0;right:0;top:0;bottom:0;position:relative;-ms-flex:1;flex:1;-webkit-box-shadow:none!important;box-shadow:none!important;z-index:0}.split-pane-visible>.split-pane-side:not(ion-menu),.split-pane-visible>ion-menu.split-pane-side.menu-enabled{display:-ms-flexbox;display:flex;-ms-flex-negative:0;flex-shrink:0}.split-pane-side:not(ion-menu){display:none}.split-pane-visible>.split-pane-side{-ms-flex-order:-1;order:-1}.split-pane-visible>.split-pane-side[side=end]{-ms-flex-order:1;order:1}.split-pane-ios{--border:0.55px solid var(--ion-item-border-color,var(--ion-border-color,var(--ion-color-step-250,#c8c7cc)))}.split-pane-ios.split-pane-visible>.split-pane-side{min-width:270px;max-width:28%;border-right:var(--border);border-left:0}.split-pane-ios.split-pane-visible>.split-pane-side[side=end]{min-width:270px;max-width:28%;border-right:0;border-left:var(--border)}"}},h=(i,t)=>{let n,s;t?(n="split-pane-main",s="split-pane-side"):(n="split-pane-side",s="split-pane-main");const e=i.classList;e.add(n),e.remove(s)};export{p as ion_split_pane};