import globalEventBus from './globalEventBus.js';

export default class Transport {
    constructor() {
        this.bus = globalEventBus;
    }

    connectTo(url, notifyEvent) {
        return new Promise(resolve => {
            this.socket = new WebSocket(url);
            this.socket.onmessage = event => this.bus.emit(notifyEvent, JSON.parse(event.data));
            this.socket.onopen = () => resolve();
        });
    }

    send(message){
        this.socket.send(message);
    }

    get socket() {
        return this._socket;
    }

    set socket(sock) {
        this._socket = sock;
    }

}
