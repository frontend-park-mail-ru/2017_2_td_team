import './hud__money.styl';
import Block from '../../block/block.js';

export default class Money extends Block {
    constructor(money) {
        super(document.createElement('div'));
        this._element.className = 'hud__money';

        this._icon = document.createElement('div');
        this._icon.className = 'hud__money__icon';

        this._text = document.createElement('div');
        this._text.className = 'hud__money__text';
        this.setMoney(money);

        this._element.appendChild(this._icon);
        this._element.appendChild(this._text);
    }

    setMoney(money) {
        this._text.innerHTML = `${money}₽`;
    }
}
