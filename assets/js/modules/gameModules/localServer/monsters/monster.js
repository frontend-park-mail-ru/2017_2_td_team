export default class Monster {

    constructor(type, weight, speed, hp, coord, reward) {
        this.type = type;
        this.weight = weight;
        this.speed = speed;
        this.hp = hp;
        this.coord = coord;
        this.relativeCoord = {x: 0, y: 0};
        this.vx = this.speed;
        this.vy = this.speed;
        this.reward = reward;
        this.direction = 0;

    }

    setPath(path) {
        this.current = 0;
        this._path = path;
        this.coord.x = path[0].coord.x;
        this.coord.y = path[0].coord.y;
        this.vx = path[0].dir.x * this.vx;

        this.vy = path[0].dir.y * this.vy;
        this.setDirection(path[0]);
    }

    getNextPoint() {
        return this._path[this.current + 1];
    }

    getStartPoint() {
        return this._path[0];
    }

    getEndPoint() {
        return this._path[this._path.length - 1];
    }

    set id(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }

    makeStep() {
        ++this.current;
        if (this._path.length <= this.current) {
            return;
        }
        this.relativeCoord = {x: 0, y: 0};
        const nextPoint = this._path[this.current];

        this.vx = this.speed * nextPoint.dir.x;
        this.vy = this.speed * nextPoint.dir.y;
        this.coord = nextPoint.coord;
        this.setDirection(nextPoint);

    }

    setDirection(point) {
        this.direction = Math.abs(2 * point.dir.x) + point.dir.x + Math.abs(point.dir.y) + point.dir.y;
    }

    updatePosition(delta) {
        if (this._path.length <= this.current) {
            return;
        }
        const fuzzyCoord = this.relativeCoord;
        fuzzyCoord.x += this.vx * delta * 0.001;
        fuzzyCoord.y += this.vy * delta * 0.001;
        if (Math.abs(fuzzyCoord.x) >= 1 || Math.abs(fuzzyCoord.y) >= 1) {
            this.makeStep();
        }
    }

    get realPosition() {
        return {x: this.coord.x + this.relativeCoord.x, y: this.coord.y + this.relativeCoord.y};
    }

    get tileCoord() {
        return this.coord;
    }

    static Create(type, weight, speed, hp, coord, reward) {
        return new Monster(type, weight, speed, hp, coord, reward);
    }

}
