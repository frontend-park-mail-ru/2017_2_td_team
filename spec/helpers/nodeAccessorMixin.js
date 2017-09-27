export const injectNodeAccessor = (elem, nodePropery) => {
    Object.assign(elem.__proto__, elem);
};


const createNodeAccessorMixin = (nodeProperty) => {
    return {
        get node() {
            return this[nodeProperty];
        }
    };
};
