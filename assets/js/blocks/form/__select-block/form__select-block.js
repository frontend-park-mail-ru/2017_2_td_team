import './form__select-block';

import Block from '../../block/block.js';
import template from './select-block.pug';

/**
 * Компонент выпадающего списка
 *
 * @module SelectBlock
 */
export default class SelectBlock extends Block {
    /**
     * Конструирет компонент выпадающего списка по переданному описанию
     *
     * @param {*}description - описание блока
     */
    constructor(description) {
        const select = document.createElement('select');
        super(select);
        select.name = description.name;
        if (description) {
            this.setClasses(['form__select-block']);
            this._element.innerHTML = template({fields: description});
        }
    }
}
