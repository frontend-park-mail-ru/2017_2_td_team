export default class HitArea {
    constructor(tower) {
        this.position = {x: tower.x - tower.range, y: tower.y - tower.range};

        this.width = 2 * tower.range + 1;
        this.height = 2 * tower.range + 1;
        this.tower = tower;
    }

    isPointInside(point) {
        return point.x >= this.position.x
            && point.y >= this.position.y
            && point.x < (this.position.x + this.width + 1)
            && point.y < (this.position.y + this.height + 1);
    }

    checkCollision(object) {
        const topPoint = object.realPosition;
        const botPoint = Object.assign(topPoint);
        botPoint.x += 1;
        botPoint.y += 1;
        return this.isPointInside(topPoint) || this.isPointInside(botPoint);
    }


}
