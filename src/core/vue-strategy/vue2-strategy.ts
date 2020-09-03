import * as VueType from "vue";
import { VNode } from "vue";
import { IConfigurationComponent } from "../configuration-component";
import { IEventBusHolder } from "../templates-discovering";
import { IVueStrategy, Props, Slots } from "./index";

const Vue = (VueType as any).default || VueType;

export class Vue2Strategy implements IVueStrategy {

    public children(component): VNode[] {
        return component.$children;
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

    public componentInstance(component) {
        return component;
    }

    public componentOptions(component): any {
        return component.componentOptions;
    }

    public configurationChildren(component): VNode[] {
        const configComponents = [];
        const children = component.componentOptions.children;
        if (!children) {
            return [];
        }
        this.findConfigurationComponents(component.componentOptions.children, configComponents);
        return configComponents;
    }

    public configurationDefaultTemplate(component): () => any | undefined {
        return component.$scopedSlots && component.$scopedSlots.default;
    }

    public configurationProps(node): Props {
        return node.$props;
    }

    public configurationTemplate(component): () => any {
        return component.$vnode.data && component.$vnode.data.scopedSlots;
    }

    public createComponent(config): any {
        return Vue.extend(config);
    }

    public declaredTemplates(component): Slots {
        return component.$scopedSlots;
    }

    public defaultSlots(component): VNode[] {
        if (!component.$slots.default) {
            return [];
        }
        return component.$slots.default;
    }

    public destroy(component) {
        return component.$destroy.bind(component);
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

    public usedConfigurationProps(node): Props {
        return node.componentOptions.propsData;
    }

    public usedProps(component): Props {
        return component.$options.propsData;
    }

    public saveComponentInstance() {
        return;
    }

    public vNodeComponentOptions(component) {
        if (!component.$vnode) {
            return this.componentOptions(component);
        }
        return component.$vnode.componentOptions;
    }

    private findConfigurationComponents(allCildren, configComponents) {
        allCildren.forEach((child) => {
            if (child.componentOptions) {
                configComponents.push(child);
            }
        });
    }
}
