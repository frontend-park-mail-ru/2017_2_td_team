import './form__input-block.css';

import Block from '../../block/block.js';
import template from './input-block.pug';

/**
 * Компонент блока ввода
 *
 * @module InputBlock
 */
export default class InputBlock extends Block {
    /**
     * Конструирет компонент ввода по переданному описанию
     *
     * @param {*}description - описание блока
     */
    constructor(description) {
        const input = document.createElement('div');
        super(input);
        if (description) {
            this.setClasses(['form__input-block']);
            this._element.innerHTML = template({field: description});
        }
    }
}


