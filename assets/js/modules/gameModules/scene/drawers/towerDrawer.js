import ElementDrawer from './elemDrawer';
import Events from '../../../../events';

export default class TowerDrawer extends ElementDrawer {
    constructor(gameScene,parent, animationService) {
        super(gameScene, animationService);
        this.pane = new this.pixi.Container();
        this.towersSprites = new Map();
        parent.addChild(this.pane);

    }

    getTower(id){
        return this.towersSprites.get(id);
    }

    updateTowerSprites() {
        this.state.towers
            .filter(tower => !this.towersSprites.has(tower.id))
            .forEach(tower => this.registerTowerSprite(tower));
    }

    registerTowerSprite(tower) {
        const towerSprite = this.textureProvider.getSpriteByTexture(tower.typeid);

        const placeSprite = () => {
            towerSprite.position.set(tower.titlePosition.x * this.titleWidth, tower.titlePosition.y * this.titleHeight);
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

        this.pane.addChild(towerSprite);
        this.towersSprites.set(tower.id, {sprite: towerSprite, typeid: tower.typeid});
    }
}
