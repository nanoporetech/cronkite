import { r as registerInstance, h, H as Host } from './index-c35d3352.js';

const cronkFunnelCss = ".summary-funnel{display:grid;grid-gap:0.5rem 0.5rem}.summary-funnel .summary-funnel-row{display:grid;grid-auto-flow:column;grid-template-columns:repeat(auto-fit, minmax(0, 1fr));grid-column-gap:1%;align-items:center}.summary-funnel .summary-funnel-row .proportion-label{display:flex;flex:4 2 auto;flex-wrap:nowrap;align-items:center}.summary-funnel .summary-funnel-row .proportion-label .stats{display:flex;flex-direction:column;align-items:flex-end;text-align:right;z-index:1;margin-right:5%;flex:2}.summary-funnel .summary-funnel-row .proportion-label span.counts{font-weight:bold;white-space:nowrap}.summary-funnel .summary-funnel-row .proportion-label span.percent{color:var(--cronk-color-medium);font-size:100%;font-family:monospace;white-space:nowrap}.summary-funnel .summary-funnel-row .proportion-label span.label{text-transform:uppercase;min-width:50%;display:inline-block;text-align:left;flex:5}";

const CronkFunnel = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.statsList = [];
        this.hideLabel = false;
        this.hideStats = false;
        this.hideCount = false;
        this.hidePercent = false;
    }
    statsListValidator(newStatsList) {
        const isValid = newStatsList.length === 0 || newStatsList.every(member => !!member.label && !!member.count);
        if (!isValid) {
            throw new Error('Error: @Prop() statsList - property does not contain valid members');
        }
    }
    render() {
        if (!Array.isArray(this.statsList) || !this.statsList.length)
            return null;
        let total = 0;
        const members = {};
        this.statsList.forEach(member => {
            if (member.label in members) {
                members[member.label].count += member.count || 0;
            }
            else {
                members[member.label] = member;
            }
            total += member.count || 0;
        });
        const sortedMembers = Object.values(members).sort((a, b) => b.count - a.count);
        return (h(Host, { class: "summary-funnel" }, sortedMembers.map(member => {
            return (h("div", { key: member.label, class: "summary-funnel-row" }, h("cronk-proportion-bar", { value: member.count / total, color: "primary" }), ((!this.hideStats || !this.hideLabel) && (h("div", { class: "proportion-label" }, !this.hideStats && (h("div", { class: "stats" }, !this.hideCount && h("span", { class: "counts" }, member.count.toLocaleString()), !this.hidePercent && (h("span", { class: "percent" }, `${((member.count / total) * 100).toFixed(2)}%`)))), !this.hideLabel && h("span", { class: "label" }, member.label)))) ||
                null));
        })));
    }
    static get watchers() { return {
        "statsList": ["statsListValidator"]
    }; }
};
CronkFunnel.style = cronkFunnelCss;

export { CronkFunnel as cronk_funnel };
