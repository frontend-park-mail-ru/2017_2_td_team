import GameManager from './gameManager.js';
import globalEventBus from '../globalEventBus.js';

export default class Game {
    constructor(element, strategy, users) {
        this.manager = new GameManager(element, strategy, users);
        this.bus = globalEventBus;
    }

    destroy() {
        this.manager.destroy();
        this.manager = null;
    }

}
