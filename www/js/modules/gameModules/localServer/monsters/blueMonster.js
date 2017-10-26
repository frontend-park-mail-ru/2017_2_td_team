import Monster from './monster.js';

export default class BlueMonster extends Monster {
    constructor() {
        super('blue', 1, 1, 5, {x: 0, y: 0});
    }

    static Create() {
        return new BlueMonster();
    }
}