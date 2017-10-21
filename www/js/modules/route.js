export default class Route {

    constructor(view) {
        this.view = view;
        this.rendered = false;
    }

    prepare() {
        if (!this.rendered) {
            this.view.render();
            this.rendered = true;
        }
    }

}
