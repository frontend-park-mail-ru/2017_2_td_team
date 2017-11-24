import './hud__score.styl';
import Block from '../../block/block.js';

export default class Score extends Block {
    constructor(nickname, scores) {
        super(document.createElement('div'));
        this._element.className = 'hud__score';
        this._nickanme = nickname;
        this._text = document.createElement('div');
        this._text.className = 'hud__score__text';

        this.setScores(scores);
        this._element.appendChild(this._text);
    }

    setScores(scores) {
        this._text.textContent = `${this._nickanme}: ${scores}`;
    }
}
