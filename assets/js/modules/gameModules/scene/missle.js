export default class Missle {
    constructor(animationSprite, source, target, offset, timeLimit) {

        this._sprite = animationSprite;
        this._source = Object.assign(source.position);
        this._target = Object.assign(target.position);
        this.timeLimit = timeLimit;
        this.vx = (this._target.x - this._source.x + (target.width - source.width) / 2) / (timeLimit);
        this.vy = (this._target.y - this._source.y + (target.height - source.height) / 2) / (timeLimit);
        this._sprite.position = this._source;
        this._sprite.scale.set(2, 2);
        this.timeBuffer = 0;
        this.offsetTimeBuffer = offset;

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
        if(this.offsetTimeBuffer > delta){
            this.offsetTimeBuffer -= delta;
            return;
        }
        this.timeBuffer += delta;
        this._sprite.x += this.vx * delta;
        this._sprite.y += this.vy * delta;
        console.log(this.timeBuffer);
        if (this.timeBuffer >= this.timeLimit) {
            this._sprite.stop();
            return false;
        }
        return true;
    }

    get sprite() {
        return this._sprite;
    }

    destroy() {
        this._sprite.destroy();
    }
}
