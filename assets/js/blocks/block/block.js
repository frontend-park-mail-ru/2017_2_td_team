import './block.css';

/**
 * Базовый компонент, на основе которого строятся остальные компоненты
 * Представляет собой обертку над DOM Node
 * @module Block
 */

export default class Block {

    /**
     * Конструирует компонент из DOM Node
     *
     * @param {*}element - DOM Node
     */
    constructor(element = document.createElement('div')) {
        this._element = element;
    }

    /**
     * setter для textContent
     *
     * @param {string}content - текст для помещения в innerText
     */
    set text(content) {
        this._element.textContent = content;
    }

    /**
     * getter для textContent
     *
     * @returns {string}
     */
    get text(){
        return this._element.textContent;
    }

    /**
     * setter для innerHTML
     *
     * @param {string}inner - текст для помещения в innerHTML
     */
    set html(inner) {
        this._element.innerHTML = inner;
    }

    /**
     *  getter для innerHTML
     *
     * @returns {string}
     */
    get html() {
        return this._element.innerHTML;
    }

    /**
     * getter для атрибута id компонента
     *
     * @returns {string}
     */
    get id() {
        return this._element.id;
    }

    /**
     * setter для атрибута id компонента
     *
     * @param {string}identifier
     */
    set id(identifier) {
        this._element.setIdAttribute(identifier);
    }

    /**
     * Фабричный метод для создания компонентов с заданными параметрами
     *
     * @param {string}tag - тег компонента
     * @param {*}attrs - объект с полями, содержащими атрибуты компонента
     * @param {Array<string>}classes - список классов компонента
     * @param {string}text - innerText компонента
     */
    static Create(tag = 'div', attrs = {}, classes = [], text = null) {
        const block = new Block(document.createElement(tag));
        block.setAttributes(attrs);
        block.setClasses(classes);
        block.text = text;
        return block;
    }

    /**
     * Добавляет в компонент все атрибуты из attr
     * @param {*}attrs - объект с полями, содержащими атрибуты
     */
    setAttributes(attrs = {}) {
        for (let key in attrs) {
            this._element.setAttribute(key, attrs[key]);
        }
    }

    /**
     * Добавляет в список классов компонента все классы из classes
     * @param {Array<string>}classes - список классов
     */
    setClasses(classes = []) {
        classes.forEach(className => this._element.classList.add(className));
    }

    /**
     * Заменяет весь innerHTML компонента пустой строкой
     *
     * @returns {Block}
     */
    clear() {
        this._element.innerHTML = '';
        return this;
    }

    /**
     * Устанавливает аттрибут hidden компонента в true
     *
     * @returns {Block}
     */
    hide() {
        this._element.hidden = true;
        return this;
    }

    /**
     * Устанавливает аттрибут hidden компонента в false
     *
     * @returns {Block}
     */
    show() {
        this._element.hidden = false;
        return this;
    }

    /**
     * Инвертирует аттрибут hidden компонента
     *
     * @returns {Block}
     */
    toggle() {
        this._element.hidden = !this._element.hidden;
        return this;
    }

    /**
     * Добавляет к компоненту дочерний компонент и возвращает компонент-родитель
     *
     * @param {Block}element - компонент для добаления
     * @returns {Block}
     */
    append(element) {
        this._element.appendChild(element._element);
        return this;
    }

    /**
     * Устанавливает callback на переданный event.type .
     * Возвращает функцию, снимающую данный callback с event.
     *
     * @param {string}event - тип события, на который устанавливается callback
     * @param {Function}callback - функция, вызываемая при наступлении события
     * @returns {function(this:Block)}
     */
    on(event, callback) {
        this._element.addEventListener(event, callback);
        return function () {
            this._element.removeEventListener(event);
        }.bind(this);
    }

    injectTo(destination) {
        destination.appendChild(this._element);
    }
}
