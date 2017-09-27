import {Block} from '../block/index.js';
import {Form} from '../form/index.js';

export class Profile extends Block {
    constructor(template) {
        super(document.createElement('div'));
        this._template = template;
    }

    setContent(renderContext) {
        this._element.innerHTML = this._template({context: renderContext});
    }

    onUpdate(callback) {
        this.on('submit', event => {
            event.preventDefault();
            const formdata = Form.ExtractFormData(event.target);
            callback(formdata);
        });
    }
}
