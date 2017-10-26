export default class MonsterCreator {
    constructor(monsterFactory) {
        this._monsterFactory = monsterFactory;
        this.idSource = (function* () {
            let i = 0;
            while (true) {
                ++i;
                yield i;
            }
        }());
    }

    createMonster() {
        const monster = this._monsterFactory.Create();
        monster.setId(this.idSource.next().value);
        return monster;
    }


}
