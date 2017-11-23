import Tower from './tower.js';

export default class BlueTower extends Tower {
    constructor() {
        super('BlueTower', 3, 40, 1000, 50, {x: 0, y: 0}, 'bluetower.png');
    }

    static Create() {
        return new BlueTower();
    }

    static get typeid(){
        return 101;
    }
}
