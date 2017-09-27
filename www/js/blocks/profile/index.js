import {Block} from '../block/index.js';
import {Form} from '../form/index.js';

/**
 * Компонент профиля пользователя
 * @module Profile
 */
export class Profile extends Block {
    /**
     * Констуирует Profile и устанавливает шаблон для генерации соответствующего html
     * [Шаблон]@link{'profile.pug'}
     *
     * @param {Function}template функция-шаблонизатор
     */
    constructor(template) {
        super(document.createElement('div'));
        this._template = template;
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
