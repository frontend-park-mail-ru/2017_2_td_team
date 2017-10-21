import Block from '../block/index.js';
import Form from '../form/index.js';

/**
 * Компонент профиля пользователя
 * @module Profile
 */
export default class Profile extends Block {
    /**
     * Конструирует Profile и устанавливает шаблон для генерации соответствующего html.
     *
     * @param {*}attrs - объект с полями, содержищими аттрибуты компонента
     * @param {Array<string>}classes - список классов компонента
     */
    constructor(attrs = {}, classes = []) {
        super(document.createElement('div'));
        this._template = window.profileTemplate;
        this.setClasses(classes);
        this.setAttributes(attrs);
    }

    /**
     * Задает html через вызов функции-шаблонизатора с заданным контекстом
     *
     * @param {*}renderContext - контекст функции-шаблонизатора
     */
    setContent(renderContext) {
        this._element.innerHTML = this._template({context: renderContext});
    }

    /**
     * Устанавливает коллбек на обновление профиля пользователя
     *
     * @param {Function}callback - коллбек, срабатывающий при отправке формы обновления
     */
    onUpdate(callback) {
        this.on('submit', event => {
            event.preventDefault();
            const formdata = Form.ExtractFormData(event.target);
            callback(formdata);
        });
    }
}
