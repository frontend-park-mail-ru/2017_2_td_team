export default class MonsterCreator {
    constructor(monsterFactory, idSource) {
        this._monsterFactory = monsterFactory;
        this.idSource = idSource;

    }
    createMonster() {
        const monster = this._monsterFactory.Create();
        monster.id = this.idSource.next().value;
        return monster;
    }
}
