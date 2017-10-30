export default class Tower {
    constructor(type, range, attack, aspeed, price, coord, texture) {
        this.type = type;
        this.range = range;
        this.attack = attack;
        this.aspeed = aspeed;
        this.price = price;
        this.texture = texture;
        this.coord = coord;
        this.reload = 1;
        this.shots = 0;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    fireOn(ms, monsters) {

        this.reload += ms;
        if (this.reload > this.aspeed * 1000) {
            this.reload = this.aspeed * 1000;
        }
        let bulletsCount = this.reload * 0.001;
        if (bulletsCount >= 1) {
            this.reload -= Math.floor(bulletsCount) * 1000;
        }
        return monsters.reduce((events, monster) => {
            while (bulletsCount >= 1) {

                monster.hp -= this.attack;
                events.fire.push({tower: this.id, monster: monster.id});
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
