import IVue, { CreateElement } from "vue";
import { ScopedSlot } from "vue/types/vnode";
import * as VueType from "vue";

import { IConfigurable } from "./configuration-component";
import { TEMPLATE_MULTIPLE_ROOTS_ERROR } from "./errors";

const TEMPLATE_PROP = "template";
const Vue = VueType.default || VueType;

interface IEventBusHolder {
    eventBus: IVue;
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
    for (const slotName in component.$scopedSlots) {
        if (slotName === "default" && component.$slots.default) {
            continue;
        }

        const slot = component.$scopedSlots[slotName];
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

        const defaultSlot = childComponent.$scopedSlots.default;
        if (!defaultSlot || !hasTemplate(childComponent)) {
            continue;
        }

        const templateName = `${configurable.$_config.fullPath}.${TEMPLATE_PROP}`;
        templates[templateName] = defaultSlot;
    }

    return templates;
}

function mountTemplate(
    template: ScopedSlot,
    parent: IVue,
    data: any,
    name: string
): IVue {
    return new Vue({
        name,
        inject: ["eventBus"],
        parent,
        created(this: IVue & IEventBusHolder) {
            this.eventBus.$on("updated", () => {
                this.$forceUpdate();
            });
        },
        render: (createElement: CreateElement) => {
            const content = template(data);
            if (!content) {
                return createElement("div");
            }

            if (content.length > 1) {
                throw new Error(TEMPLATE_MULTIPLE_ROOTS_ERROR);
            }

            return content[0];
        }
    }).$mount();
}

export {
    mountTemplate,
    discover,
    IEventBusHolder
};
