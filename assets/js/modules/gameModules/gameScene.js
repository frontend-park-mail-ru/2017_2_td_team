import {globalEventBus} from '../globalEventBus.js';
import {Events} from '../../events.js';

export default class GameScene {

    constructor(parent, titlesz, gamectx) {

        this.bus = globalEventBus;
        this.map = gamectx.map.titles;
        this.titletypes = gamectx.map.titletypes;

        this.titlesz = titlesz;

        this.totalTitlesW = 32;
        this.totalTitlesH = 24;

        let availwidth = window.innerWidth - window.innerWidth % this.titlesz;
        let availheight = window.innerHeight - window.innerHeight % this.titlesz;

        this.scalex = availwidth / (this.totalTitlesW * this.titlesz);
        if (this.scalex > 1) {
            availwidth = this.totalTitlesW * this.titlesz;
            this.scalex = 1;
        }
        this.scaley = availheight / ( this.totalTitlesH * this.titlesz);
        if (this.scaley > 1) {
            availheight = this.totalTitlesH * this.titlesz;
            this.scaley = 1;
        }
        this.width = this.scalex * availwidth;
        this.height = this.scaley * availheight;
        this.titleWidth = this.scalex * this.titlesz;
        this.titleHeight = this.scaley * this.titlesz;
        this.pixi = window.PIXI;
        const elemResizer = this.resize.bind(this);
        window.addEventListener('resize', elemResizer);
        this._registered = [() => window.removeEventListener('resize', elemResizer)];
        this.setState(gamectx);


        this.prepared = false;
        this.renderer = new this.pixi.autoDetectRenderer(this.width, this.height);
        this.renderer.autoResize = true;

        this.sprites = {};
        this.resizers = [];

        this.stage = new this.pixi.Container();
        parent.appendChild(this.renderer.view);
    }

    scaleElements(...elems) {
        for (let elem of elems) {
            elem.scale.set(this.scalex, this.scaley);
        }
        return elems[0];
    }

    resize() {
        let availwidth = window.innerWidth - window.innerWidth % this.titlesz;
        let availheight = window.innerHeight - window.innerHeight % this.titlesz;

        this.scalex = availwidth / (this.totalTitlesW * this.titlesz);
        if (this.scalex > 1) {
            availwidth = this.totalTitlesW * this.titlesz;
            this.scalex = 1;
        }
        this.scaley = availheight / ( this.totalTitlesH * this.titlesz);
        if (this.scaley > 1) {
            availheight = this.totalTitlesH * this.titlesz;
            this.scaley = 1;
        }


        this.width = this.scalex * availwidth;
        this.height = this.scaley * availheight;


        this.titleWidth = this.scalex * this.titlesz;
        this.titleHeight = this.scaley * this.titlesz;

        this.resizers.forEach(resizer => resizer());

        this.renderer.resize(this.width, this.height);
    }

    prepare() {
        if (this.prepared) {
            return Promise.resolve(true);
        }
        return new Promise((resolve) => {
            this.pixi.loader.reset();
            this.pixi.loader
                .add('img/titleset.json')
                .load(() => {
                    this.prepared = true;
                    this.textures = this.pixi.loader.resources['img/titleset.json'].textures;
                    this.setup();
                    resolve(true);
                });
        });
    }

    setup() {
        this.stage.addChild(this.createGameMap());
        let hud = this.createGameHudLayout();
        hud.addChild(this.createGameHudElements());
        hud.addChild(this.createAvailableTowers());
        hud.addChild(this.createSelectedTowerBar());
        this.stage.addChild(hud);
    }

    setState(state) {
        this.state = state;
    }

    getSpriteByTexture(id) {
        return new this.pixi.Sprite(this.textures[id]);
    }

    getScaledSprite(textureid) {
        return this.scaleElements(this.getSpriteByTexture(textureid));
    }


