export default class Monster {

    constructor(type, weight, speed, hp, coord) {
        this.type = type;
        this.weight = weight;
        this.speed = speed;
        this.hp = hp;
        this.coord = coord;
        this.fuzzyCoord = {x: 0, y: 0};
        this.vx = this.speed * (1 / 15);
        this.vy = this.speed * (1 / 15);

    }

    setPath(path) {
        this.current = 0;
        this._path = path;
        this.coord.x = path[0].coord.x;
        this.coord.y = path[0].coord.y;
        this.vx = path[0].dir.x * this.vx;

        this.vy = path[0].dir.y * this.vy;
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
        this.fuzzyCoord = {x: 0, y: 0};
        const nextPoint = this._path[this.current];

        this.vx = this.speed * nextPoint.dir.x * (1 / 5);
        this.vy = this.speed * nextPoint.dir.y * (1 / 5);
        this.coord = nextPoint.coord;


    }

    updatePosition(delta) {
        if (this._path.length <= this.current) {
            return;
        }
        const fuzzyCoord = this.fuzzyCoord;
        fuzzyCoord.x += this.vx * delta;
        fuzzyCoord.y += this.vy * delta;
        if (Math.abs(fuzzyCoord.x) >= 1 || fuzzyCoord.y >= 1) {
            this.makeStep();
        }
    }

    static Create(type, weight, speed, hp, coord) {
        return new Monster(type, weight, speed, hp, coord);
    }

}
