import Monster from './monster.js';

export default class RedMonster extends Monster {
    constructor() {
        super('redMonster', 20, 2, 80, {x: 0, y: 0}, 2);
    }

    static Create() {
        return new RedMonster();
    }

    static get typeid() {
        return 1001;
    }
}
