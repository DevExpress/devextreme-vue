import { Emitter } from "mitt";
import { IConfigurable } from "./configuration-component";
import {
    configurationProps,
    configurationTemplate,
    declaredTemplates,
    getChildren,
    configurationDefaultTemplate,
    getConfigurationOptions,
    mount
} from "./vue-helper";


import { h, ComponentPublicInstance, Slot, VNode } from "vue";

import { TEMPLATE_MULTIPLE_ROOTS_ERROR } from "./errors";
import { IBaseComponent } from "./component";

const TEMPLATE_PROP = "template";

interface IEventBusHolder {
    eventBus: Emitter;
}

function asConfigurable(component: VNode): IConfigurable | undefined {
    const componentOptions = (component as any as IConfigurable);
    if (!componentOptions) {
        return;
    }
    if (!componentOptions.$_config || !componentOptions.$_config.name) {
        return undefined;
    }

    return componentOptions;
}

function hasTemplate(component: VNode) {
    return TEMPLATE_PROP in configurationProps(component) && configurationTemplate(component);
}

function discover(component: ComponentPublicInstance): Record<string, Slot> {
    const templates: Record<string, Slot> = {};
    const namedTeplates = declaredTemplates(component);
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
    const componentChildren = getChildren(component as IBaseComponent);
    for (const childComponent of componentChildren) {
        const configurable = asConfigurable(childComponent);
        if (!configurable) {
            continue;
        }

        const defaultSlot = configurationDefaultTemplate(childComponent);
        if (!defaultSlot || !hasTemplate(childComponent)) {
            continue;
        }

        const templateName = `${configurable.$_config.fullPath}.${TEMPLATE_PROP}`;
        templates[templateName] = defaultSlot;
    }

    return templates;
}

function clearConfiguration(content: VNode[]) {
    const newContent: VNode[] = [];
    content.forEach((item) => {
        const configurable = getConfigurationOptions(item);
        if (!configurable || !(configurable.data && configurable.data().$_optionName)) {
            newContent.push(item);
        }
    });
    return newContent;
}

function updatedHandler(this: ComponentPublicInstance) {
    this.$forceUpdate();
}

function mountTemplate(
    getSlot: () => Slot,
    parent: ComponentPublicInstance,
    data: any,
    name: string,
    placeholder: Element
): ComponentPublicInstance {
    return mount({
        el: placeholder,
        name,
        parent,
        render: (): VNode => {
            const content = clearConfiguration(getSlot()(data) as VNode[]);
            if (!content) {
                return h("div");
            }
            if (content.length > 1) {
                throw new Error(TEMPLATE_MULTIPLE_ROOTS_ERROR);
            }

            return content[0];
        }
    }, updatedHandler);
}

export {
    mountTemplate,
    discover,
    IEventBusHolder
};
