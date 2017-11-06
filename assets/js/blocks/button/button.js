import './button.styl';

import Block from '../block/block.js';

/**
 * Компонент кнопки
 *
 * @module Button
 */
export default class Button extends Block {
    /**
     * Конструирует кнопку по ее описанию
     *
     * @param description - описание, содержит  поля {*}attrs с аттрибутами, {Array<string>}classes с классами, {String}text с текстом
     */
    constructor(description) {
        const button = document.createElement('a');
        super(button);
        if (description) {
            const classes = description.classes;
            classes.push('button');
            this.setClasses(classes);
            this.setAttributes(description.attrs);
            this.text = description.text;
        }
    }

    injectTo(destination) {
        destination.appendChild(this._element);
    }
}
