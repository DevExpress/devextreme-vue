import IVue, { CreateElement } from "vue";
import { ScopedSlot } from "vue/types/vnode";
import { Emitter } from "mitt"

import { IConfigurable } from "./configuration-component";
import { TEMPLATE_MULTIPLE_ROOTS_ERROR } from "./errors";
import { ComponentManager } from "./vue-strategy/component-manager";

const TEMPLATE_PROP = "template";

interface IEventBusHolder {
    eventBus: Emitter;
}

function asConfigurable(component: IVue): IConfigurable | undefined {
    if (!component.$vnode) {
        return undefined;
    }

    const configurable = component.$vnode.componentOptions as any as IConfigurable;
    if (!configurable.$_config || !configurable.$_config.name) {
        return undefined;
    }

    return configurable;
}

function hasTemplate(component: IVue) {
    return TEMPLATE_PROP in component.$props && (component.$vnode.data && component.$vnode.data.scopedSlots);
}

function discover(component: IVue): Record<string, ScopedSlot> {
    const templates: Record<string, ScopedSlot> = {};
    const namedTeplates = ComponentManager.getNamedTemplates(component);
    for (const slotName in namedTeplates) {
        if (slotName === "default" && component.$slots.default) {
            continue;
        }

        const slot = namedTeplates[slotName];
        if (!slot) {
            continue;
        }

        templates[slotName] = slot;
    }

    for (const childComponent of component.$children) {
        const configurable = asConfigurable(childComponent);
        if (!configurable) {
            continue;
        }

        const defaultSlot = ComponentManager.getNamedTemplates(childComponent).default;
        if (!defaultSlot || !hasTemplate(childComponent)) {
            continue;
        }

        const templateName = `${configurable.$_config.fullPath}.${TEMPLATE_PROP}`;
        templates[templateName] = defaultSlot;
    }

    return templates;
}

function updateHandler(this: IVue & IEventBusHolder) {
    this.$forceUpdate();
}

function mountTemplate(
    getSlot: () => ScopedSlot,
    parent: IVue,
    data: any,
    name: string,
    placeholder: Element
): IVue {
    return ComponentManager.mount({
        el: placeholder,
        name,
        inject: ["eventBus"],
        parent,
        created(this: IVue & IEventBusHolder) {
            this.eventBus.on("updated", updateHandler.bind(this));
        },
        render: (createElement: CreateElement) => {
            const content = getSlot()(data) as any;
            if (!content) {
                return createElement("div");
            }

            if (content.length > 1) {
                throw new Error(TEMPLATE_MULTIPLE_ROOTS_ERROR);
            }

            return content[0];
        },
        destroyed() {
            // T857821
            (this as IEventBusHolder).eventBus.off("updated", updateHandler);
        }
    });
}

export {
    mountTemplate,
    discover,
    IEventBusHolder
};
