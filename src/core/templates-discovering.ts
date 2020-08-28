import { Emitter } from "mitt";
import IVue, { CreateElement } from "vue";
import { ScopedSlot } from "vue/types/vnode";
import { IConfigurable } from "./configuration-component";
import { TEMPLATE_MULTIPLE_ROOTS_ERROR } from "./errors";
import { vueContext } from "./vue-strategy/component-manager";

const TEMPLATE_PROP = "template";

interface IEventBusHolder {
    eventBus: Emitter;
}

function asConfigurable(component: IVue): IConfigurable | undefined {
    const componentOptions = (vueContext.vNodeComponentOptions(component, false) as any as IConfigurable);
    if (!componentOptions) {
        return;
    }
    if (!componentOptions.$_config || !componentOptions.$_config.name) {
        return undefined;
    }

    return componentOptions;
}

function hasTemplate(component: IVue) {
    return TEMPLATE_PROP in vueContext.configurationProps(component) && vueContext.configurationTemplate(component);
}

function discover(component: IVue): Record<string, ScopedSlot> {
    const templates: Record<string, ScopedSlot> = {};
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
        const configurable = vueContext.vNodeComponentOptions(item);
        if (!configurable || !configurable.$_optionName) {
            newContent.push(item);
        }
    });
    return newContent;
}

function updatedHandler(this: IVue) {
    this.$forceUpdate();
}

function mountTemplate(
    getSlot: () => ScopedSlot,
    parent: IVue,
    data: any,
    name: string,
    placeholder: Element
): IVue {
    return vueContext.mount({
        el: placeholder,
        name,
        inject: ["eventBus"],
        parent,
        created(this: IVue & IEventBusHolder) {
            this.eventBus.on("updated", updatedHandler.bind(this));
        },
        render: (createElement: CreateElement) => {
            const content = clearConfiguration(getSlot()(data) as any);
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
            (this as IEventBusHolder).eventBus.off("updated", updatedHandler);
        }
    });
}

export {
    mountTemplate,
    discover,
    IEventBusHolder
};
