export default class Missile {
    constructor(animationSprite, source, target, offset, timeLimit) {

        this._sprite = animationSprite;
        this.startPoint = source;
        this.finishPoint = target;
        this.timeLimit = timeLimit;

        this.vx = (this.finishPoint.x - this.startPoint.x) / timeLimit;
        this.vy = (this.finishPoint.y - this.startPoint.y) / timeLimit;

        this._sprite.position.set(this.startPoint.x, this.startPoint.y);

        this.timeBuffer = 0;
        this.offsetTimeBuffer = offset;
        this._sprite.scale.set(animationSprite.scale.x * 1.5, animationSprite.scale.y * 1.5);

    }

    start() {
        if (this.offsetTimeBuffer <= 0) {
            this._sprite.play();
        }
    }

    update(delta) {
        if (this.timeBuffer >= this.timeLimit) {
            return false;
        }
        if (this.offsetTimeBuffer > delta) {
            this.offsetTimeBuffer -= delta;
            return;
        }
        this.timeBuffer += delta;
        this._sprite.x += this.vx * delta;
        this._sprite.y += this.vy * delta;
        if (this.timeBuffer >= this.timeLimit) {
            this._sprite.stop();
            return false;
        }
        return true;
    }

    get sprite() {
        return this._sprite;
    }

    set startPoint(sprite) {
        this._startpoint = {};
        this._startpoint.x = sprite.position.x + sprite.width / 2;
        this._startpoint.y = sprite.position.y + sprite.height / 2;
    }

    set finishPoint(sprite) {
        this._finpoint = {};
        this._finpoint.x = sprite.position.x + sprite.width / 2;
        this._finpoint.y = sprite.position.y + sprite.height / 2;
    }

    get startPoint() {
        return this._startpoint;
    }

    get finishPoint() {
        return this._finpoint;
    }

    destroy() {
        this._sprite.destroy();
    }
}
