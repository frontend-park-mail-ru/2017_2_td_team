import {describe, expect, it} from '../helpers/jasmineES6.js';
import {injectBlockNodeAccessor} from '../helpers/nodeAccessorMixin.js';
import Button from '../assets/js/blocks/button/button.js';
import InputBlock from '../assets/js/blocks/form/__input-block/form__input-block.js';
import Form from '../assets/js/blocks/form/form.js';

describe('Form', () => {
    it('По-умолчанию создается пустая форма', () => {
        const form = new Form();
        const node = injectBlockNodeAccessor(form).node;
        expect(node.tagName.toLowerCase()).toBe('form');
        expect(node.attributes.length).toBe(0);
        expect(node.classList.length).toBe(0);
        expect(node.childNodes.length).toBe(0);
    });


    it('Конструктор созает форму из переданных объектов', () => {

        const button = new Button({
            attrs: {
                type: 'submit'
            },
            text: 'text',
            classes: ['someclass'],
        });
        const inputBlock = new InputBlock({
            type: 'text',
            label: 'someinput',
            name: 'input-name',
            classes: ['someclass'],
        });
        const form = new Form(button, [inputBlock], {'name': 'somename'}, ['someclass']);

        const node = injectBlockNodeAccessor(form).node;

        expect(node.childNodes.length).toBe(2);
        expect(node.childNodes[0]).toBe(injectBlockNodeAccessor(inputBlock).node);
        expect(node.childNodes[1]).toBe(injectBlockNodeAccessor(button).node);
        expect(node.getAttribute('name')).toBe('somename');
        expect(node.classList.length).toBe(1);
        expect(node.classList[0]).toBe('someclass');
    });

    it('Устанавливает callback на отпраку формы', done => {

        const form = new Form();
        form.onSubmit(() => {
            done();
        });
        const event = new Event('submit');
        injectBlockNodeAccessor(form).node.dispatchEvent(event);
    }, 5000);
});
