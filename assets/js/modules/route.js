export default class Route {

    constructor(title, view) {
        this.title = title;
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
