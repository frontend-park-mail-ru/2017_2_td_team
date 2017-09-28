import {Block} from '../block/index.js';

/**
 * Компонент формы
 *
 * @module Form
 */
export class Form extends Block {

    /**
     * Конструирует компонент формы из переданных параметров
     *
     * @param {Button}submitButton - кнопка отправки формы
     * @param {Array<InputBlock>}inputs - список блоков ввода
     * @param {*}attrs - объект с полями, содержищими аттрибуты компонента
     * @param {Array<string>}classes - список классов компонента
     */
    constructor(submitButton = null, inputs = [], attrs = {}, classes = []) {
        const form = document.createElement('form');
        super(form);
        inputs.forEach(field => this.append(field));

        for (let key in this._element.elements) {
            if (this._element.elements[key].tagName === 'INPUT') {
                this._element.elements[key].setCustomValidity('Field is empty');
            }
        }

        if (submitButton) {
            this.append(submitButton);
        }
        this.setAttributes(attrs);
        this.setClasses(classes);
    }

    /**
     * Извлекает поля ввода и их значения из domNode формы
     * @param {*}rawForm - node формы
     * @returns {*}
     */
    static ExtractFormData(rawForm) {
        const formdata = {};
        const elements = rawForm.elements;
        for (let key in elements) {
            formdata[key] = elements[key].value;
        }
        return formdata;
    }

    /**
     * Задает callback на обработку данных формы при вводе в поле
     *
     * @param {Function}callback - callback на input для обработки данных формы
     */
    onInput(callback) {
        const elements = this._element.elements;

        for (let key in elements) {
            const element = elements[key];

            if (element.tagName.toLowerCase() === 'input'){
                element.addEventListener('input', event => {
                    callback(event.target, this._element);
                });
            }
        }
    }

    /**
     * Задает callback на обработку данных формы при ее отправке
     *
     * @param {Function}callback - callback на submit для обработки данных формы
     */
    onSubmit(callback) {
        this._element.addEventListener('submit', event => {
            event.preventDefault();
            const formdata = Form.ExtractFormData(event.target);
            callback(formdata);
        });
    }

}
