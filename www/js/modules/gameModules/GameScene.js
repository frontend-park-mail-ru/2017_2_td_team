import {globalEventBus} from '../globalEventBus.js';

export default class GameScene {

    constructor(parent, titlesz, titlemap, gamectx) {

        this.bus = globalEventBus;
        this.map = gamectx.map;
        this.titlemap = titlemap;

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

        for (let j = 0; j < this.map.length; ++j) {
            for (let i = 0; i < this.map[j].length; ++i) {

                const titleNumber = this.map[j][i];
                const title = this.getSpriteByTexture(this.titlemap.get(titleNumber));
                const resizer = () => {
                    title.position.set(i * this.titleWidth, j * this.titleHeight);
                };
                resizer();
                this.resizers.push(resizer);
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


        const hp = new PIXI.Text(this.state.hearts);
        let money = new PIXI.Text(this.state.player.money);


        this.sprites.hp = hp;
        this.sprites.money = money;
        elements.addChild(hpIcon, moneyIcon, hp, money);

        const placeElements = () => {
            const offset = this.titleWidth * 4;
            this.scaleElements(moneyIcon, hpIcon, money, hp);
            hpIcon.position.set(offset, 0);
            moneyIcon.position.set(offset + 4 * this.titleWidth, 0);
            hp.position.set(hpIcon.x + hpIcon.width, 0);
            money.position.set(moneyIcon.x + moneyIcon.width, 0);
            elements.position.set(0, this.height - this.titlesz * this.scaley);
        };
        placeElements();

        this.resizers.push(placeElements);

        return elements;
    }

    createAvailableTowers() {
        const towers = new this.pixi.Container();
        const resizer = ()=> {
            this.scaleElements(towers);
            towers.position.set(this.width - this.titleWidth, 0);

        };
        this.resizers.push(resizer);
        resizer();
        this.sprites.towers = new Map();
        if (this.state.player) {
            this.state.player.towers.reduce((towerNumber, tower) => {
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

    render() {
        this.renderer.render(this.stage);
    }
}
