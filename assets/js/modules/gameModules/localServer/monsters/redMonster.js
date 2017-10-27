import Monster from './monster.js';

export default class RedMonster extends Monster {
    constructor() {
        super('redMonster', 1, 0.5, 10, {x: 0, y: 0});
    }

    static Create() {
        return new RedMonster();
    }
}
