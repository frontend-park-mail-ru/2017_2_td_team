import Block from '../block/index.js';

export class Form extends Block {

    constructor(submitButton = null, inputs = [], attrs = {}, classes = []) {
        const form = document.createElement('form');
        super(form);
        inputs.forEach(field => this.append(field));
        if (submitButton) {
            this.append(submitButton);
        }
        this.setAttributes(attrs);
        this.setClasses(classes);
    }

    static ExtractFormData(rawForm) {
        const formdata = {};
        const elements = rawForm.elements;
        for (let key in elements) {
            formdata[key] = elements[key].value;
        }
        return formdata;
    }

    onSubmit(callback) {
        this._element.addEventListener('submit', event => {
            event.preventDefault();
            const formdata = Form.ExtractFormData(event.target);
            callback(formdata);
        });
    }
}
