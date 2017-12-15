export default class MonsterSprite {
    constructor(animations, meta) {
        this._sprites = animations;
        this._current = animations.getChildAt(meta.direction);
        this._current.visible = true;
        this.meta = meta;
        this.running = true;
        this._sprites.children.forEach(sprite => {
            sprite.animationSpeed = 0.25;
            if (sprite !== this._current) {
                sprite.visible = false;
            }
        });

    }

    start() {
        this._current.play();
    }

    update() {
        return this.running;
    }

    getSpritesContainer() {
        return this._sprites;
    }

    rotate() {
        if (this._sprites.getChildIndex(this._current) === this.meta.direction) {
            return;
        }
        this._current.visible = false;
        this._current.gotoAndStop(0);
        this._current = this._sprites.getChildAt(this.meta.direction);
        this._current.visible = true;
        this._current.gotoAndPlay(0);
    }

    destroy() {
        this._current.stop();
    }

}
