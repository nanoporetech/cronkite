import { r as registerInstance, h, H as Host } from './index-c35d3352.js';

const cronkStatsboxCss = "cronk-statsbox{display:flex;background-color:var(--cronk-color-medium-contrast, #eee);flex-direction:row;flex-wrap:wrap;justify-content:space-evenly}cronk-statsbox epi-headlinevalue{display:flex}cronk-statsbox epi-headlinevalue .headline{padding:0}";

const CronkStatsbox = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.statsList = [];
    }
    render() {
        if (!Array.isArray(this.statsList))
            return null;
        return (h(Host, { class: "stats-box" }, this.statsList.map(stat => (h("epi-headlinevalue", Object.assign({ key: stat.label }, stat))))));
    }
};
CronkStatsbox.style = cronkStatsboxCss;

export { CronkStatsbox as cronk_statsbox };
