import {describe, expect, it} from '../helpers/jasmineES6.js';
import Button from '../assets/js/blocks/button/button.js';
import {injectBlockNodeAccessor} from '../helpers/nodeAccessorMixin.js';

describe('Button', () => {
    it('конструктор создает пустую кнопку по-умолчанию', () => {
        const button = new Button();
        expect(button.html).toBe('');
        const node = injectBlockNodeAccessor(button).node;
        expect(node.tagName.toLowerCase()).toBe('button');
        expect(node.attributes.length).toBe(0);
        expect(node.classList.length).toBe(0);
    });
    it('конструктор создает button с name="someattr", классом "someclass" и надписью "text"', () => {
        const button = new Button({
            classes: ['someclass'],
            attrs: {name: 'someattr'},
            text: 'text',
        });
        expect(button.text).toBe('text');
        const node = injectBlockNodeAccessor(button).node;

        expect(node.classList.length).toBe(1);
        expect(node.classList[0]).toBe('someclass');
        expect(node.getAttribute('name')).toBe('someattr');

    });
});
