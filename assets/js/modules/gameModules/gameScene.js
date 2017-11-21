import globalEventBus from '../globalEventBus.js';
import Events from '../../events.js';

export default class GameScene {

    constructor(parent, titlesz, gamectx) {

        this.bus = globalEventBus;
        this.map = gamectx.map.titles;


        this.titlesz = titlesz;

        this.totalTitlesW = 21;
        this.totalTitlesH = 14;
        this.aspect = this.totalTitlesW / this.totalTitlesH;

        this.calcDimensions();

        this.pixi = window.PIXI;

        const elemResizer = this.resize.bind(this);
        window.addEventListener('resize', elemResizer);

        this.clenupScripts = [() => window.removeEventListener('resize', elemResizer)];
        this.setState(gamectx);


        this.prepared = false;
        this.renderer = new this.pixi.autoDetectRenderer(this.width, this.height);
        this.renderer.autoResize = true;

        this.sprites = {};
        this.resizers = [];

        this.stage = new this.pixi.Container();
        parent.appendChild(this.renderer.view);

        this.parent = parent;
    }

    scaleElements(...elems) {
        for (let elem of elems) {
            elem.scale.set(this.scalex, this.scaley);
        }
        return elems[0];
    }

    resize() {
        this.calcDimensions();
        this.resizers.forEach(resizer => resizer());
        this.renderer.resize(this.width, this.height);

    }

    calcDimensions() {
        let availheight = window.innerHeight - window.innerHeight % this.titlesz;

        this.height = availheight;
        this.width = availheight * this.aspect;

        this.scaley = this.height / (this.totalTitlesH * this.titlesz);
        this.scalex = this.width / (this.totalTitlesW * this.titlesz);

        this.titleWidth = this.scalex * this.titlesz;
        this.titleHeight = this.scaley * this.titlesz;
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
        const hud = this.createGameHudLayout();
        hud.addChild(this.createGameHudElements());
        hud.addChild(this.createAvailableTowers());
        hud.addChild(this.createSelectedTowerBar());
        this.stage.addChild(hud);
    }

    setState(state) {
        this.state = state;
    }

    getTextureForType(typeid) {
        return this.textures[this.state.textureAtlas.atlas[typeid].texture];
    }

    getSpriteByTexture(typeid) {
        return new this.pixi.Sprite(this.getTextureForType(typeid));
    }

    getScaledSprite(typeid) {
        return this.scaleElements(this.getSpriteByTexture(typeid));
    }


    createGameMap() {
        this.titlesContainer = new this.pixi.Container();
        this.titlesSprites = [];

        for (let j = 0; j < this.map.length; ++j) {
            this.titlesSprites.push([]);
            for (let i = 0; i < this.map[j].length; ++i) {

                const titleType = this.map[j][i];
                const title = this.getSpriteByTexture(titleType);
                const titlePlacer = () => {
                    title.width = this.titleWidth;
                    title.height = this.titleHeight;
                    title.position.set(i * this.titleWidth, j * this.titleHeight);
                };
                titlePlacer();
                this.resizers.push(titlePlacer);

                title.interactive = true;

                title.on('pointerover', () => {
                    title.alpha = 0.7;
                });

                title.on('pointerout', () => {
                    title.alpha = 1;
                });

                title.on('click', () => {
                    this.bus.emit(Events.TITLE_CLICKED, {coord: {x: i, y: j}, titleType});
                });

                this.titlesSprites[j].push(title);
                this.titlesContainer.addChild(title);
            }
        }

        return this.titlesContainer;
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

        const hpIcon = this.scaleElements(new this.pixi.Sprite(this.textures['heart.png']));

        let moneyIcon = this.scaleElements(new this.pixi.Sprite(this.textures['coin.png']));

        const hp = new this.pixi.Text(this.state.hp);

        this.sprites.money = new this.pixi.Text(this.state.player.money);

        const waveTimer = new this.pixi.Text(this.state.wave.timer);
        this.sprites.hp = hp;
        elements.addChild(hpIcon, moneyIcon, hp, this.sprites.money, waveTimer);

        const placeElements = () => {
            const offset = this.titleWidth * 5;

            this.scaleElements(moneyIcon, hpIcon, this.sprites.money, hp);
            waveTimer.visible = false;
            waveTimer.position.set(0, 0);
            hpIcon.position.set(offset, 0);
            moneyIcon.position.set(offset + 4 * this.titleWidth, 0);
            hp.position.set(hpIcon.x + hpIcon.width, 0);
            this.sprites.money.position.set(moneyIcon.x + moneyIcon.width, 0);
            elements.position.set(0, this.height - this.titlesz * this.scaley);
        };

        placeElements();
        this.sprites.hp = hp;
        this.sprites.waveTimer = waveTimer;
        this.resizers.push(placeElements);

        return elements;
    }

