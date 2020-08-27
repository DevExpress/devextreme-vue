import * as VueType from "vue";
const Vue = VueType.default || VueType;

export class vue2Strategy {
    constructor() {}
    configurationChildren(component) {
        const configComponents = [];
        const children = component.componentOptions.children;
        if(!children) {
            return;
        }
        this.findConfigurationComponents(component.componentOptions.children, configComponents);
        return configComponents;
    }

    vNodeComponentOptions(component) {
        if(!component.$vnode) {
            return this.componentOptions(component);
        }
        return component.$vnode.componentOptions;
    }

    findConfigurationComponents(allCildren, configComponents) {
        allCildren.forEach(child => {
            if(child.componentOptions) {
                configComponents.push(child);
            }
        });
    }

    configurationOptions(component) {
        const componentOptions = this.componentOptions(component);
        return componentOptions && componentOptions.Ctor;
    }

    componentOptions(component) {
        return component.componentOptions;
    }

    usedConfigurationProps(node) {
        return node.componentOptions.propsData;
    }

    create(config) {
        return Vue.extend(config);
    }

    mount(options) {
        return new Vue(options);
    }
    
    destroy(component) {
        return component.$destroy.bind(component);
    }

    usedProps(component) {
        return component.$options.propsData;
    }

    defaultSlots(component) {
        if(!component.$slots.default) {
            return;
        }
        return component.$slots.default;
    }

    declaredTemplates(component) {
        return component.$scopedSlots
    }

    configurationProps(node) {
        return node.$props;
    }

    configurationTemplate(component) {
        return component.$vnode.data && component.$vnode.data.scopedSlots;
    }

    configurationDefaultTemplate(component) {
        return component.$scopedSlots && component.$scopedSlots.default;
    }

    children(component) {
        return component.$children;
    }
}