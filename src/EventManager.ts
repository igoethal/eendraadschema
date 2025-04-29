/**
 * Manages the addition and removal of event listeners on HTML elements.
 */
export class EventManager {
    private listeners: { element: HTMLElement, type: string, listener: EventListenerOrEventListenerObject }[] = [];

    /**
     * Adds an event listener to a specified HTML element. If a listener of the same
     * type already exists on the element, it is removed before adding the new one.
     *
     * @param element - The HTML element to attach the event listener to.
     * @param type - The type of the event.
     * @param listener - The event listener function or object.
     */
    addEventListener(element: HTMLElement, type: string, listener: EventListenerOrEventListenerObject) {
        const existingListenerIndex = this.listeners.findIndex(l => l.element === element && l.type === type); 
        if (existingListenerIndex !== -1) {
             const existingListener = this.listeners[existingListenerIndex]; 
             element.removeEventListener(type, existingListener.listener); 
             this.listeners.splice(existingListenerIndex, 1); 
        } 

        this.listeners.push({ element, type, listener });
        element.addEventListener(type, listener);

        this.cleanup(); // Before we proceed, remove all listeners for elements that no longer exist
    }

    /**
     * Removes all event listeners managed by this EventManager instance.
     */
    removeAllEventListeners() {
        this.listeners.forEach(({ element, type, listener }) => {
            element.removeEventListener(type, listener);
        });
        this.listeners = [];
    }

    /**
     * Disposes of the EventManager by removing all event listeners.
     */
    dispose() {
        this.removeAllEventListeners();
    }

    /**
     * Removes all listeners for which the HTML element no longer exists.
     */
    cleanup() {
        this.listeners = this.listeners.filter(({ element, type, listener }) => {
            if (!document.contains(element)) {
                element.removeEventListener(type, listener);
                return false;
            }
            return true;
        });
    }
}
