export default class HitArea {
    constructor(tower) {
        this.position = {x: tower.x - tower.range, y: tower.y - tower.range};

        this.width = tower.range * 2 + 1;
        this.height = tower.range * 2 + 1;
        this.tower = tower;
        this.monsters = [];
    }

    checkCollision(object) {
        const objCoords = object.realPosition;
        return objCoords.x > this.position.x &&
            objCoords.y > this.position.y &&
            objCoords.x < this.position.x + this.width &&
            objCoords.y < this.position.y + this.height;
    }

    pushMonsters(...monsters) {
        this.monsters.push(monsters);
    }

}
