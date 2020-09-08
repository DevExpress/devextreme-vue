import * as Vue from "vue";
import { VNode } from "vue";
import { IConfigurationComponent } from "../configuration-component";
import { camelize } from "../helpers";
import { IEventBusHolder } from "../templates-discovering";
import { IVueStrategy, Props, Slots } from "./index";

import { pullAllChildren } from "../children-processing";

export class Vue3Strategy implements IVueStrategy {

    public children(component): VNode[] {
        const allChildren = [];
        if (!this.hasChildren(component) || !component.$_config) {
            return allChildren;
        }
        this.getVNodeChildren(component.$.vnode.children.default(), allChildren, component.$_config.nested);
        return allChildren;
    }

    public getExtension(component) {
        const vNode = this.getNodeType(component);
        if (!vNode.$_isExtension) { return; }

        vNode.attachTo = vNode.$_componentInstance.attachTo;
        return vNode;
    }

    public getChildrenToUpdate(component): VNode[] {
        const children = [];
        if (!this.hasChildren(component) || !component.$_config) {
            return children;
        }
        component.$_config.cleanNested();
        pullAllChildren(this.defaultSlots(component), children, component.$_config);
        return children;
    }

    public getComponentInfo(component): IConfigurationComponent {
        const options = this.configurationOptions(component);
        return options.data && options.data();
    }

    public getComponentInstance(component) {
        return component.type ? component.type.$_componentInstance : component;
    }

    public getComponentOptions(component) {
        return component;
    }

    public configurationChildren(component): VNode[] {
        const configComponents = [];
        if (!component.children) {
            return [];
        }
        this.findConfigurationComponents(component.children.default(), configComponents);
        return configComponents;
    }

    public configurationDefaultTemplate(node): any {
        if (!node.children || node.children === "object" || !node.children.default) {
            return;
        }

        return this.hasInlineTemplate(node.children.default()) ? node.children.default : undefined;
    }

    public configurationProps(node): Props {
        const options = this.getNodeType(node);
        if (!options && !options.props) {
            return {};
        }
        return options.props;
    }

    public configurationTemplate(node): () => any | undefined {
        return this.configurationDefaultTemplate(node);
    }

    public createComponent(config): any {
        return (Vue as any).defineComponent(config);
    }

    public declaredTemplates(component): Slots {
        return component.$slots;
    }

    public defaultSlots(component): VNode[] {
        const templates = this.declaredTemplates(component);
        if (!templates.default) {
            return [];
        }
        return templates.default();
    }

    public destroy(component) {
        return component.$.appContext.app.unmount.bind(component);
    }

    public markAsExtention(component) {
        const vNodeOptions = this.getNodeType(component);
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

    public usedProps(component): Props {
        const props = component.$.vnode.props;
        const result = {};
        for (const propName in props) {
            if (props.hasOwnProperty(propName)) {
                result[camelize(propName)] = props[propName];
            }
        }
        return result;
    }

    public usedConfigurationProps(node): Props {
        return node.props;
    }

    public saveComponentInstance(component) {
        const vNodeOptions = this.getNodeType(component);

        if (vNodeOptions) {
            vNodeOptions.$_componentInstance = component;
        }
    }

    public getNodeOptions(component) {
        if (component.$) {
            return component.$.vnode;
        }

        return component.type;
    }

    private getNodeType(component) {
        if (!component.$) {
            return component.type;
        }

        return component.$.vnode.type;
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
                this.restorConfigData(child, allChildren, nested, id);
            } else {
                nodeDetected = true;
            }
        });
    }

    private restorConfigData(child, allChildren, nested, id) {
        child.type = {...child.type};
        child.type.$_config = nested[id];
        child.$_config = nested[id];
        allChildren.push(child);
        if (child.children && child.children.default) {
            this.getVNodeChildren(child.children.default(), allChildren, nested[id].nested);
        }
    }

    private configurationOptions(component) {
        return this.getComponentOptions(component).type;
    }

    private hasChildren(component) {
        return component.$.vnode && component.$.vnode.children && component.$.vnode.children.default;
    }
}
