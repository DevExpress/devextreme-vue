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
    const componentOptions = (ComponentManager.getVNodeOptions(component) as any as IConfigurable);
    if (!componentOptions) {
        return;
    }
    if (!componentOptions.$_config || !componentOptions.$_config.name) {
        return undefined;
    }

    return componentOptions;
}

function hasTemplate(component: IVue) {
    return TEMPLATE_PROP in ComponentManager.configurationProps(component) && ComponentManager.configurationTemplate(component);
}

function discover(component: IVue): Record<string, ScopedSlot> {
    const templates: Record<string, ScopedSlot> = {};
    const namedTeplates = ComponentManager.declaredTemplates(component);
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
    const componentChildren = ComponentManager.children(component);
    for (const childComponent of componentChildren) {
        const configurable = asConfigurable(childComponent);
        if (!configurable) {
            continue;
        }

        const defaultSlot = ComponentManager.configurationDefaultTemplate(childComponent);
        if (!defaultSlot || !hasTemplate(childComponent)) {
            continue;
        }

        const templateName = `${configurable.$_config.fullPath}.${TEMPLATE_PROP}`;
        templates[templateName] = defaultSlot;
    }

    return templates;
}

function clearConfiguration(content: any[]) {
    let newContent: any[] = [];
    content.forEach(item => {
        const configurable = ComponentManager.getVNodeOptions(item);
        if(!configurable || !configurable.$_optionName) {
            newContent.push(item);
        }
    });
    return newContent;
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
        parent,
        render: (createElement: CreateElement) => {
            const content = clearConfiguration(getSlot()(data) as any);
            if (!content) {
                return createElement("div");
            }
            if (content.length > 1) {
                throw new Error(TEMPLATE_MULTIPLE_ROOTS_ERROR);
            }

            return content[0];
        }
    });
}

export {
    mountTemplate,
    discover,
    IEventBusHolder
};
