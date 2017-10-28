import Tower from './tower.js';

export default class OrangeTower extends Tower {
    constructor() {
        super('OrangeTower', 2, 15, 2, 25, {x: 0, y: 0}, 'otower.png');
    }

    static Create() {
        return new OrangeTower();
    }
}
