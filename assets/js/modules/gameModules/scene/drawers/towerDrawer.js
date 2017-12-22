import ElementDrawer from './elemDrawer';
import Events from '../../../../events';

export default class TowerDrawer extends ElementDrawer {
    constructor(gameScene, parent, animationService) {
        super(gameScene, animationService);
        this.areasContainer = new this.pixi.Container();

        this.pane = new this.pixi.Container();
        this.pane.addChild(this.areasContainer);
        this.towersSprites = new Map();
        parent.addChild(this.pane);

    }

    getTower(id) {
        return this.towersSprites.get(id);
    }

    updateTowerSprites() {
        this.state.towers
            .filter(tower => !this.towersSprites.has(tower.id))
            .forEach(tower => this.registerTowerSprite(tower));
    }

    createTowerArea(tower, towerSprite) {
        const [topx, topy, height, width] = [
            this.tileWidth * (tower.tilePosition.x - tower.range),
            this.tileHeight * (tower.tilePosition.y - tower.range),
            this.tileHeight * (2 * tower.range + 1),
            this.tileWidth * (2 * tower.range + 1),
        ];
        const area = new this.pixi.Graphics();
        area.fillAlpha = 0.3;
        area.drawRect(topx, topy, width, height);
        area.visible = false;
        towerSprite.on('pointerover', () => {
            area.visible = true;
        });
        towerSprite.on('pointerout', () => {
            area.visible = false;
        });
        return area;
    }

    registerTowerSprite(tower) {
        const towerSprite = this.textureProvider.getSpriteByTexture(tower.typeid);
        const area = this.createTowerArea(tower, towerSprite);
        const placeSprite = () => {
            towerSprite.position.set(tower.tilePosition.x * this.tileWidth, tower.tilePosition.y * this.tileHeight);
            this.textureProvider.scaleElements(towerSprite);
        };

        placeSprite();
        this.registerResizer(towerSprite, placeSprite);

        towerSprite.interactive = true;
        towerSprite.on('pointertap', () => {
            this.bus.emit(Events.SHOW_TOWER_INFO, {
                damage: tower.damage,
                aspeed: (1000 / tower.period).toFixed(2)
            });
        });
        this.areasContainer.addChild(area);
        this.pane.addChild(towerSprite);
        this.towersSprites.set(tower.id, {sprite: towerSprite, typeid: tower.typeid});
    }
}
