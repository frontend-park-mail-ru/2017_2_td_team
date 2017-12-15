import Tower from './tower.js';

export default class RedTower extends Tower {
    constructor() {
        super('RedTower', 2, 40, 2000 ,60, {x: 0, y: 0}, 'redtower.png');
    }

    static Create() {
        return new RedTower();
    }

    static get typeid() {
        return 102;
    }

}
