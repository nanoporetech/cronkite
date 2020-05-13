import { r as registerInstance, d as createEvent, h, H as Host, c as getElement } from './index-c35d3352.js';
import { g as getIonMode } from './ionic-global-8c5abd90.js';

const RadioGroup = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.inputId = `ion-rg-${radioGroupIds++}`;
        this.labelId = `${this.inputId}-lbl`;
        /**
         * If `true`, the radios can be deselected.
         */
        this.allowEmptySelection = false;
        /**
         * The name of the control, which is submitted with the form data.
         */
        this.name = this.inputId;
        this.onClick = (ev) => {
            const selectedRadio = ev.target && ev.target.closest('ion-radio');
            if (selectedRadio) {
                const currentValue = this.value;
                const newValue = selectedRadio.value;
                if (newValue !== currentValue) {
                    this.value = newValue;
                }
                else if (this.allowEmptySelection) {
                    this.value = undefined;
                }
            }
        };
        this.ionChange = createEvent(this, "ionChange", 7);
    }
    valueChanged(value) {
        this.ionChange.emit({ value });
    }
    async connectedCallback() {
        // Get the list header if it exists and set the id
        // this is used to set aria-labelledby
        const el = this.el;
        const header = el.querySelector('ion-list-header') || el.querySelector('ion-item-divider');
        if (header) {
            const label = header.querySelector('ion-label');
            if (label) {
                this.labelId = label.id = this.name + '-lbl';
            }
        }
    }
    render() {
        return (h(Host, { role: "radiogroup", "aria-labelledby": this.labelId, onClick: this.onClick, class: getIonMode(this) }));
    }
    get el() { return getElement(this); }
    static get watchers() { return {
        "value": ["valueChanged"]
    }; }
};
let radioGroupIds = 0;

export { RadioGroup as ion_radio_group };