    createAvailableTowers() {
        const availableTowers = new this.pixi.Container();
        const resizer = () => {
            this.scaleElements(availableTowers);
            availableTowers.position.set(this.width - this.titleWidth, 0);
        };
        this.resizers.push(resizer);
        resizer();
        console.log(this.state);
        this.state.availableTowers.reduce((towerNumber, tower) => {
            const towerSprite = this.getScaledSprite(tower);
            towerSprite.position.set(0, towerNumber * this.titleHeight);
            towerSprite.interactive = true;
            towerSprite.on('click', () => this.bus.emit(Events.TOWER_CLICKED, {
                sprite: towerSprite,
                type: tower,
            }));
            availableTowers.addChild(towerSprite);
            return ++towerNumber;
        }, 0);
        return availableTowers;
    }

    createSelectedTowerBar() {
        const selected = new this.pixi.Container();
        const ap = this.scaleElements(new this.pixi.Sprite(this.textures['damage.png']));

        const as = this.scaleElements(new this.pixi.Sprite(this.textures['aspeed.png']));
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
        if (this.state.wave.msToStart !== 0) {
            this.sprites.waveTimer.text = 'Starts in ' + Math.round(this.state.wave.msToStart);
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
        if (!this.monstersSprites) {
            this.monstersSprites = new Map();
            this.monstersContainer = new this.pixi.Container();
            this.stage.addChild(this.monstersContainer);
        }
        const monsters = this.state.wave.running;
        for (let monster of monsters) {
            if (!this.monstersSprites.has(monster.id)) {
                const monsterSprite = this.getScaledSprite(monster.typeid);

                this.resizers.push(() => {
                    monsterSprite.width = this.titleWidth;
                    monsterSprite.height = this.titleHeight;
                });

                monsterSprite
                    .position
                    .set(this.titleWidth * monster.titleCoord.x,
                        this.titleHeight * monster.titleCoord.y);

                this.monstersContainer.addChild(monsterSprite);
                this.monstersSprites.set(monster.id, monsterSprite);

            } else {
                const monsterSprite = this.monstersSprites.get(monster.id);
                monsterSprite.x = (monster.titleCoord.x + monster.relativeCoord.x) * this.titleWidth;
                monsterSprite.y = (monster.titleCoord.y + monster.relativeCoord.y) * this.titleHeight;
            }
        }
        this.monstersContainer.children.sort(function (a, b) {
            if (a.position.y > b.position.y) {
                return 1;
            }
            if (a.position.y < b.position.y) {
                return -1;
            }
            if (a.position.x > b.position.x) {
                return 1;
            }
            if (a.position.x < b.position.x) {
                return -1;
            }
            return 0;
        });

        for (let passedMonster of this.state.wave.passed) {
            const monsterSprite = this.monstersSprites.get(passedMonster.id);
            if (monsterSprite) {
                this.monstersSprites.delete(passedMonster.id);
                this.monstersContainer.removeChild(monsterSprite);
            }
        }
    }

    destroy() {
        this.clenupScripts.forEach(off => off());
        this.stage.destroy();

    }

    updateHudIndicators() {
        this.sprites.hp.text = this.state.hp;
        this.sprites.money.text = this.state.player.money;
    }

    updateTowersSprites() {
        if (!this.towersContainer) {
            this.towersContainer = new this.pixi.Container();
            this.towersSprites = new Map();
            this.titlesContainer.addChild(this.towersContainer);
        }

        for (let tower of this.state.towers) {
            if (!this.towersSprites.has(tower.id)) {

                const towerSprite = this.getScaledSprite(tower.typeid);

                const resizer = () => {
                    towerSprite.position.set(tower.titlePosition.x * this.titleWidth, tower.titlePosition.y * this.titleHeight);
                };
                resizer();
                this.resizers.push(resizer);

                this.titlesContainer.addChild(towerSprite);
                this.towersSprites.set(tower.id, towerSprite);

            }
        }
    }


    get monstersSprites() {
        return this.sprites.monsters;
    }

    get towersSprites() {
        return this.sprites.towers;
    }

    set towersSprites(towers) {
        this.sprites.towers = towers;
    }

    get towersContainer() {
        return this.sprites.towersContainer;
    }

    get monstersContainer() {
        return this.sprites.monstersContrainer;
    }

    get titlesContainer() {
        return this.sprites.titles;
    }

    set titlesContainer(cont) {
        this.sprites.titles = cont;
    }

    get titlesSprites() {
        return this.sprites.titleSprites;
    }

    set titlesSprites(sprites) {
        this.sprites.titleSprites = sprites;
    }


    set towersContainer(towers) {
        this.sprites.towersContainer = towers;
    }

    set monstersContainer(cont) {
        this.sprites.monstersContrainer = cont;
    }

    set monstersSprites(sprites) {
        this.sprites.monsters = sprites;
    }

}
