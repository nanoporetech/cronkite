import { g as getIonMode, c as config } from './ionic-global-8c5abd90.js';
import { OVERLAY_BACK_BUTTON_PRIORITY } from './hardware-back-button-b3b61715.js';

let lastId = 0;
const activeAnimations = new WeakMap();
const createController = (tagName) => {
    return {
        create(options) {
            return createOverlay(tagName, options);
        },
        dismiss(data, role, id) {
            return dismissOverlay(document, data, role, tagName, id);
        },
        async getTop() {
            return getOverlay(document, tagName);
        }
    };
};
const alertController = /*@__PURE__*/ createController('ion-alert');
const actionSheetController = /*@__PURE__*/ createController('ion-action-sheet');
const loadingController = /*@__PURE__*/ createController('ion-loading');
const modalController = /*@__PURE__*/ createController('ion-modal');
const pickerController = /*@__PURE__*/ createController('ion-picker');
const popoverController = /*@__PURE__*/ createController('ion-popover');
const toastController = /*@__PURE__*/ createController('ion-toast');
const prepareOverlay = (el) => {
    const doc = document;
    connectListeners(doc);
    const overlayIndex = lastId++;
    el.overlayIndex = overlayIndex;
    if (!el.hasAttribute('id')) {
        el.id = `ion-overlay-${overlayIndex}`;
    }
};
const createOverlay = (tagName, opts) => {
    return customElements.whenDefined(tagName).then(() => {
        const doc = document;
        const element = doc.createElement(tagName);
        element.classList.add('overlay-hidden');
        // convert the passed in overlay options into props
        // that get passed down into the new overlay
        Object.assign(element, opts);
        // append the overlay element to the document body
        getAppRoot(doc).appendChild(element);
        return element.componentOnReady();
    });
};
const connectListeners = (doc) => {
    if (lastId === 0) {
        lastId = 1;
        // trap focus inside overlays
        doc.addEventListener('focusin', ev => {
            const lastOverlay = getOverlay(doc);
            if (lastOverlay && lastOverlay.backdropDismiss && !isDescendant(lastOverlay, ev.target)) {
                const firstInput = lastOverlay.querySelector('input,button');
                if (firstInput) {
                    firstInput.focus();
                }
            }
        });
        // handle back-button click
        doc.addEventListener('ionBackButton', ev => {
            const lastOverlay = getOverlay(doc);
            if (lastOverlay && lastOverlay.backdropDismiss) {
                ev.detail.register(OVERLAY_BACK_BUTTON_PRIORITY, () => {
                    return lastOverlay.dismiss(undefined, BACKDROP);
                });
            }
        });
        // handle ESC to close overlay
        doc.addEventListener('keyup', ev => {
            if (ev.key === 'Escape') {
                const lastOverlay = getOverlay(doc);
                if (lastOverlay && lastOverlay.backdropDismiss) {
                    lastOverlay.dismiss(undefined, BACKDROP);
                }
            }
        });
    }
};
const dismissOverlay = (doc, data, role, overlayTag, id) => {
    const overlay = getOverlay(doc, overlayTag, id);
    if (!overlay) {
        return Promise.reject('overlay does not exist');
    }
    return overlay.dismiss(data, role);
};
const getOverlays = (doc, selector) => {
    if (selector === undefined) {
        selector = 'ion-alert,ion-action-sheet,ion-loading,ion-modal,ion-picker,ion-popover,ion-toast';
    }
    return Array.from(doc.querySelectorAll(selector))
        .filter(c => c.overlayIndex > 0);
};
const getOverlay = (doc, overlayTag, id) => {
    const overlays = getOverlays(doc, overlayTag);
    return (id === undefined)
        ? overlays[overlays.length - 1]
        : overlays.find(o => o.id === id);
};
const present = async (overlay, name, iosEnterAnimation, mdEnterAnimation, opts) => {
    if (overlay.presented) {
        return;
    }
    overlay.presented = true;
    overlay.willPresent.emit();
    const mode = getIonMode(overlay);
    // get the user's animation fn if one was provided
    const animationBuilder = (overlay.enterAnimation)
        ? overlay.enterAnimation
        : config.get(name, mode === 'ios' ? iosEnterAnimation : mdEnterAnimation);
    const completed = await overlayAnimation(overlay, animationBuilder, overlay.el, opts);
    if (completed) {
        overlay.didPresent.emit();
    }
    overlay.el.focus();
};
const dismiss = async (overlay, data, role, name, iosLeaveAnimation, mdLeaveAnimation, opts) => {
    if (!overlay.presented) {
        return false;
    }
    overlay.presented = false;
    try {
        // Overlay contents should not be clickable during dismiss
        overlay.el.style.setProperty('pointer-events', 'none');
        overlay.willDismiss.emit({ data, role });
        const mode = getIonMode(overlay);
        const animationBuilder = (overlay.leaveAnimation)
            ? overlay.leaveAnimation
            : config.get(name, mode === 'ios' ? iosLeaveAnimation : mdLeaveAnimation);
        // If dismissed via gesture, no need to play leaving animation again
        if (role !== 'gesture') {
            await overlayAnimation(overlay, animationBuilder, overlay.el, opts);
        }
        overlay.didDismiss.emit({ data, role });
        activeAnimations.delete(overlay);
    }
    catch (err) {
        console.error(err);
    }
    overlay.el.remove();
    return true;
};
const getAppRoot = (doc) => {
    return doc.querySelector('ion-app') || doc.body;
};
const overlayAnimation = async (overlay, animationBuilder, baseEl, opts) => {
    // Make overlay visible in case it's hidden
    baseEl.classList.remove('overlay-hidden');
    const aniRoot = baseEl.shadowRoot || overlay.el;
    const animation = animationBuilder(aniRoot, opts);
    if (!overlay.animated || !config.getBoolean('animated', true)) {
        animation.duration(0);
    }
    if (overlay.keyboardClose) {
        animation.beforeAddWrite(() => {
            const activeElement = baseEl.ownerDocument.activeElement;
            if (activeElement && activeElement.matches('input, ion-input, ion-textarea')) {
                activeElement.blur();
            }
        });
    }
    const activeAni = activeAnimations.get(overlay) || [];
    activeAnimations.set(overlay, [...activeAni, animation]);
    await animation.play();
    return true;
};
const eventMethod = (element, eventName) => {
    let resolve;
    const promise = new Promise(r => resolve = r);
    onceEvent(element, eventName, (event) => {
        resolve(event.detail);
    });
    return promise;
};
const onceEvent = (element, eventName, callback) => {
    const handler = (ev) => {
        element.removeEventListener(eventName, handler);
        callback(ev);
    };
    element.addEventListener(eventName, handler);
};
const isCancel = (role) => {
    return role === 'cancel' || role === BACKDROP;
};
const isDescendant = (parent, child) => {
    while (child) {
        if (child === parent) {
            return true;
        }
        child = child.parentElement;
    }
    return false;
};
const defaultGate = (h) => h();
const safeCall = (handler, arg) => {
    if (typeof handler === 'function') {
        const jmp = config.get('_zoneGate', defaultGate);
        return jmp(() => {
            try {
                return handler(arg);
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    return undefined;
};
const BACKDROP = 'backdrop';

export { BACKDROP as B, present as a, pickerController as b, activeAnimations as c, dismiss as d, eventMethod as e, popoverController as f, actionSheetController as g, alertController as h, isCancel as i, prepareOverlay as p, safeCall as s };
