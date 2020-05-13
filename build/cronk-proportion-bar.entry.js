import { r as registerInstance, h, H as Host } from './index-c35d3352.js';

const cronkProportionBarCss = ".proportion-bar{min-height:var(--proportion-bar-min-height, 100%);min-width:var(--proportion-bar-min-width, 100%);height:var(--proportion-bar-height, 100%);margin-top:var(--proportion-bar-margin-top, 0);margin-left:var(--proportion-bar-margin-left, 0);margin-bottom:var(--proportion-bar-margin-bottom, 0);margin-right:var(--proportion-bar-margin-right, 0);position:relative;background-color:var(--proportion-bar--background-color, var(--cronk-color-light, var(--ion-color-light, #eee)));flex:1 1 auto}.proportion-bar div{background-color:var(--proportion-bar-color, var(--ion-color-primary, var(--ion-color-base, #444)));height:100%}";

const CronkProportionBar = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.value = 0;
        this.color = 'primary';
    }
    render() {
        return (h(Host, { class: "proportion-bar" }, h("div", { class: `ion-color-${this.color}`, style: {
                display: 'block',
                height: '100%',
                width: `${this.value * 100}%`,
            } })));
    }
};
CronkProportionBar.style = cronkProportionBarCss;

export { CronkProportionBar as cronk_proportion_bar };
