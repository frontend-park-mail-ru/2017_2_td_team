import Tower from './tower.js';

export default class OrangeTower extends Tower {

    constructor() {
        super('OrangeTower', 3, 10, 500, 35, {x: 0, y: 0}, 'otower.png');
    }

    static Create() {
        return new OrangeTower();
    }

    static get typeid() {
        return 103;
    }
}
