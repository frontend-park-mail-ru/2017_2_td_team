export default class Tower {
    constructor(type, range, attack, period, price, coord, texture) {
        this.type = type;
        this.range = range;
        this.damage = attack;
        this.price = price;
        this.texture = texture;
        this.x = coord.x;
        this.y = coord.y;
        this.period = period;
        this.localTimeBuffer = this.period;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    set owner(player) {
        this._owner = player;
    }

    get owner() {
        return this._owner;
    }

    reload(ms) {
        if (this.localTimeBuffer === this.period) {
            return;
        }
        this.localTimeBuffer += ms;
        if (this.localTimeBuffer > this.period) {
            this.localTimeBuffer = this.period;
        }
    }

    fireOn(monsters) {

        let bulletsCount = Math.floor(this.localTimeBuffer / this.period);
        this.localTimeBuffer = this.localTimeBuffer - bulletsCount * this.period;

        return monsters.reduce((events, monster) => {
            while (bulletsCount > 0 && monster.hp > 0) {
                monster.hp -= this.damage;
                events.fire.push({
                    towerId: this.id,
                    monsterId: monster.id,
                    offset: events.fire.length * this.period
                });
                if (monster.hp <= 0) {
                    this.owner.scores += (monster.hp + this.damage) * monster.reward;
                    events.passed.push(monster);
                    return events;
                }
                this.owner.scores += this.damage * monster.reward;
                --bulletsCount;
            }
            return events;
        }, {fire: [], passed: []});
    }

    get titlePosition() {
        return {x: this.x, y: this.y};
    }


    static Create(type, range, attack, aspeed, price, coord, texture) {
        return new Tower(type, range, attack, aspeed, price, coord, texture);
    }
}
