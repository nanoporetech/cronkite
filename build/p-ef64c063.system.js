System.register(["./p-00ae5dc6.system.js","./p-81be880a.system.js","./p-0f799344.system.js","./p-fc66302d.system.js"],(function(e){"use strict";var t,r;return{setters:[function(){},function(){},function(e){t=e.c},function(e){r=e.g}],execute:function(){var a=540;var o=function(e,t){if(t===void 0){t="top"}return"calc("+e+"px + var(--ion-safe-area-"+t+"))"};var n=function(e){return document.querySelector(e+".ion-cloned-element")};var l=e("shadow",(function(e){return e.shadowRoot||e}));var s=function(e){return e.querySelector("ion-header:not(.header-collapse-condense-inactive) ion-title[size=large]")};var i=function(e,t){var r=e.querySelectorAll("ion-buttons");for(var a=0,o=r;a<o.length;a++){var n=o[a];var l=n.closest("ion-header");var s=l&&!l.classList.contains("header-collapse-condense-inactive");var i=n.querySelector("ion-back-button");var f=n.classList.contains("buttons-collapse");if(i!==null&&(f&&s&&t||!f)){return i}}return null};var f=function(e,t,r,a,o){var n=i(a,r);var l=s(o);var f=s(a);var m=i(o,r);var v=n!==null&&l!==null&&!r;var y=f!==null&&m!==null&&r;if(v){d(e,t,r,l);c(e,t,r,n)}else if(y){d(e,t,r,f);c(e,t,r,m)}return{forward:v,backward:y}};var c=function(e,r,a,l){var s=l.getBoundingClientRect();var i=r?"calc(100% - "+(s.right+4)+"px)":s.left-4+"px";var f=r?"7px":"-7px";var c=r?"-4px":"4px";var d=r?"-4px":"4px";var m=r?"right":"left";var v=r?"left":"right";var y=[{offset:0,opacity:0,transform:"translate("+f+", "+o(8)+") scale(2.1)"},{offset:1,opacity:1,transform:"translate("+c+", "+o(-40)+") scale(1)"}];var u=[{offset:0,opacity:1,transform:"translate("+c+", "+o(-40)+") scale(1)"},{offset:.6,opacity:0},{offset:1,opacity:0,transform:"translate("+f+", "+o(8)+") scale(2.1)"}];var p=a?u:y;var b=[{offset:0,opacity:0,transform:"translate3d("+d+", "+o(-35)+", 0) scale(0.6)"},{offset:1,opacity:1,transform:"translate3d("+d+", "+o(-40)+", 0) scale(1)"}];var S=[{offset:0,opacity:1,transform:"translate("+d+", "+o(-40)+") scale(1)"},{offset:.2,opacity:0,transform:"translate("+d+", "+o(-35)+") scale(0.6)"},{offset:1,opacity:0,transform:"translate("+d+", "+o(-35)+") scale(0.6)"}];var T=a?S:b;var g=t();var h=t();var E=n("ion-back-button");var q=E.querySelector(".button-text");var A=E.querySelector("ion-icon");E.text=l.text;E.mode=l.mode;E.icon=l.icon;E.color=l.color;E.disabled=l.disabled;E.style.setProperty("display","block");E.style.setProperty("position","fixed");h.addElement(A);g.addElement(q);g.beforeStyles({"transform-origin":m+" center"}).beforeAddWrite((function(){l.style.setProperty("display","none");E.style.setProperty(m,i)})).afterAddWrite((function(){l.style.setProperty("display","");E.style.setProperty("display","none");E.style.removeProperty(m)})).keyframes(p);h.beforeStyles({"transform-origin":v+" center"}).keyframes(T);e.addAnimation([g,h])};var d=function(e,r,a,l){var s;var i=l.getBoundingClientRect();var f=r?"calc(100% - "+i.right+"px)":i.left+"px";var c=r?"-18px":"18px";var d=r?"right":"left";var m=[{offset:0,opacity:0,transform:"translate("+c+", "+o(0)+") scale(0.49)"},{offset:.1,opacity:0},{offset:1,opacity:1,transform:"translate(0, "+o(49)+") scale(1)"}];var v=[{offset:0,opacity:.99,transform:"translate(0, "+o(49)+") scale(1)"},{offset:.6,opacity:0},{offset:1,opacity:0,transform:"translate("+c+", "+o(0)+") scale(0.5)"}];var y=a?m:v;var u=n("ion-title");var p=t();u.innerText=l.innerText;u.size=l.size;u.color=l.color;p.addElement(u);p.beforeStyles((s={"transform-origin":d+" center",height:"46px",display:"",position:"relative"},s[d]=f,s)).beforeAddWrite((function(){l.style.setProperty("display","none")})).afterAddWrite((function(){l.style.setProperty("display","");u.style.setProperty("display","none")})).keyframes(y);e.addAnimation(p)};var m=e("iosTransitionAnimation",(function(e,o){try{var n="cubic-bezier(0.32,0.72,0,1)";var s="opacity";var i="transform";var c="0%";var d=.8;var m=e.ownerDocument.dir==="rtl";var v=m?"-99.5%":"99.5%";var y=m?"33%":"-33%";var u=o.enteringEl;var p=o.leavingEl;var b=o.direction==="back";var S=u.querySelector(":scope > ion-content");var T=u.querySelectorAll(":scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *");var g=u.querySelectorAll(":scope > ion-header > ion-toolbar");var h=t();var E=t();h.addElement(u).duration(o.duration||a).easing(o.easing||n).fill("both").beforeRemoveClass("ion-page-invisible");if(p&&e){var q=t();q.addElement(e);h.addAnimation(q)}if(!S&&g.length===0&&T.length===0){E.addElement(u.querySelector(":scope > .ion-page, :scope > ion-nav, :scope > ion-tabs"))}else{E.addElement(S);E.addElement(T)}h.addAnimation(E);if(b){E.beforeClearStyles([s]).fromTo("transform","translateX("+y+")","translateX("+c+")").fromTo(s,d,1)}else{E.beforeClearStyles([s]).fromTo("transform","translateX("+v+")","translateX("+c+")")}if(S){var A=l(S).querySelector(".transition-effect");if(A){var X=A.querySelector(".transition-cover");var x=A.querySelector(".transition-shadow");var C=t();var k=t();var P=t();C.addElement(A).beforeStyles({opacity:"1"}).afterStyles({opacity:""});k.addElement(X).beforeClearStyles([s]).fromTo(s,0,.1);P.addElement(x).beforeClearStyles([s]).fromTo(s,.03,.7);C.addAnimation([k,P]);E.addAnimation([C])}}var w=u.querySelector("ion-header.header-collapse-condense");var L=f(h,m,b,u,p),W=L.forward,j=L.backward;g.forEach((function(e){var r=t();r.addElement(e);h.addAnimation(r);var a=t();a.addElement(e.querySelector("ion-title"));var o=t();var n=Array.from(e.querySelectorAll("ion-buttons,[menuToggle]"));var i=e.closest("ion-header");var f=i&&i.classList.contains("header-collapse-condense-inactive");var d;if(b){d=n.filter((function(e){var t=e.classList.contains("buttons-collapse");return t&&!f||!t}))}else{d=n.filter((function(e){return!e.classList.contains("buttons-collapse")}))}o.addElement(d);var u=t();u.addElement(e.querySelectorAll(":scope > *:not(ion-title):not(ion-buttons):not([menuToggle])"));var p=t();p.addElement(l(e).querySelector(".toolbar-background"));var S=t();var T=e.querySelector("ion-back-button");if(T){S.addElement(T)}r.addAnimation([a,o,u,p,S]);o.fromTo(s,.01,1);u.fromTo(s,.01,1);if(b){if(!f){a.fromTo("transform","translateX("+y+")","translateX("+c+")").fromTo(s,.01,1)}u.fromTo("transform","translateX("+y+")","translateX("+c+")");S.fromTo(s,.01,1)}else{if(!w){a.fromTo("transform","translateX("+v+")","translateX("+c+")").fromTo(s,.01,1)}u.fromTo("transform","translateX("+v+")","translateX("+c+")");p.beforeClearStyles([s]).fromTo(s,.01,1);if(!W){S.fromTo(s,.01,1)}if(T&&!W){var g=t();g.addElement(l(T).querySelector(".button-text")).fromTo("transform",m?"translateX(-100px)":"translateX(100px)","translateX(0px)");r.addAnimation(g)}}}));if(p){var z=t();var R=p.querySelector(":scope > ion-content");z.addElement(R);z.addElement(p.querySelectorAll(":scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *"));h.addAnimation(z);if(b){z.beforeClearStyles([s]).fromTo("transform","translateX("+c+")",m?"translateX(-100%)":"translateX(100%)");var B=r(p);h.afterAddWrite((function(){if(h.getDirection()==="normal"){B.style.setProperty("display","none")}}))}else{z.fromTo("transform","translateX("+c+")","translateX("+y+")").fromTo(s,1,d)}if(R){var D=l(R).querySelector(".transition-effect");if(D){var F=D.querySelector(".transition-cover");var G=D.querySelector(".transition-shadow");var H=t();var I=t();var J=t();H.addElement(D).beforeStyles({opacity:"1"}).afterStyles({opacity:""});I.addElement(F).beforeClearStyles([s]).fromTo(s,.1,0);J.addElement(G).beforeClearStyles([s]).fromTo(s,.7,.03);H.addAnimation([I,J]);z.addAnimation([H])}}var K=p.querySelectorAll(":scope > ion-header > ion-toolbar");K.forEach((function(e){var r=t();r.addElement(e);var a=t();a.addElement(e.querySelector("ion-title"));var o=t();var n=e.querySelectorAll("ion-buttons,[menuToggle]");var f=e.closest("ion-header");var d=f&&f.classList.contains("header-collapse-condense-inactive");var v=Array.from(n).filter((function(e){var t=e.classList.contains("buttons-collapse");return t&&!d||!t}));o.addElement(v);var u=t();var p=e.querySelectorAll(":scope > *:not(ion-title):not(ion-buttons):not([menuToggle])");if(p.length>0){u.addElement(p)}var S=t();S.addElement(l(e).querySelector(".toolbar-background"));var T=t();var g=e.querySelector("ion-back-button");if(g){T.addElement(g)}r.addAnimation([a,o,u,T,S]);h.addAnimation(r);T.fromTo(s,.99,0);o.fromTo(s,.99,0);u.fromTo(s,.99,0);if(b){if(!d){a.fromTo("transform","translateX("+c+")",m?"translateX(-100%)":"translateX(100%)").fromTo(s,.99,0)}u.fromTo("transform","translateX("+c+")",m?"translateX(-100%)":"translateX(100%)");S.beforeClearStyles([s]).fromTo(s,1,.01);if(g&&!j){var E=t();E.addElement(l(g).querySelector(".button-text")).fromTo("transform","translateX("+c+")","translateX("+((m?-124:124)+"px")+")");r.addAnimation(E)}}else{if(!d){a.fromTo("transform","translateX("+c+")","translateX("+y+")").fromTo(s,.99,0).afterClearStyles([i,s])}u.fromTo("transform","translateX("+c+")","translateX("+y+")").afterClearStyles([i,s]);T.afterClearStyles([s]);a.afterClearStyles([s]);o.afterClearStyles([s])}}))}return h}catch(M){throw M}}))}}}));