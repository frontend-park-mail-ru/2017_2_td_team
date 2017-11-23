import Monster from './monster.js';

export default class BlueMonster extends Monster {
    constructor() {
        super('blueMonster', 10, 3, 100, {x: 0, y: 0}, 2);
    }

    static Create() {
        return new BlueMonster();
    }

    static get typeid() {
        return 1002;
    }
}
