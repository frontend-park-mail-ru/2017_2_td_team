import globalEventBus from '../../globalEventBus.js';

import Events from '../../../events.js';

export default class Strategy {
    constructor() {
        this.bus = globalEventBus;
        this.clenupScripts = [];
        this.gamectx = {
            players: [],
            wave: {

            },
            towers: [],
            shotEvents: [],
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
        const off = this.bus.register(event, method);
        this.clenupScripts.push(off);
    }

    destroy() {
        this.clenupScripts.forEach(off => off());
    }


}
