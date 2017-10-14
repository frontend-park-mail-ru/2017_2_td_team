import Block from '../block/index.js';

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
            this.setClasses(description.classes);
            this._element.innerHTML = window.inputBlockTemplate({field: description});
        }
    }
}


