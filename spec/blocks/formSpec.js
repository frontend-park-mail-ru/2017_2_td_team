import {describe, expect} from '../helpers/jasmineES6';
import {injectBlockNodeAccessor} from '../helpers/nodeAccessorMixin';
import {Button} from '../../www/js/blocks/buttons/index';
import {InputBlock} from '../../www/js/blocks/inputBlock/index';

describe('Form', () => {
    it('По-умолчанию создается пустая форма', () => {
        const form = new Form();
        const node = injectBlockNodeAccessor(form).node;
        expect(node.tagName.toLowerCase()).toBe('div');
        expect(node.attributes.length).toBe(0);
        expect(node.classList.length).toBe(0);
        expect(node.childNodes.length).toBe(0);
    });

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

    it('Конструктор созает форму из переданных объектов', () => {

        const form = new Form(button, [inputBlock], {'name': 'somename'}, ['someclass']);

        const node = injectBlockNodeAccessor(form).node;

        expect(node.childNodes.length).toBe(2);
        expect(node.childNodes[0]).toBe(injectBlockNodeAccessor(button).node);
        expect(node.childNodes[1]).toBe(injectBlockNodeAccessor(inputBlock).node);
        expect(node.getAttribute('name')).toBe('somename');
        expect(node.classList.length).toBe(1);
        expect(node.classList[0]).toBe('someclass');
    });

    it('Устанавливает callback на отпраку формы', done => {
        const form = new Form();
        form.onSubmit(formdata => {
            expect(formdata).toBe({});
            done();
        });
        const event = new Event('submit');
        injectBlockNodeAccessor(form).node.dispatchEvent(event);
    }, 5000);
});
