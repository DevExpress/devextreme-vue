import Vue, { CreateElement } from "vue";
import { IConfigurable } from "./configuration-component";
import { ScopedSlot } from "vue/types/vnode";

const TEMPLATE_PROP = "template";

interface IEventBusHolder {
    eventBus: Vue;
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

function discover(component: Vue): Record<string, ScopedSlot> {
    const templates = { ...component.$scopedSlots };
    if (!!component.$slots["default"]) {
        delete templates.default;
    }

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

function mountTemplate(
    template: ScopedSlot,
    parent: Vue,
    data: any,
    name: string
): Vue {
    return new Vue({
        name,
        inject: ["eventBus"],
        parent,
        created(this: Vue & IEventBusHolder) {
            this.eventBus.$on("updated", () => {
                this.$forceUpdate();
            });
        },
        render: (createElement: CreateElement) => {
            var content = template(data);
            if (!content) {
                return createElement("div");
            }

            if (content.length === 1) {
                return content[0];
            }

            return createElement("div", content);
        }
    }).$mount();
}

export {
    mountTemplate,
    discover,
    IEventBusHolder
};
