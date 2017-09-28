import Block from '../block/index.js';

export class LogoSpinner extends Block {

    constructor(text, attrs = {}, classes = []) {
        super(document.createElement('div'));

        classes.push('logo-spinner');
        this.setClasses(classes);
        this.setAttributes(attrs);
        this.text = text;

        this.generateSpinner();
    }


    generateSpinner() {        
        const image = [
            [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0],
            [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
            [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
            [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
            [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0],
            [0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
        ];

        image.forEach((row, j) => row.forEach((pixel, i, pixels) => {
            let pixelElement = document.createElement('div');
            pixelElement.className = 'pixel';

            if (pixel) {
                pixelElement.style.animationDelay = `${0.2 * (i + j)}s`;
                pixelElement.style.backgroundColor = 'red';
            } else {
                pixelElement.style.backgroundColor = 'transparent';
            }

            this._element.append(pixelElement);
            if (i === pixels - 1 && j !== rows - 1) {
                this._element.append(document.createElement('br'));
            }
        }));
    }
}
