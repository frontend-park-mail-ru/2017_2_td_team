import './hud__speed.styl';
import Block from '../../block/block.js';

export default class Speed extends Block {
    constructor(money) {
        super(document.createElement('div'));
        this._element.className = 'hud__speed';

        this._icon = document.createElement('div');
        this._icon.className = 'hud__speed__icon';

        this._text = document.createElement('div');
        this._text.className = 'hud__speed__text';
        this.setSpeed(money);

        this._element.appendChild(this._icon);
        this._element.appendChild(this._text);
    }

    setSpeed(speed) {
        this._text.innerHTML = `${speed}`;
    }
}
