import GameManager from './gameManager.js';

export default class Game {
    constructor(element, strategy, users) {
        this.manager = new GameManager(element, strategy, users);
    }
    destroy() {
        this.manager.destroy();
        this.manager = null;
    }
}
