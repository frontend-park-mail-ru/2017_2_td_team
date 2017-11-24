import './logo-spinner.styl';

import Block from '../block/block.js';

export default class LogoSpinner extends Block {

    constructor(text, attrs = {}, classes = []) {
        super(document.createElement('div'));
        classes.push('logo-spinner__overlay');

        this.setClasses(classes);
        this.setAttributes(attrs);
        this.text = text;

        this._element.appendChild(this.generateSpinner());
    }

    generateSpinner() {
        const spinner = document.createElement('div');
        spinner.classList.add('logo-spinner');

        const image = [
            [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0],
            [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
            [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
            [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
            [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0],
            [0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        ];

        image.forEach((row, j) => row.forEach((pixel, i) => {
            let pixelElement = document.createElement('div');
            pixelElement.className = 'logo-spinner__pixel';

            if (pixel) {
                pixelElement.style.animationDelay = `${0.1 * (i + j)}s`;
            } else {
                pixelElement.style.visibility = 'hidden';
            }

            spinner.appendChild(pixelElement);
        }));

        return spinner;
    }

    show() {
        this._element.style.opacity = 1;
        this._element.addEventListener('transitionend', () => this._element.style.display = '', true, true, 'opacity');
    }

    hide() {
        this._element.style.opacity = 0;
        this._element.addEventListener('transitionend', () => this._element.style.display = 'none', true, true, 'opacity');
    }
}
