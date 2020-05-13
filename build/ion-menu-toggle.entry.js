import { r as registerInstance, h, H as Host } from './index-c35d3352.js';
import { g as getIonMode } from './ionic-global-8c5abd90.js';
import './hardware-back-button-b3b61715.js';
import './helpers-2774d300.js';
import './animation-a5293c2f.js';
import { m as menuController } from './index-11123397.js';
import { u as updateVisibility } from './menu-toggle-util-2b7072d8.js';

const menuToggleCss = ":host(.menu-toggle-hidden){display:none}";

const MenuToggle = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.visible = false;
        /**
         * Automatically hides the content when the corresponding menu is not active.
         *
         * By default, it's `true`. Change it to `false` in order to
         * keep `ion-menu-toggle` always visible regardless the state of the menu.
         */
        this.autoHide = true;
        this.onClick = () => {
            return menuController.toggle(this.menu);
        };
    }
    connectedCallback() {
        this.visibilityChanged();
    }
    async visibilityChanged() {
        this.visible = await updateVisibility(this.menu);
    }
    render() {
        const mode = getIonMode(this);
        const hidden = this.autoHide && !this.visible;
        return (h(Host, { onClick: this.onClick, "aria-hidden": hidden ? 'true' : null, class: {
                [mode]: true,
                'menu-toggle-hidden': hidden,
            } }, h("slot", null)));
    }
};
MenuToggle.style = menuToggleCss;

export { MenuToggle as ion_menu_toggle };
