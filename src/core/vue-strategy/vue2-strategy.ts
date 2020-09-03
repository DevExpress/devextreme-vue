import * as VueType from "vue";
import { Component, VNode, VNodeComponentOptions } from "vue";
import { IConfigurationComponent } from "../configuration-component";
import { IEventBusHolder } from "../templates-discovering";
import { IVueStrategy, Props, Slots } from "./index";
const Vue = (VueType as any).default || VueType;

export class Vue2Strategy implements IVueStrategy {
    public configurationChildren(component): VNode[] {
        const configComponents = [];
        const children = component.componentOptions.children;
        if (!children) {
            return [];
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

    public childExtension(component) {
        return component.componentInstance;
    }

    public childrenToUpdate(component): VNode[] {
        return this.children(component);
    }

    public componentInfo(component): IConfigurationComponent {
        const componentOptions = this.componentOptions(component);
        return componentOptions && (componentOptions.Ctor as any).options.data();
    }

    public componentOptions(component): VNodeComponentOptions {
        return component.componentOptions;
    }

    public usedConfigurationProps(node): Props {
        return node.componentOptions.propsData;
    }

    public createComponent(config): Component {
        return Vue.extend(config);
    }

    public markAsExtention(component) {
        component.$_isExtension = true;
    }

    public mountTemplate(options, updatedHandler) {
        const templateMixin = this.createComponent({
            inject: ["eventBus"],
            created(this: any & IEventBusHolder) {
                (this as IEventBusHolder).eventBus.on("updated", updatedHandler.bind(this));
            },
            destroyed() {
                (this as IEventBusHolder).eventBus.off("updated", updatedHandler);
            }
        });
        options.mixins = [templateMixin];
        return new Vue(options);
    }

    public destroy(component) {
        return component.$destroy.bind(component);
    }

    public usedProps(component): Props {
        return component.$options.propsData;
    }

    public defaultSlots(component): VNode[] {
        if (!component.$slots.default) {
            return [];
        }
        return component.$slots.default;
    }

    public declaredTemplates(component): Slots {
        return component.$scopedSlots;
    }

    public componentInstance(component) {
        return component;
    }

    public configurationProps(node): Props {
        return node.$props;
    }

    public configurationTemplate(component): () => any {
        return component.$vnode.data && component.$vnode.data.scopedSlots;
    }

    public configurationDefaultTemplate(component): () => any | undefined {
        return component.$scopedSlots && component.$scopedSlots.default;
    }

    public children(component): VNode[] {
        return component.$children;
    }

    public saveComponentInstance() {
        return;
    }

    private findConfigurationComponents(allCildren, configComponents) {
        allCildren.forEach((child) => {
            if (child.componentOptions) {
                configComponents.push(child);
            }
        });
    }
}
