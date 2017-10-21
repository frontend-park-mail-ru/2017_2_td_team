import {describe, expect, it} from '../helpers/jasmineES6.js';
import {About} from '../../www/js/blocks/about/index.js';
import {injectBlockNodeAccessor} from '../helpers/nodeAccessorMixin.js';

describe('About', () => {
    it('Полностью рендерится из шаблона', () => {
        const about = new AboutPage();
        const node = injectBlockNodeAccessor(about).node;
        expect(node.childNodes.length === 3);
        const childs = Array
            .from(node.childNodes)
            .map(elem => elem.tagName.toLowerCase());
        expect(childs).toEqual([
            'span',
            'br',
            'a',
        ]);
    });
});
