import Monster from './monster.js';

export default class BlueMonster extends Monster {
    constructor() {
        super('blueMonster', 1, 5, 50, {x: 0, y: 0});
    }

    static Create() {
        return new BlueMonster();
    }
}
