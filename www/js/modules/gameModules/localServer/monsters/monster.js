export default class Monster {

    constructor(type, weight, speed, hp, coord) {
        this.type = type;
        this.weight = weight;
        this.speed = speed;
        this.hp = hp;
        this.coord = coord;
    }

    static Create(type, weight, speed, hp, coord) {
        return new Monster(type, weight, speed, hp, coord);
    }

}
