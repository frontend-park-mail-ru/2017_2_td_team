import {describe, expect} from '../helpers/jasmineES6';
import {InputBlock} from '../../www/js/blocks/inputBlock/index.js';
import {injectBlockNodeAccessor} from '../helpers/nodeAccessorMixin.js';

describe('InputBlock', () => {

    it('создается из шаблона по описанию', () => {
        const inputBlock = new InputBlock({
            name: 'somename',
            label: 'somelabel',
            type: 'text',
            classes: ['someclass'],
        });
        const node = injectBlockNodeAccessor(inputBlock).node;
        expect(node.tagName.toLowerCase()).toBe('div');
        expect(node.childNodes.length).toBe(2);
        expect(node.classList.length).toBe(1);
        expect(node.classList[0]).toBe('someclass');

        const label = node.childNodes[0];
        expect(label.tagName.toLowerCase()).toBe('label');
        expect(label.name).toBe('somename');
        expect(label.text).toBe('somelabel');

        const input = node.childNodes[1];
        expect(input.tagName.toLowerCase()).toBe('input');
        expect(input.type).toBe('text');
    });
});