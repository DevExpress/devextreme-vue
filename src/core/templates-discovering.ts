import { Emitter } from "mitt";
import * as VueType from "vue";
import { IConfigurable } from "./configuration-component";
import { isVue3, IVue, vueContext } from "./vue-strategy";

import { TEMPLATE_MULTIPLE_ROOTS_ERROR } from "./errors";

const Vue = (VueType as any).default || VueType;
const TEMPLATE_PROP = "template";

interface IEventBusHolder {
    eventBus: Emitter;
}

function asConfigurable(component: any): IConfigurable | undefined {
    const componentOptions = (vueContext.getNodeOptions(component) as any as IConfigurable);
    if (!componentOptions) {
        return;
    }
    if (!componentOptions.$_config || !componentOptions.$_config.name) {
        return undefined;
    }

    return componentOptions;
}

function hasTemplate(component: any) {
    return TEMPLATE_PROP in vueContext.configurationProps(component) && vueContext.configurationTemplate(component);
}

function discover(component: any): Record<string, any> {
    const templates: Record<string, any> = {};
    const namedTeplates = vueContext.declaredTemplates(component);
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
    const componentChildren = vueContext.children(component);
    for (const childComponent of componentChildren) {
        const configurable = asConfigurable(childComponent);
        if (!configurable) {
            continue;
        }

        const defaultSlot = vueContext.configurationDefaultTemplate(childComponent);
        if (!defaultSlot || !hasTemplate(childComponent)) {
            continue;
        }

        const templateName = `${configurable.$_config.fullPath}.${TEMPLATE_PROP}`;
        templates[templateName] = defaultSlot;
    }

    return templates;
}

function clearConfiguration(content: any[]) {
    const newContent: any[] = [];
    content.forEach((item) => {
        const configurable = vueContext.getNodeOptions(item);
        if (!configurable || !(configurable.data && configurable.data().$_optionName)) {
            newContent.push(item);
        }
    });
    return newContent;
}

function updatedHandler(this: any) {
    this.$forceUpdate();
}

function mountTemplate(
    getSlot: () => any,
    parent: IVue,
    data: any,
    name: string,
    placeholder: Element
): IVue {
    return vueContext.mountTemplate({
        el: placeholder,
        name,
        parent,
        render: (h: any) => {
            const content = clearConfiguration(getSlot()(data) as any);
            if (!content) {
                const createElement = isVue3() ? Vue.h : h;
                return createElement("div");
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
