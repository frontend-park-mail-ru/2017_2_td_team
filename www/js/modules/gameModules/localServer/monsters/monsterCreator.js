export default class MonsterCreator {
    constructor(monsterFactory) {
        this._monsterFactory = monsterFactory;
    }

    createMonster() {
        return this._monsterFactory.Create();
    }
}
