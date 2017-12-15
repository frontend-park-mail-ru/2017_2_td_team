export default class HitArea {
    constructor(tower) {
        this.position = {x: tower.x - tower.range, y: tower.y - tower.range};

        this.width = 2 * tower.range + 1;
        this.height = 2 * tower.range + 1;
        this.tower = tower;
    }

    isUnderTopPoint(point) {
        return point.x >= this.position.x
            && point.y >= this.position.y
            && point.x < (this.position.x + this.width)
            && point.y < (this.position.y + this.height);
    }

    isOverBotPoint(point) {
        return point.x > this.position.x
            && point.y > this.position.y
            && point.x <= (this.position.x + this.width)
            && point.y <= (this.position.y + this.height);
    }


    checkCollision(object) {

        const topPoint = object.realPosition;
        const botPoint = {x: topPoint.x + 1, y: topPoint.y + 1};

        return this.isUnderTopPoint(topPoint) || this.isOverBotPoint(botPoint);
    }

}
