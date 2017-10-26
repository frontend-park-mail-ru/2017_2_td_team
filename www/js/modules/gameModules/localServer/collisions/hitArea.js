export default class HitArea {
    constructor(rad, x, y) {
        this.position = {x, y};
        this.rad = rad;
        this.monsters = [];
    }

    checkCollision(object) {

        if (object.position.x >= this.position.x + object.position.width &&
            object.position.y >= this.position.y + object.position.height &&
            object.position.x <= this.position.x + this.position.width &&
            object.position.y <= this.position.y + this.position.height
        ) {
            return true;
        }
    }



}
