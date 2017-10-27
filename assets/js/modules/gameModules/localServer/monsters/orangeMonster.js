import Monster from './monster.js';

export default class OrangeMonster extends Monster {

    constructor() {
        super('orangeMonster', 1, 0.3, 30, {
            x: 0,
            y: 0,
        });
    }

    static Create() {
        return new OrangeMonster();
    }
}
