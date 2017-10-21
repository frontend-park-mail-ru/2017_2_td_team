export class EventBus {

    constructor() {
        this._listeners = {};
    }

    register(event, listener) {
        this._listeners[event] = this._listeners[event] || [];
        this._listeners[event].push(listener);
        return () => this.unregister(event, listener);
    }

    emit(event, context) {
        if (this._listeners[event]) {
            this._listeners[event].forEach(listener => listener(event, context));
        }
    }

    unregister(event, listener) {

        if (this._listeners[event]) {
            this._listeners[event] = this._listeners[event].filter(elem => elem !== listener)
        }

    }
}
