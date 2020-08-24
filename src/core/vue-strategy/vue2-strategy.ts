import * as VueType from "vue";
const Vue = VueType.default || VueType;

export class vue2Strategy {
    constructor() {}
    create(config) {
        return Vue.extend(config);
    }
    getProps(component) {
        return component.$options.propsData;
    }
    getDefaultSlots(component) {
        if(!component.$slots.default) {
            return;
        }
        return component.$slots.default;
    }
    getNamedTemplates(component) {
        return component.$scopedSlots;
    }
}