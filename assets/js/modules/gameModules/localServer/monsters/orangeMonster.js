import Monster from './monster.js';

export default class OrangeMonster extends Monster {

    constructor() {
        super('orangeMonster', 100, 2, 150, {x: 0, y: 0}, 2);
    }

    static Create() {
        return new OrangeMonster();
    }

    static get typeid() {
        return 1003;
    }
}
