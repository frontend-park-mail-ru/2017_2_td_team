import {describe} from '../helpers/jasmineES6.js';
import {Logo} from '../../www/js/blocks/logo/index.js';

describe('Logo', () => {
    it('По-умолчанию создается пустой логотип', () => {
        const logo = new Logo();
        expect(logo.innerHTML).toBe('');
        const node = injectBlockNodeAccessor(button).node;
        expect(node.tagName.toLowerCase()).toBe('div');
        expect(node.attributes.length).toBe(0);
        expect(node.classList.length).toBe(0);
    });

    it('Конструктор создает логотип по описанию', () => {
        const logo = new Logo('logo', {'name': 'somename'}, ['someclass']);
        const node = injectBlockNodeAccessor(logo).node;
        expect(node.classList.length).toBe(1);
        expect(node.classList[0]).toBe('someclass');
        expect(node.attributes.length).toBe(1);
        expect(node.getAttribute('name')).toBe('somename');
        expect(node.text).toBe('logo');
    });
});
