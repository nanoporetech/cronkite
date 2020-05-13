import { r as registerInstance, h, H as Host } from './index-c35d3352.js';
import { g as getIonMode } from './ionic-global-8c5abd90.js';
import { c as createColorClasses } from './theme-74c22054.js';

const noteIosCss = ":host{color:var(--color);font-family:var(--ion-font-family, inherit);box-sizing:border-box}:host(.ion-color){color:var(--ion-color-base)}:host{--color:var(--ion-color-step-350, #a6a6a6)}";

const noteMdCss = ":host{color:var(--color);font-family:var(--ion-font-family, inherit);box-sizing:border-box}:host(.ion-color){color:var(--ion-color-base)}:host{--color:var(--ion-color-step-600, #666666);font-size:14px}";

const Note = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
    }
    render() {
        const mode = getIonMode(this);
        return (h(Host, { class: Object.assign(Object.assign({}, createColorClasses(this.color)), { [mode]: true }) }, h("slot", null)));
    }
};
Note.style = {
    /*STENCIL:MODE:ios*/ ios: noteIosCss,
    /*STENCIL:MODE:md*/ md: noteMdCss
};

export { Note as ion_note };