    createGameMap() {
        const titles = new this.pixi.Container();

        this.sprites.titles = titles;
        const resizer = () => {
            this.sprites.titles.width = this.width - this.titleWidth;
            this.sprites.titles.height = this.height - this.titleHeight;
        };
        this.resizers.push(resizer);
        this.sprites.titleSprites = [];

        for (let j = 0; j < this.map.length; ++j) {
            this.sprites.titleSprites.push([]);
            for (let i = 0; i < this.map[j].length; ++i) {

                const titleType = this.map[j][i];
                const title = this.getSpriteByTexture(this.titletypes.get(titleType));

                title.position.set(i * this.titleWidth, j * this.titleHeight);
                title.interactive = true;

                title.on('pointerover', () => {

                    title.alpha = 0.7;
                });

                title.on('pointerout', () => {

                    title.alpha = 1;

                });
                title.on('click', () => {
                    this.bus.emit(Events.TITLE_CLICKED, {title, titleType});
                });
                this.sprites.titleSprites[j].push(title);
                titles.addChild(title);
            }
        }

        resizer();
        return this.sprites.titles;
    }

    createGameHudLayout() {
        const layout = new this.pixi.Container();
        let lowbar = new this.pixi.Graphics();
        let rightbar = new this.pixi.Graphics();
        const resizer = () => {
            lowbar.clear();
            rightbar.clear();
            rightbar.beginFill(0x303030);
            rightbar.lineStyle(1, 0xFFA500, 1);
            rightbar.drawRect(this.width - this.titleWidth, 0, this.titleWidth, this.height);
            rightbar.endFill();

            lowbar.beginFill(0x303030);
            lowbar.lineStyle(1, 0xFFA500, 1);
            lowbar.drawRect(0, this.height - this.titleHeight, this.width, this.titleHeight);
            lowbar.endFill();
        };
        resizer();
        layout.addChild(lowbar, rightbar);
        this.resizers.push(resizer);
        return layout;
    }

    createGameHudElements() {
        const elements = new this.pixi.Container();

        const hpIcon = this.getScaledSprite('heart.png');

        let moneyIcon = this.getScaledSprite('coin.png');

        const hp = new this.pixi.Text(this.state.hp);
        const money = new this.pixi.Text(this.state.players[0].money);
        const waveTimer = new this.pixi.Text(this.state.wave.timer);

        this.sprites.hp = hp;
        this.sprites.money = money;
        elements.addChild(hpIcon, moneyIcon, hp, money, waveTimer);
        const placeElements = () => {
            const offset = this.titleWidth * 5;
            this.scaleElements(moneyIcon, hpIcon, money, hp);
            waveTimer.visible = false;
            waveTimer.position.set(0, 0);
            hpIcon.position.set(offset, 0);
            moneyIcon.position.set(offset + 4 * this.titleWidth, 0);
            hp.position.set(hpIcon.x + hpIcon.width, 0);
            money.position.set(moneyIcon.x + moneyIcon.width, 0);
            elements.position.set(0, this.height - this.titlesz * this.scaley);
        };

        placeElements();
        this.sprites.hp = hp;
        this.sprites.waveTimer = waveTimer;
        this.sprites.money = money;
        this.resizers.push(placeElements);

        return elements;
    }

    createAvailableTowers() {
        const towers = new this.pixi.Container();
        const resizer = () => {
            this.scaleElements(towers);
            towers.position.set(this.width - this.titleWidth, 0);

        };
        this.resizers.push(resizer);
        resizer();
        this.sprites.towers = new Map();

        for (let player of this.state.players) {
            player.towers.reduce((towerNumber, tower) => {
                const towerSprite = this.getScaledSprite(tower.texture);

                towerSprite.position.set(0, towerNumber * this.titleHeight);
                towerSprite.interactive = true;
                towerSprite.on('click', () => this.bus.emit(Events.TOWER_CLICKED, {
                    sprite: towerSprite,
                    number: towerNumber - 1,
                }));


                this.sprites.towers.set(towerSprite.id, towerSprite);
                towers.addChild(towerSprite);
                return ++towerNumber;
            }, 0);

        }

        return towers;
    }

    createSelectedTowerBar() {
        const selected = new this.pixi.Container();
        const ap = this.getScaledSprite('attack.png');
        const as = this.getScaledSprite('aspeed.png');
        selected.addChild(ap, as);

        const resizer = () => {
            const offsetx = this.sprites.money.width + this.titleWidth + this.sprites.money.getGlobalPosition().x;

            ap.position.set(0, 0);
            as.position.set(ap.width * 2, 0);
            this.scaleElements(ap, as);
            selected.position.set(offsetx, this.height - this.titleHeight);

        };
        resizer();
        this.resizers.push(resizer);
        return selected;
    }

