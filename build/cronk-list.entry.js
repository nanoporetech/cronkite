import { r as registerInstance, h } from './index-c35d3352.js';

const cronkListCss = "cronk-list{line-height:var(--cronk-list-line-height, 1.5)}cronk-list ul,cronk-list ol{list-style-type:none}cronk-list .unordered{list-style-type:disc}cronk-list .ordered{list-style-type:decimal}";

const CronkList = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.items = [];
        this.ordered = false;
        this.bullets = true;
        this.reverse = false;
    }
    render() {
        const ListType = this.ordered ? 'ol' : 'ul';
        if (!this.items.length)
            return;
        return (h(ListType, { class: {
                ordered: this.bullets && this.ordered,
                unordered: this.bullets && !this.ordered,
            } }, (this.reverse ? [...this.items].reverse() : this.items).map(item => {
            return h("li", { innerHTML: `${item}` });
        })));
    }
};
CronkList.style = cronkListCss;

export { CronkList as cronk_list };
