import * as Vue from "vue";
import { pullAllChildren } from "../children-processing";
import { IEventBusHolder } from "../templates-discovering";
import { IVueStrategy } from "./index";

export class Vue3Strategy implements IVueStrategy {
    public vNodeComponentOptions(component, type) {
        if (component.$) {
            if (type) {
                return component.$.vnode.type;
            } else {
                return component.$.vnode;
            }
        }

        return component.type;
    }

    public configurationChildren(component) {
        const configComponents = [];
        if (!component.children) {
            return;
        }
        this.findConfigurationComponents(component.children.default(), configComponents);
        return configComponents;
    }

    public childExtension(component) {
        const vNode = this.vNodeComponentOptions(component, true);
        if (!vNode.$_isExtension) { return; }

        vNode.attachTo = vNode.$_componentInstance.attachTo;
        return vNode;
    }

    public childrenToUpdate(component) {
        const children = [];
        if (component.$_config.cleanNested) {
            component.$_config.cleanNested();
        }
        pullAllChildren(this.defaultSlots(component), children, component.$_config);
        return children;
    }

    public configurationOptions(component) {
        return this.componentOptions(component).type;
    }

    public componentInfo(component) {
        const options = this.configurationOptions(component);
        return options.data && options.data();
    }

    public componentOptions(component) {
        return component;
    }

    public usedProps(component) {
        return component.$.vnode.props;
    }

    public usedConfigurationProps(node) {
        return node.props;
    }

    public createComponent(config) {
        return (Vue as any).defineComponent(config);
    }

    public markAsExtention(component) {
        const vNodeOptions = this.vNodeComponentOptions(component, true);
        if (!vNodeOptions) { return; }

        vNodeOptions.$_isExtension = true;
        vNodeOptions.$_componentInstance = component;
    }

    public mountTemplate(options, updatedHandler) {
        const templateMixin = this.createComponent({
            created(this: any & IEventBusHolder) {
                options.parent.eventBus.on("updated", updatedHandler.bind(this));
            },
            unmounted() {
                options.parent.eventBus.off("updated", updatedHandler);
            }
        });
        options.mixins = [templateMixin];
        return (Vue as any).createApp(options).mount(options.el);
    }

    public destroy(component) {
        return component.$.appContext.app.unmount.bind(component);
    }

    public defaultSlots(component) {
        const templates = this.declaredTemplates(component);
        if (!templates.default) {
            return;
        }
        return templates.default();
    }

    public declaredTemplates(component) {
        return component.$slots;
    }

    public componentInstance(component) {
        return component.type ? component.type.$_componentInstance : component;
    }

    public configurationProps(node) {
        const options = this.vNodeComponentOptions(node, true);
        if (!options && !options.props) {
            return {};
        }
        return options.props;
    }

    public configurationTemplate(node) {
        return this.configurationDefaultTemplate(node);
    }

    public configurationDefaultTemplate(node) {
        if (!node.children || node.children === "object" || !node.children.default) {
            return;
        }

        return this.hasInlineTemplate(node.children.default()) ? node.children.default : null;
    }

    public children(component) {
        const allChildren = [];
        if (!this.hasChildren(component) || !component.$_config) {
            return allChildren;
        }
        this.getVNodeChildren(component.$.vnode.children.default(), allChildren, component.$_config.nested);
        return allChildren;
    }

    public saveComponentInstance(component) {
        const vNodeOptions = this.vNodeComponentOptions(component, true);

        if (vNodeOptions) {
            vNodeOptions.$_componentInstance = component;
        }
    }

    private findConfigurationComponents(allCildren, configComponents) {
        allCildren.forEach((child) => {
            if (child.type && typeof child.type === "object") {
                delete child.$_config;
                delete child.$_innerChanges;
                configComponents.push(child);
            }
        });
    }

    private hasInlineTemplate(allCildren) {
        let hasTemplate = false;
        allCildren.forEach((child) => {
            if (!(child.type && typeof child.type === "object" && child.type.data().$_optionName)) {
                hasTemplate = true;
            }
        });
        return hasTemplate;
    }

    private getVNodeChildren(children, allChildren, nested) {
        let nodeDetected = false;
        children.forEach((child, index) => {
            const id = nodeDetected ? index - 1 : index;
            if (child.type && typeof child.type === "object") {
                child.type = {...child.type};
                child.type.$_config = nested[id];
                child.$_config = nested[id];
                allChildren.push(child);
                if (child.children && child.children.default) {
                    this.getVNodeChildren(child.children.default(), allChildren, nested[id].nested);
                }
            } else {
                nodeDetected = true;
            }
        });
    }

    private hasChildren(component) {
        return component.$.vnode && component.$.vnode.children && component.$.vnode.children.default;
    }
}
