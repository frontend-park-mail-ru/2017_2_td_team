import './hud__range.styl';
import Block from '../../block/block.js';

export default class Range extends Block {
    constructor(range) {
        super(document.createElement('div'));
        this._element.className = 'hud__range';

        this._icon = document.createElement('div');
        this._icon.className = 'hud__range__icon';

        this._text = document.createElement('div');
        this._text.className = 'hud__range__text';
        this.setRange(range);

        this._element.appendChild(this._icon);
        this._element.appendChild(this._text);
    }

    setRange(range) {
        this._text.innerHTML = `${range}`;
    }
}
