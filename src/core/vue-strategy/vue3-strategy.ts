import * as VueType from "vue";
const Vue = VueType.default || VueType;

export class vue3Strategy {
    constructor() {}
    vNodeComponentOptions(component) {
        if(component.$) {
            return component.$.vnode.type;
        }

        return component.type;
    }

    configurationChildren(component) {
        const configComponents = [];
        if(!component.children) {
            return;
        }
        this.findConfigurationComponents(component.children.default(), configComponents);
        return configComponents;
    }

    findConfigurationComponents(allCildren, configComponents) {
        allCildren.forEach(child => {
            if(child.type && typeof child.type === "object") {
                child.type = {...child.type};
                delete child.type.$_config;
                delete child.type.$_innerChanges;
                configComponents.push(child);
            }
        });
    }

    configurationOptions(component) {
        return this.componentOptions(component);
    }

    componentOptions(component) {
        return component.type;
    }

    usedProps(component) {
        return component.$.vnode.props;
    }

    usedConfigurationProps(node) {
        return node.props;
    }

    create(config) {
        return (Vue as any).defineComponent(config);
    }

    mount(options) {
        return (Vue as any).createApp(options).mount(options.el);
    }
    
    destroy(component) {
        return component.$.appContext.app.unmount.bind(component);
    }

    defaultSlots(component) {
        const templates = this.declaredTemplates(component);
        if(!templates.default) {
            return;
        }
        return templates.default();
    }

    declaredTemplates(component) {
        return component.$slots;
    }

    configurationProps(node) {
        const options = this.vNodeComponentOptions(node);
        if(!options && !options.props) {
            return {};
        }
        return options.props;
    }

    configurationTemplate(node) {
        return this.configurationDefaultTemplate(node);
    }

    configurationDefaultTemplate(node) {
        if(!node.children || node.children === "object" || !node.children.default) {
            return;
        }
        this.hasInlineTemplate(node.children.default());

        return this.hasInlineTemplate(node.children.default()) ? node.children.default : null;
    }

    hasInlineTemplate(allCildren) {
        let hasTemplate = false;
        allCildren.forEach(child => {
            if(!(child.type && typeof child.type === "object" && child.type.$_optionName)) {
                hasTemplate = true;
            }
        });
        return hasTemplate;
    }

    children(component) {
        const allChildren = [];
        if(!this.hasChildren(component)) {
            return allChildren;
        }
        this.getVNodeChildren(component.$.vnode.children.default(), allChildren, component.$_config.nested);
        return allChildren;
    }

    getVNodeChildren(children, allChildren, nested) {
        children.forEach((child, index) => {
            if(child.type && typeof child.type === "object") {
                child.type = {...child.type};
                child.type.$_config = nested[index];
                allChildren.push(child);
                if(child.children && child.children.default) {
                    this.getVNodeChildren(child.children.default(), allChildren, nested[index].nested);
                }
            }
        });
    }

    hasChildren(component) {
        return component.$.vnode && component.$.vnode.children && component.$.vnode.children.default
    }
}