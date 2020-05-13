import { r as registerInstance, h, H as Host, c as getElement } from './index-c35d3352.js';
import { c as config, g as getIonMode } from './ionic-global-8c5abd90.js';
import { h as hostContext } from './theme-74c22054.js';

const skeletonTextCss = ":host{--background:rgba(var(--background-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.065);border-radius:var(--border-radius, inherit);display:block;width:100%;height:inherit;margin-top:4px;margin-bottom:4px;background:var(--background);line-height:10px;user-select:none;pointer-events:none}span{display:inline-block}:host(.in-media){margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;height:100%}:host(.skeleton-text-animated){position:relative;background:linear-gradient(to right, rgba(var(--background-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.065) 8%, rgba(var(--background-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.135) 18%, rgba(var(--background-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.065) 33%);background-size:800px 104px;animation-duration:1s;animation-fill-mode:forwards;animation-iteration-count:infinite;animation-name:shimmer;animation-timing-function:linear}@keyframes shimmer{0%{background-position:-468px 0}100%{background-position:468px 0}}";

const SkeletonText = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * If `true`, the skeleton text will animate.
         */
        this.animated = false;
    }
    render() {
        const animated = this.animated && config.getBoolean('animated', true);
        const inMedia = hostContext('ion-avatar', this.el) || hostContext('ion-thumbnail', this.el);
        const mode = getIonMode(this);
        return (h(Host, { class: {
                [mode]: true,
                'skeleton-text-animated': animated,
                'in-media': inMedia
            } }, h("span", null, "\u00A0")));
    }
    get el() { return getElement(this); }
};
SkeletonText.style = skeletonTextCss;

export { SkeletonText as ion_skeleton_text };
