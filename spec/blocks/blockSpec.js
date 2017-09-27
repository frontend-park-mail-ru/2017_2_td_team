import {Block} from '../../www/js/blocks/block/index.js';
import {injectBlockNodeAccessor} from '../helpers/nodeAccessorMixin.js';

describe('Block', () => {
    it('Создает пустой div', () => {
        const block = new Block();
        const node = injectBlockNodeAccessor(block).node;
        expect(node.tagName.toLowerCase()).toBe('div');
        expect(block.html).toBe('');
    });

    it('Создает div с атрибутом "name" = "somename", классом "someclass" и текстом "text"', () => {
        let block = Block.Create('div', {'name': 'somename'}, ['someclass'], 'text');
        const node = injectBlockNodeAccessor(block).node;
        expect(node.tagName.toLowerCase()).toBe('div');
        expect(node.classList.contains('someclass')).toBeTruthy();
        expect(node.innerText).toBe('text');
        expect(node.getAttribute('name')).toBe('somename');
    });

    it(`Дает возможность записи innerHTML через .html <div></div>`, () => {
        const block = new Block();
        const node = injectBlockNodeAccessor(block).node;
        block.html = `<div></div>`;
        expect(node.innerHTML).toBe(`<div></div>`);
    });


    it('Добавляет блок-потомок через append()', () => {
        const parent = new Block();
        const parentNode = injectBlockNodeAccessor(parent).node;
        const child = new Block();
        parent.append(child);
        const childNode = injectBlockNodeAccessor(child).node;

        expect(parentNode.firstChild).toBe(childNode);
        expect(parentNode.childNodes.length).toBe(1);
    });

    it('Управляет event listner через on()', done => {
        const block = new Block();
        const node = injectBlockNodeAccessor(block).node;
        block.on('event', event => {
            expect(event.type).toBe('event');
            expect();
            done();
        });
        node
            .dispatchEvent(new Event('event'));
    }, 5000);


});

