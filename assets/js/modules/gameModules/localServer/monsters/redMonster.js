import Monster from './monster.js';

export default class RedMonster extends Monster {
    constructor() {
        super('redMonster', 100, 3, 100, {x: 0, y: 0}, 2);
    }

    static Create() {
        return new RedMonster();
    }

    static get typeid() {
        return 1001;
    }
}
