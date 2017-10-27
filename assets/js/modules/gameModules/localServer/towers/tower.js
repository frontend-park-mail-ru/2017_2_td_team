export default class Tower {
    constructor(type, range, attack, aspeed, price, coord, texture) {
        this.type = type;
        this.range = range;
        this.attack = attack;
        this.aspeed = aspeed;
        this.price = price;
        this.texture = texture;
        this.coord = coord;
    }

    get id() {
        return this._id;
    }

    set id(id) {
        this._id = id;
    }

    static Create(type, range, attack, aspeed, price, coord, texture) {
        return new Tower(type, range, attack, aspeed, price, coord, texture);
    }
}
