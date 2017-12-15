import ElementDrawer from './elemDrawer';
import Events from '../../../../events';

export default class MapDrawer extends ElementDrawer {
    constructor(gameScene, parent) {
        super(gameScene, null);
        this.pane = new this.pixi.Container();
        this.titlesSprites = [];
        parent.addChild(this.pane);
    }

    createGameMap() {
        const map = this.state.map.titles;
        for (let j = 0; j < map.length; ++j) {
            this.titlesSprites.push([]);
            for (let i = 0; i < map[j].length; ++i) {
                const titleType = map[j][i];
                this.createTitle({x: i, y: j}, titleType);
            }
        }
    }

    createTitle(coord, titleType) {
        const title = this.textureProvider.getScaledSprite(titleType);

        const titlePlacer = () => {
            title.width = this.titleWidth;
            title.height = this.titleHeight;
            title.position.set(coord.x * this.titleWidth, coord.y * this.titleHeight);
        };

        titlePlacer();
        this.registerResizer(title, titlePlacer);

        title.interactive = true;

        title.on('pointerover', () => {
            title.alpha = 0.7;
        });

        title.on('pointerout', () => {
            title.alpha = 1;
        });

        title.on('pointertap', () => {
            this.bus.emit(Events.TITLE_CLICKED, {coord, titleType});
        });

        this.titlesSprites[coord.y].push(title);
        this.pane.addChild(title);
    }
}
