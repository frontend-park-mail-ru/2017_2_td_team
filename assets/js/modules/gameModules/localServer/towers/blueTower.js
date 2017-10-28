import Tower from './tower.js';

export default class BlueTower extends Tower {
    constructor() {
        super('BlueTower', 2, 15, 2, 25, {x: 0, y: 0}, 'bluetower.png');
    }

    static Create() {
        return new BlueTower();
    }
}
