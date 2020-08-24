import * as VueType from "vue";
const Vue = VueType.default || VueType;

export class vue3Strategy {
    constructor() {}
    create(config) {
        return (Vue as any).defineComponent(config);
    }
    getProps(component) {
        return component.$.vnode.props;
    }
    getDefaultSlots(component) {
        if(!component.$slots.default) {
            return;
        }
        return component.$slots.default();
    }
    getNamedTemplates(component) {
        return component.$slots;
    }
}