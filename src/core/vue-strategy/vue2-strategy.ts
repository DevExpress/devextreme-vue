import * as VueType from "vue";
const Vue = (VueType as any).default || VueType;

export class Vue2Strategy {
    public configurationChildren(component) {
        const configComponents = [];
        const children = component.componentOptions.children;
        if (!children) {
            return;
        }
        this.findConfigurationComponents(component.componentOptions.children, configComponents);
        return configComponents;
    }

    public vNodeComponentOptions(component) {
        if (!component.$vnode) {
            return this.componentOptions(component);
        }
        return component.$vnode.componentOptions;
    }

    public childrenToUpdate(component) {
        return this.children(component);
    }

    public configurationOptions(component) {
        const componentOptions = this.componentOptions(component);
        return componentOptions && componentOptions.Ctor;
    }

    public componentInfo(component) {
        const componentOptions = this.componentOptions(component);
        return componentOptions && componentOptions.Ctor.options.data();
    }

    public componentOptions(component) {
        return component.componentOptions;
    }

    public usedConfigurationProps(node) {
        return node.componentOptions.propsData;
    }

    public create(config) {
        return Vue.extend(config);
    }

    public mount(options) {
        return new Vue(options);
    }

    public destroy(component) {
        return component.$destroy.bind(component);
    }

    public usedProps(component) {
        return component.$options.propsData;
    }

    public defaultSlots(component) {
        if (!component.$slots.default) {
            return;
        }
        return component.$slots.default;
    }

    public declaredTemplates(component) {
        return component.$scopedSlots;
    }

    public configurationProps(node) {
        return node.$props;
    }

    public configurationTemplate(component) {
        return component.$vnode.data && component.$vnode.data.scopedSlots;
    }

    public configurationDefaultTemplate(component) {
        return component.$scopedSlots && component.$scopedSlots.default;
    }

    public children(component) {
        return component.$children;
    }

    private findConfigurationComponents(allCildren, configComponents) {
        allCildren.forEach((child) => {
            if (child.componentOptions) {
                configComponents.push(child);
            }
        });
    }
}
