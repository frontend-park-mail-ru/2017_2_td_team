import {globalEventBus} from '../../globalEventBus.js';

import {Events} from '../../../events.js';

export default class Strategy {
    constructor() {
        this.transport = globalEventBus;
        this._registered = [];
        this.gamectx = {
            players: [],
            wave: {
                number: 0
            },
            monsters: new Map(),
            passed: [],
            towers: [],
            events: [],
        };
        this.subscribe(Events.NEW_GAME, (event, payload) => this.onNewGame(payload));
        this.subscribe(Events.NEW_TOWER, (event, payload) => this.onNewTower(payload));
    }

    onNewGame(payload) {
        throw Error('Not implemented, called with ', payload);
    }

    onNewTower(payload) {
        throw Error('Not implemented, called with ', payload);
    }

    subscribe(event, method) {
        const off = this.transport.register(event, method);
        this._registered.push(off);
    }

    destroy() {
        this._registered.forEach(off => off());
    }


}