    render() {
        if (this.state.wave.timer !== 0) {
            this.sprites.waveTimer.text = 'Starts in ' + Math.round(this.state.wave.timer);
            this.sprites.waveTimer.visible = true;
        } else {
            this.sprites.waveTimer.visible = false;
        }
        this.updateMonstersSprites();
        this.updateTowersSprites();
        this.updateHudIndicators();
        this.renderer.render(this.stage);
    }

    updateMonstersSprites() {
        if (!this.sprites.monsters) {
            this.sprites.monsters = new Map();
            this.sprites.monstersContrainer = new this.pixi.Container();
            this.resizers.push(() => {
                this.scaleElements(this.sprites.monstersContrainer);
            });
            this.scaleElements(this.sprites.monstersContrainer);
            this.stage.addChild(this.sprites.monstersContrainer);
        }
        const ticker = this.pixi.ticker.shared;
        for (let monster of this.state.monsters.values()) {
            if (!this.sprites.monsters.has(monster.id)) {

                const monsterSprite = this.getScaledSprite(monster.type + '.png');
                monsterSprite.position.set(this.titleWidth * monster.coord.x, this.titleHeight * monster.coord.y);
                this.resizers.push(() => {
                    const next = monster.getNextPoint();
                    if (next) {
                        monsterSprite.position.set(next.coord.x * this.titleWidth, next.coord.y * this.titleHeight);
                    } else {
                        monsterSprite.position.set(monster.coord.x * this.titleWidth, monster.coord.y * this.titleHeight);
                    }
                });
                const updater = delta => {
                    const next = monster.getNextPoint();
                    if (next) {
                        const nextx = next.coord.x * this.titleWidth;
                        const nexty = next.coord.y * this.titleHeight;
                        if (nexty < monsterSprite.y) {
                            monsterSprite.y = nexty;
                        } else {
                            monsterSprite.y += monster.vy * this.titleHeight * delta;
                        }
                        if (monster.vx > 0 && monsterSprite.x > nextx) {
                            monsterSprite.x = nextx;
                        } else if (monster.vx < 0 && monsterSprite.x < nextx) {
                            monsterSprite.x = nextx;
                        } else {
                            monsterSprite.x += monster.vx * this.titleWidth * delta;

                        }
                    }

                    if (monsterSprite.position.x > 30 * this.titleWidth) {
                        monsterSprite.position.x = 30 * this.titleWidth;
                    }

                    if (monsterSprite.position.y > 22 * this.titleHeight) {
                        monsterSprite.position.y = 22 * this.titleHeight;
                    }
                };
                ticker.add(updater);
                this.sprites.monstersContrainer.addChild(monsterSprite);
                this.sprites.monsters.set(monster.id, {
                    sprite: monsterSprite,
                    clean: () => {
                        ticker.remove(updater);
                        this.sprites.monstersContrainer.removeChild(monsterSprite);
                    }
                });
            }
        }

        for (let passsed of this.state.passed) {
            const monsterCtx = this.sprites.monsters.get(passsed.id);
            if (monsterCtx) {

                this.sprites.monsters.delete(monsterCtx.id);
                monsterCtx.clean();
            }
        }
    }

    destroy() {
        this._registered.forEach(off => off());
        for (let monsterCtx of this.sprites.monsters.values()) {
            monsterCtx.clean();
        }
        this.stage.destroy();

    }

    updateHudIndicators() {
        this.sprites.hp.text = this.state.hp;
        this.sprites.money.text = this.state.players[0].money;
    }

    updateTowersSprites() {
        if (!this.sprites.placedTowers) {
            const placedTowers = new this.pixi.Container();
            this.sprites.placedTowers = placedTowers;
            this.sprites.titles.addChild(placedTowers);
        }
        for (let tower of this.state.towers) {
            if (!this.sprites.towers.has(tower.id)) {
                const towerSprite = this.getScaledSprite(tower.texture);

                const resizer = () => {
                    towerSprite.position.set(tower.coord.x, tower.coord.y);
                };
                resizer();
                this.resizers.push(resizer);

                this.sprites.titles.addChild(towerSprite);
                this.sprites.towers.set(tower.id, towerSprite);

            }
        }
    }
}
