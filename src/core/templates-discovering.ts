import Vue from "vue";
import { IConfigurable } from "./configuration-component";

const TEMPLATE_PROP = "template";

function extractScopedSlots(
    obj: Record<string, any>,
    nonScopedSlots: string[]
): Record<string, any> {

    const result = {};

    Object.keys(obj).forEach((key: string) => {
        if (nonScopedSlots && nonScopedSlots.indexOf(key) > -1) {
            return;
        }

        const value = obj[key];
        if (value instanceof Function) {
            result[key] = value;
        }
    });

    return result;
}

function asConfigurable(component: Vue): IConfigurable | undefined {
    if (!component.$vnode) {
        return undefined;
    }

    const configurable = component.$vnode.componentOptions as any as IConfigurable;
    if (!configurable.$_config || !configurable.$_config.name) {
        return undefined;
    }

    return configurable;
}

function hasTemplate(component: Vue) {
    return TEMPLATE_PROP in component.$props && (component.$vnode.data && component.$vnode.data.scopedSlots);
}

function discover(component: Vue): Record<string, any> {
    const templates = extractScopedSlots(component.$scopedSlots, Object.keys(component.$slots));

    for (const childComponent of component.$children) {
        const configurable = asConfigurable(childComponent);
        if (!configurable) {
            continue;
        }

        if (hasTemplate(childComponent)) {
            const templateName = `${configurable.$_config.fullPath}.${TEMPLATE_PROP}`;
            templates[templateName] = childComponent.$scopedSlots.default;
        }
    };

    return templates;
}

export {
    discover,
    extractScopedSlots
};
