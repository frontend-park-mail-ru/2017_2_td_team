export default class HitArea {
    constructor(tower) {
        this.position = {x: tower.coord.x + tower.range, y: tower.coord.y + tower.range};
        this.width = tower.range * 2 + 1;
        this.height = tower.range * 2 + 1;
        this.monsters = [];
    }

    checkCollision(object) {
        return object.position.x >= this.position.x + object.width &&
            object.position.y >= this.position.y + object.height &&
            object.position.x <= this.position.x + this.width &&
            object.position.y <= this.position.y + this.height;

    }

    pushMonsters(...monsters) {
        this.monsters.push(monsters);
    }

}
