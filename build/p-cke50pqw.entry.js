import{r as t,e as o,h as s,H as e}from"./p-f24f087d.js";import{o as r,c as a}from"./p-f1a4df63.js";const n=class{constructor(o){t(this,o),this.routerDirection="forward",this.onClick=t=>{r(this.href,t,this.routerDirection)}}componentDidLoad(){console.warn("[DEPRECATED][ion-anchor] The <ion-anchor> component has been deprecated. Please use an <ion-router-link> if you are using a vanilla JS or Stencil project or an <a> with the Angular router.")}render(){const t=o(this),r={href:this.href,rel:this.rel};return s(e,{onClick:this.onClick,class:Object.assign(Object.assign({},a(this.color)),{[t]:!0,"ion-activatable":!0})},s("a",Object.assign({},r),s("slot",null)))}static get style(){return":host{--background:transparent;--color:var(--ion-color-primary,#3880ff);background:var(--background);color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}a{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit}"}};export{n as ion_anchor};