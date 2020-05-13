const startHardwareBackButton = () => {
    const doc = document;
    let busy = false;
    doc.addEventListener('backbutton', () => {
        if (busy) {
            return;
        }
        let index = 0;
        let handlers = [];
        const ev = new CustomEvent('ionBackButton', {
            bubbles: false,
            detail: {
                register(priority, handler) {
                    handlers.push({ priority, handler, id: index++ });
                }
            }
        });
        doc.dispatchEvent(ev);
        const executeAction = async (handlerRegister) => {
            try {
                if (handlerRegister && handlerRegister.handler) {
                    const result = handlerRegister.handler(processHandlers);
                    if (result != null) {
                        await result;
                    }
                }
            }
            catch (e) {
                console.error(e);
            }
        };
        const processHandlers = () => {
            if (handlers.length > 0) {
                let selectedHandler = {
                    priority: Number.MIN_SAFE_INTEGER,
                    handler: () => undefined,
                    id: -1
                };
                handlers.forEach(handler => {
                    if (handler.priority >= selectedHandler.priority) {
                        selectedHandler = handler;
                    }
                });
                busy = true;
                handlers = handlers.filter(handler => handler.id !== selectedHandler.id);
                executeAction(selectedHandler).then(() => busy = false);
            }
        };
        processHandlers();
    });
};
const OVERLAY_BACK_BUTTON_PRIORITY = 100;
const MENU_BACK_BUTTON_PRIORITY = 99; // 1 less than overlay priority since menu is displayed behind overlays

export { MENU_BACK_BUTTON_PRIORITY, OVERLAY_BACK_BUTTON_PRIORITY, startHardwareBackButton };
