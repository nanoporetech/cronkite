import { r as registerInstance, h } from './index-c35d3352.js';

const epiCheckmarkCss = "@keyframes scale{0%,100%{transform:none}50%{transform:scale3d(1.1, 1.1, 1)}}@keyframes fill{100%{box-shadow:inset 0 0 0 200px #53b8b1}}@keyframes fill-fail{100%{box-shadow:inset 0 0 0 200px #ed5565}}@keyframes stroke{100%{stroke-dashoffset:0}}@keyframes text{100%{opacity:1}}:host{background-color:var(--epi-checkmark-background-color, transparent);display:flex;flex:1;justify-content:center}:host .checkmark{display:flex;flex:1;flex-flow:column nowrap;align-items:center}:host .checkmark .message{color:#555555;font-family:\"Helvetica Neue\", Helvetica, HelveticaLTStd-Light, Arial, sans-serif, \"Open Sans\", Roboto;font-size:24px;font-weight:700;text-align:center;text-transform:uppercase;margin:0.5em 0}:host .checkmark .icon-container{display:inline-block;position:relative;opacity:0.8;width:100%;vertical-align:middle;border-radius:50%;overflow:hidden;box-shadow:inset 0 0 0 0 #53b8b1;animation:fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both}:host .checkmark .icon-container .svg-content{display:inline-block;position:absolute;top:0;left:0;stroke-width:2;stroke:#fff;stroke-miterlimit:10}:host .checkmark .icon-container .svg-content .checkmark__circle{stroke-dasharray:166;stroke-dashoffset:166;stroke-width:2;stroke-miterlimit:10;stroke:#53b8b1;fill:none;animation:stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards}:host .checkmark .icon-container .svg-content .checkmark__check{transform-origin:50% 50%;stroke-dasharray:48;stroke-dashoffset:48;animation:stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards}:host .checkmark .icon-container .svg-content .checkmark__text{font-size:40px;fill:#fff;stroke-width:0;font-family:serif;opacity:0;animation:text 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards}:host .checkmark.fail .icon-container{box-shadow:inset 0 0 0 0 #ed5565;animation:fill-fail 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both}:host .checkmark.fail .icon-container .svg-content .checkmark__circle{stroke:#ed5565}";

const EpiCheckmark = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * Switch the image from green tick (true) to red exclaimation (false)
         */
        this.fail = false;
        /**
         * Size (width = height) of the image in pixels up to a maximum of 200
         */
        this.size = 100;
    }
    render() {
        return (h("div", { class: `checkmark${this.fail ? ' fail' : ''}` }, h("div", { class: "icon-container", style: { width: `${this.size}px`, height: `${this.size}px`, maxWidth: '200px', maxHeight: '200px' } }, h("svg", { class: "svg-content", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 50 50", preserveAspectRatio: "xMinYMin meet" }, h("circle", { class: `checkmark__circle${this.fail ? ' fail' : ''}`, cx: "25", cy: "25", r: "24", fill: "none" }), (!this.fail && h("path", { class: "checkmark__check", fill: "none", d: "M14.1 27.2l7.1 7.2 16.7-16.8" })) || (h("text", { x: "18", y: "38", class: "checkmark__text" }, "!")))), this.message && h("div", { class: "message" }, this.message)));
    }
};
EpiCheckmark.style = epiCheckmarkCss;

export { EpiCheckmark as epi_checkmark };
