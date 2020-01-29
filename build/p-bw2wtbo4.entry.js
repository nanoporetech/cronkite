import{r as t,d as s,e as i,h,H as e,c as o}from"./p-f24f087d.js";import{c as r}from"./p-8e190213.js";import{b as a}from"./p-9df54b61.js";const c=class{constructor(i){t(this,i),this.optHeight=0,this.rotateFactor=0,this.scaleFactor=1,this.velocity=0,this.y=0,this.noAnimate=!0,this.ionPickerColChange=s(this,"ionPickerColChange",7)}colChanged(){this.refresh()}async connectedCallback(){let t=0,s=.81;"ios"===i(this)&&(t=-.46,s=1),this.rotateFactor=t,this.scaleFactor=s,this.gesture=(await __sc_import_cronkite("./p-316cddd3.js")).createGesture({el:this.el,gestureName:"picker-swipe",gesturePriority:100,threshold:0,onStart:t=>this.onStart(t),onMove:t=>this.onMove(t),onEnd:t=>this.onEnd(t)}),this.gesture.setDisabled(!1),this.tmrId=setTimeout(()=>{this.noAnimate=!1,this.refresh(!0)},250)}componentDidLoad(){const t=this.optsEl;t&&(this.optHeight=t.firstElementChild?t.firstElementChild.clientHeight:0),this.refresh()}disconnectedCallback(){cancelAnimationFrame(this.rafId),clearTimeout(this.tmrId),this.gesture&&(this.gesture.destroy(),this.gesture=void 0)}emitColChange(){this.ionPickerColChange.emit(this.col)}setSelected(t,s){const i=t>-1?-t*this.optHeight:0;this.velocity=0,cancelAnimationFrame(this.rafId),this.update(i,s,!0),this.emitColChange()}update(t,s,i){if(!this.optsEl)return;let h=0,e=0;const{col:o,rotateFactor:r}=this,c=o.selectedIndex=this.indexForY(-t),l=0===s?"":s+"ms",p=`scale(${this.scaleFactor})`,d=this.optsEl.children;for(let a=0;a<d.length;a++){const i=d[a],f=o.options[a],m=a*this.optHeight+t;let u="";if(0!==r){const t=m*r;Math.abs(t)<=90?(h=0,e=90,u=`rotateX(${t}deg) `):h=-9999}else e=0,h=m;const M=c===a;u+=`translate3d(0px,${h}px,${e}px) `,1===this.scaleFactor||M||(u+=p),this.noAnimate?(f.duration=0,i.style.transitionDuration=""):s!==f.duration&&(f.duration=s,i.style.transitionDuration=l),u!==f.transform&&(f.transform=u,i.style.transform=u),M!==f.selected&&(f.selected=M,M?i.classList.add(n):i.classList.remove(n))}this.col.prevSelected=c,i&&(this.y=t),this.lastIndex!==c&&(a(),this.lastIndex=c)}decelerate(){if(0!==this.velocity){this.velocity*=l,this.velocity=this.velocity>0?Math.max(this.velocity,1):Math.min(this.velocity,-1);let t=this.y+this.velocity;t>this.minY?(t=this.minY,this.velocity=0):t<this.maxY&&(t=this.maxY,this.velocity=0),this.update(t,0,!0),Math.round(t)%this.optHeight!=0||Math.abs(this.velocity)>1?this.rafId=requestAnimationFrame(()=>this.decelerate()):(this.velocity=0,this.emitColChange())}else if(this.y%this.optHeight!=0){const t=Math.abs(this.y%this.optHeight);this.velocity=t>this.optHeight/2?1:-1,this.decelerate()}}indexForY(t){return Math.min(Math.max(Math.abs(Math.round(t/this.optHeight)),0),this.col.options.length-1)}onStart(t){t.event.preventDefault(),t.event.stopPropagation(),cancelAnimationFrame(this.rafId);const s=this.col.options;let i=s.length-1,h=0;for(let e=0;e<s.length;e++)s[e].disabled||(i=Math.min(i,e),h=Math.max(h,e));this.minY=-i*this.optHeight,this.maxY=-h*this.optHeight}onMove(t){t.event.preventDefault(),t.event.stopPropagation();let s=this.y+t.deltaY;s>this.minY?(s=Math.pow(s,.8),this.bounceFrom=s):s<this.maxY?(s+=Math.pow(this.maxY-s,.9),this.bounceFrom=s):this.bounceFrom=0,this.update(s,0,!1)}onEnd(t){if(this.bounceFrom>0)return this.update(this.minY,100,!0),void this.emitColChange();if(this.bounceFrom<0)return this.update(this.maxY,100,!0),void this.emitColChange();if(this.velocity=r(-p,23*t.velocityY,p),0===this.velocity&&0===t.deltaY){const s=t.event.target.closest(".picker-opt");s&&s.hasAttribute("opt-index")&&this.setSelected(parseInt(s.getAttribute("opt-index"),10),d)}else this.y+=t.deltaY,this.decelerate()}refresh(t){let s=this.col.options.length-1,i=0;const h=this.col.options;for(let o=0;o<h.length;o++)h[o].disabled||(s=Math.min(s,o),i=Math.max(i,o));if(0!==this.velocity)return;const e=r(s,this.col.selectedIndex||0,i);if(this.col.prevSelected!==e||t){const t=e*this.optHeight*-1;this.velocity=0,this.update(t,d,!0)}}render(){const t=this.col,s=i(this);return h(e,{class:{[s]:!0,"picker-col":!0,"picker-opts-left":"left"===this.col.align,"picker-opts-right":"right"===this.col.align},style:{"max-width":this.col.columnWidth}},t.prefix&&h("div",{class:"picker-prefix",style:{width:t.prefixWidth}},t.prefix),h("div",{class:"picker-opts",style:{maxWidth:t.optionsWidth},ref:t=>this.optsEl=t},t.options.map((t,s)=>h("button",{type:"button",class:{"picker-opt":!0,"picker-opt-disabled":!!t.disabled},"opt-index":s},t.text))),t.suffix&&h("div",{class:"picker-suffix",style:{width:t.suffixWidth}},t.suffix))}get el(){return o(this)}static get watchers(){return{col:["colChanged"]}}static get style(){return".picker-col{display:-ms-flexbox;display:flex;position:relative;-ms-flex:1;flex:1;-ms-flex-pack:center;justify-content:center;height:100%;-webkit-box-sizing:content-box;box-sizing:content-box;contain:content}.picker-opts{position:relative;-ms-flex:1;flex:1;max-width:100%}.picker-opt{left:0;top:0;display:block;position:absolute;width:100%;border:0;text-align:center;text-overflow:ellipsis;white-space:nowrap;contain:strict;overflow:hidden;will-change:transform}:host-context([dir=rtl]) .picker-opt,[dir=rtl] .picker-opt{left:unset;right:unset;right:0}.picker-opt.picker-opt-disabled{pointer-events:none}.picker-opt-disabled{opacity:0}.picker-opts-left{-ms-flex-pack:start;justify-content:flex-start}.picker-opts-right{-ms-flex-pack:end;justify-content:flex-end}.picker-opt:active,.picker-opt:focus{outline:none}.picker-prefix{text-align:end}.picker-prefix,.picker-suffix{position:relative;-ms-flex:1;flex:1;white-space:nowrap}.picker-suffix{text-align:start}.picker-col{padding-left:8px;padding-right:8px;padding-top:0;padding-bottom:0;-webkit-transform-style:preserve-3d;transform-style:preserve-3d}\@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.picker-col{padding-left:unset;padding-right:unset;-webkit-padding-start:8px;padding-inline-start:8px;-webkit-padding-end:8px;padding-inline-end:8px}}.picker-opts,.picker-prefix,.picker-suffix{top:77px;-webkit-transform-style:preserve-3d;transform-style:preserve-3d;color:inherit;font-size:22px;line-height:42px;pointer-events:none}.picker-opt{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;height:43px;-webkit-transition-timing-function:ease-out;transition-timing-function:ease-out;background:transparent;color:inherit;font-size:22px;line-height:42px;-webkit-backface-visibility:hidden;backface-visibility:hidden;pointer-events:auto}.picker-opt.picker-opt-selected,.picker-prefix,.picker-suffix{color:var(--ion-color-primary,#3880ff)}"}},n="picker-opt-selected",l=.97,p=90,d=150;export{c as ion_picker_column};