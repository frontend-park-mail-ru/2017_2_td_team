import {globalEventBus} from '../globalEventBus.js';

export default class GameScene {

    constructor(parent, titlesz, gamectx) {
        console.log(gamectx);
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

        window.addEventListener('resize', () => this.resize());

        this.setState(gamectx);


        this.prepared = false;
        this.renderer = new this.pixi.autoDetectRenderer(this.width, this.height);
        this.renderer.autoResize = true;
        this.tink = new Tink(this.pixi, this.renderer.view);

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

        this.renderer.resize(this.width, this.height);

        this.titleWidth = this.scalex * this.titlesz;
        this.titleHeight = this.scaley * this.titlesz;

        this.resizers.forEach(resizer => resizer());
    }

    prepare() {
        if (this.prepared) {
            return Promise.resolve(true);
        }
        return new Promise((resolve, reject) => {
            console.log('load');
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
            this.scaleElements(this.sprites.titles);
        };
        this.resizers.push(resizer);
        this.sprites.titleSprites = [];

        for (let j = 0; j < this.map.length; ++j) {
            this.sprites.titleSprites.push([]);
            for (let i = 0; i < this.map[j].length; ++i) {

                const titleType = this.map[j][i];
                const title = this.getSpriteByTexture(this.titletypes.get(titleType));

                const resizer = () => {
                    title.position.set(i * this.titleWidth, j * this.titleHeight);
                };

                resizer();
                title.interactive = true;

                title.on('pointerover', () => {

                    title.alpha = 0.7;
                });

                title.on('pointerout', () => {

                    title.alpha = 1;

                });

                this.resizers.push(resizer);
                this.sprites.titleSprites[j].push(title);
                titles.addChild(title);
            }
        }

        resizer();
        return this.sprites.titles;
    }

    createGameHudLayout() {
        const layout = new this.pixi.Container();
        let lowbar = new PIXI.Graphics();
        let rightbar = new PIXI.Graphics();
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

        const hp = new PIXI.Text(this.state.hp);
        const money = new PIXI.Text(this.state.players[0].money);
        const waveTimer = new PIXI.Text(this.state.wave.timer);

        this.sprites.hp = hp;
        this.sprites.money = money;
        elements.addChild(hpIcon, moneyIcon, hp, money, waveTimer);
        const placeElements = () => {
            const offset = this.titleWidth * 4;
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
                const sprite = this.getSpriteByTexture(tower.texture);
                const resizer = () => {
                    sprite.position.set(0, towerNumber * this.titleHeight);

                };
                resizer();
                this.resizers.push(resizer);
                this.sprites.towers.set(tower.id, sprite);
                towers.addChild(sprite);
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
        return selected;
    }

    render() {
        if (this.state.wave.timer !== 0) {
            this.sprites.waveTimer.text = 'Starts in ' + Math.round(this.state.wave.timer);
            this.sprites.waveTimer.visible = true;
        } else {
            this.sprites.waveTimer.visible = false;
        }
        // this.updateWaveTimer();
        this.updateMonstersSprites();

        this.renderer.render(this.stage);
    }

    updateMonstersSprites() {
        if (!this.sprites.monsters) {
            this.sprites.monsters = new Map();
        }
        const ticker = this.pixi.ticker.shared;
        this.state.monsters.forEach(monster => {
            if (!this.sprites.monsters.has(monster.id)) {
                const monsterSprite = this.getScaledSprite(monster.type + '.png');
                monsterSprite.position.set(this.titleWidth * monster.coord.x, this.titleHeight * monster.coord.y);
                const posUpdater = delta => {
                    monsterSprite.position.x += monster.vx * this.titleWidth * delta;
                    if (monsterSprite.position.x > 30 * this.titleWidth) {
                        monsterSprite.position.x = 30 * this.titleWidth;
                    }
                    monsterSprite.position.y += monster.vy * this.titleHeight * delta;
                    if (monsterSprite.position.y > 22 * this.titleHeight) {
                        monsterSprite.position.y = 22 * this.titleHeight;
                    }
                };
                ticker.add(posUpdater);
                this.stage.addChild(monsterSprite);
                this.sprites.monsters.set(monster.id, {
                    sprite: monsterSprite,
                    clean: () => ticker.remove(posUpdater)
                });
            }
        });
    }
}
