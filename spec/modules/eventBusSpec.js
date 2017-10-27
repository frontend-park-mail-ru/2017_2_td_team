
import {describe, expect} from '../helpers/jasmineES6';
import {EventBus} from '../../www/js/modules/eventBus.js';

describe('Event bus', () => {
    it('Регистрирует обработчики', () => {
        const bus = new EventBus();
        const target1 = {};
        const target2 = {};

        bus.register('test:event1', (event, context) => target1[event] = context.value);
        bus.register('test:event2', (event, context) => target2[event] = context.value);

        bus.emit('test:event1', {value: 'target 1'});
        bus.emit('test:event2', {value: 'target 2'});
        expect(target1['test:event1']).toBe('target 1');
        expect(target2['test:event2']).toBe('target 2');
    });

    it('Позволяет отписаться от событий', () => {
        const bus = new EventBus();
        const target = {};
        const off = bus.register('event', (event, context) => target[event] = context.value);
        bus.emit('event', {value:'target'});
        expect(target['event']).toBe('target');
        off();
        bus.emit('event', {value:'not expected'});
        expect(target['event']).toBe('target');
    });

});
