export const injectNodeAccessor = (elem, nodePropery) => {
    Object.assign(elem.__proto__, createNodeAccessorMixin(elem, nodePropery));
    return elem;
};

export const injectBlockNodeAccessor = (elem) => {
    return injectNodeAccessor(elem, '_element');
};

const createNodeAccessorMixin = (elem, nodeProperty) => {
    return {
        get node() {
            return elem[nodeProperty];
        }
    };
};
