import './notifications__notification.styl';
import Block from '../../block/block.js';
import CloseButton from './__close-button/notifications__notification__close-button';

export default class Notification extends Block {
    constructor(container, message, duration) {
        super(document.createElement('div'));
        this._container = container;
        this._message = message;
        if (duration) {
            this._duration = duration;
        } else {
            this._duration = 5;
        }

        this._element.classList.add('notifications__notification');
        this._element.classList.add('notifications__notification_hidden');

        this.animationDelay = 0.5;
        this._element.style.transition = `
                margin ${this.animationDelay}s,
                padding ${this.animationDelay}s,
                max-height ${this.animationDelay}s,
                opacity ${this.animationDelay}s
            `;
        this._element.style.maxHeight = '0';

        this._element.innerHTML = message;

        const closeButton = new CloseButton();
        this.append(closeButton);
        closeButton.on('click', () => this.close());
    }

    show() {
        this._container.classList.remove('notifications_hidden');

        if (this._duration) {
            setTimeout(() => this.close(), this._duration * 1000);
        }

        this._container.insertAdjacentElement('afterbegin', this._element);

        // Чтобы сработал transition
        setTimeout(() => {
            this._element.classList.remove('notifications__notification_hidden');
            this._element.style.maxHeight = '100%';

            // Чтобы не дергалась анимация закрытия
            setTimeout(() => this._element.style.maxHeight = `${this._element.offsetHeight}px`,
                this.animationDelay * 1000);

        }, 100);
    }

    close() {
        this._element.classList.add('notifications__notification_hidden');
        this._element.style.maxHeight = '0';
        this._element.addEventListener('transitionend', () => {
            this._element.remove();
            if (!this._container.innerHTML) {
                this._container.classList.add('notifications_hidden');
            }
        });
    }

    set message(text) {
        this._element.innerHTML = text;
    }

    get message() {
        return this._element.innerHTML;
    }
}
