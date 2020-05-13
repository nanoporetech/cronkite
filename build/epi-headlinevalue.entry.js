import { r as registerInstance, h } from './index-c35d3352.js';

const epiHeadlinevalueCss = ".headline{display:flex;flex-flow:column nowrap;flex:1 1 auto;font-family:sans-serif;justify-content:center;padding:var(--epi-headlinevalue-padding, 1.5rem);width:min-content;max-width:46vw;text-align:center;box-sizing:border-box;}@media only screen and (min-width: 0) and (max-width: 736px) and (orientation: portrait){.headline{width:100%;max-width:80vw}}.headline .headline-label{font-size:var(--epi-headlinevalue-label-fontsize);color:#999;text-transform:uppercase;margin:0 0 0.2rem 0;letter-spacing:1px;font-weight:500;line-height:1.2;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}@media screen and (min-width: 25em){.headline .headline-label{font-size:calc(var(--epi-headlinevalue-label-fontsize) + (18 - 16) * (100vw - 400px) / (800 - 400))}}@media screen and (min-width: 25em){.headline .headline-label{font-size:calc(var(--epi-headlinevalue-label-fontsize) + (18 - 16) * (100vw - 400px) / (800 - 400))}}@media screen and (min-width: 50em){.headline .headline-label{font-size:calc(var(--epi-headlinevalue-label-fontsize) + (18 - 16) * (100vw - 400px) / (800 - 400))}}.headline .headline-value{font-size:var(--epi-headlinevalue-value-fontsize);margin:0 0 5px 0;color:#555;text-transform:uppercase;margin-bottom:0;letter-spacing:1px;font-weight:300;line-height:1.2;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}@media screen and (min-width: 25em){.headline .headline-value{font-size:calc(var(--epi-headlinevalue-value-fontsize) + (20 - 16) * (100vw - 400px) / (800 - 400))}}@media screen and (min-width: 25em){.headline .headline-value{font-size:calc(var(--epi-headlinevalue-value-fontsize) + (20 - 16) * (100vw - 400px) / (800 - 400))}}@media screen and (min-width: 50em){.headline .headline-value{font-size:calc(var(--epi-headlinevalue-value-fontsize) + (20 - 16) * (100vw - 400px) / (800 - 400))}}.headline .headline-value.case-sensitive{text-transform:none}";

const EpiHeadlinevalue = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        /**
         * The headline value case sensitivity
         */
        this.caseSensitive = false;
    }
    render() {
        return (this.value && (h("div", { class: "headline" }, this.label && h("span", { class: "headline-label" }, this.label), h("span", { class: `headline-value${this.caseSensitive ? ' case-sensitive' : ''}` }, this.value))));
    }
};
EpiHeadlinevalue.style = epiHeadlinevalueCss;

export { EpiHeadlinevalue as epi_headlinevalue };
