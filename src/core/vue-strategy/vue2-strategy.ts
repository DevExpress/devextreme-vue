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

    mount(options) {
        return new Vue(options);
    }
    
    destroy(component) {
        return component.$destroy.bind(component);
    }

    getComponentOptions(component) {
        return component.componentOptions
    }
    
    getComponentCtor(component) {
        return component.componentOptions && component.componentOptions.Ctor
    }
    
    getVNodeProps(node) {
        return node.componentOptions.propsData;
    }
}