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
        this.reload = this.period;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    fireOn(ms, monsters) {
        this.reload += ms;

        let bulletsCount = Math.floor(this.reload / this.period);
        this.reload = this.reload - bulletsCount * this.period;

        return monsters.reduce((events, monster) => {
            while (bulletsCount > 0) {
                monster.hp -= this.damage;
                events.fire.push({
                    tower: this.id,
                    monster: monster.id,
                    offset: events.fire.length * this.period
                });
                if (monster.hp <= 0) {
                    events.passed.push(monster);
                    return events;
                }
                --bulletsCount;
            }
            return events;
        }, {fire: [], passed: []});
    }

    static Create(type, range, attack, aspeed, price, coord, texture) {
        return new Tower(type, range, attack, aspeed, price, coord, texture);
    }
}
