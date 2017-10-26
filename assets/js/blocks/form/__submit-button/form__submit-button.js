import './form__submit-button.css';

import Block from '../../block/block.js';

/**
 * Компонент кнопки
 *
 * @module Button
 */
export default class SubmitButton extends Block {
    /**
     * Конструирует кнопку по ее описанию
     *
     * @param description - описание, содержит  поля {*}attrs с аттрибутами, {Array<string>}classes с классами, {String}text с текстом
     */
    constructor(description) {
        const button = document.createElement('button');
        super(button);
        if (description) {
            const classes = description.classes;
            classes.push('form__submit-button');
            this.setClasses(classes);
            this.setAttributes(description.attrs);
            this.text = description.text;
        }
    }
}
