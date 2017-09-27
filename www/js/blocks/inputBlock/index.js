import {Block} from '../block/index.js';

/**
 * Компонент блока ввода
 *
 * @module InputBlock
 */
export class InputBlock extends Block {
    /**
     * Конструирет компонент ввода по переданному описанию
     *  {@link 'inputBlock.pug'}
     * @param {*}description - описание блока
     */
    constructor(description) {
        const input = document.createElement('div');
        super(input);
        this.setClasses(description.classes);
        this._element.innerHTML = window.inputBlockTemplate({field: description});
    }
}


