import ElementDrawer from './elemDrawer';
import Events from '../../../../events';

export default class MapDrawer extends ElementDrawer {
    constructor(gameScene, parent) {
        super(gameScene, null);
        this.pane = new this.pixi.Container();
        this.tilesSprites = [];
        parent.addChild(this.pane);
    }

    createGameMap() {
        const map = this.state.map.tiles;
        for (let j = 0; j < map.length; ++j) {
            this.tilesSprites.push([]);
            for (let i = 0; i < map[j].length; ++i) {
                const tileType = map[j][i];
                this.createTile({x: i, y: j}, tileType);
            }
        }
    }

    createTile(coord, tileType) {
        const tile = this.textureProvider.getScaledSprite(tileType);

        const tilePlacer = () => {
            tile.width = this.tileWidth;
            tile.height = this.tileHeight;
            tile.position.set(coord.x * this.tileWidth, coord.y * this.tileHeight);
        };

        tilePlacer();
        this.registerResizer(tile, tilePlacer);

        tile.interactive = true;

        tile.on('pointerover', () => {
            tile.alpha = 0.7;
        });

        tile.on('pointerout', () => {
            tile.alpha = 1;
        });

        tile.on('pointertap', () => {
            this.bus.emit(Events.TILE_CLICKED, {coord, tileType});
        });

        this.tilesSprites[coord.y].push(tile);
        this.pane.addChild(tile);
    }
}
