import * as VueType from "vue";
import { VNode, VueConstructor } from "vue";

import * as events from "devextreme/events";

import Configuration, { bindOptionWatchers } from "./configuration";
import { IConfigurable, IConfigurationCtor } from "./configuration-component";
import { camelize } from "./helpers";

interface IWidgetComponent extends IConfigurable {
    $_instance: any;
}

const Vue = VueType.default || VueType;

const DX_TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";
const DX_REMOVE_EVENT = "dxremove";

const BaseComponent: VueConstructor = Vue.extend({

    render(createElement: (...args) => VNode): VNode {
        return createElement(
            "div",
            extractChildren(this.$slots.default, (this as any as IWidgetComponent).$_config)
        );
    },

    beforeDestroy(): void {
        const instance = (this as any as IWidgetComponent).$_instance;
        if (instance) {
            events.triggerHandler(this.$el, DX_REMOVE_EVENT);
            instance.dispose();
        }
    },

    created(): void {

        (this as any as IWidgetComponent).$_config = new Configuration(
            (n: string, v: any) => (this as any as IWidgetComponent).$_instance.option(n, v),
            null,
            this.$options.propsData && { ...this.$options.propsData }
        );

        (this as any as IWidgetComponent).$_config.init(this.$props && Object.keys(this.$props));
    },

    methods: {
        $_createWidget(element: any): void {
            const options: object = {
                ...this.$_getIntegrationOptions(),
                ...this.$options.propsData,
                ...(this as any as IWidgetComponent).$_config.getInitialValues()
            };

            const instance = new (this as any).$_WidgetClass(element, options);
            (this as any as IWidgetComponent).$_instance = instance;

            instance.on("optionChanged", this.$_handleOptionChanged.bind(this));
            bindOptionWatchers((this as any as IWidgetComponent).$_config, this);
            this.$_createEmitters(instance);
        },
        $_getIntegrationOptions(): object {
            const slots: Record<string, any> = {
                ...this.$scopedSlots,
                ...this.$slots
            };
            delete slots.default;

            if (!Object.keys(slots).length) {
                return {};
            }

            const templates: Record<string, any> = {};

            Object.keys(slots).forEach((name: string) => {
                templates[name] = this.$_fillTemplate(slots[name], name);
            });

            return {
                integrationOptions: {
                    templates
                }
            };
        },

        $_fillTemplate(template: any, name: string): object {
            return {
                render: (data: any) => {
                    const vm = new Vue({
                        name,
                        parent: this,
                        render: () => {
                            return typeof template === "function" ? template(data.model) : template[0];
                        }
                    }).$mount();

                    const element = vm.$el;
                    element.classList.add(DX_TEMPLATE_WRAPPER_CLASS);

                    const container = data.container.get ? data.container.get(0) : data.container;
                    container.appendChild(element);

                    events.one(element, DX_REMOVE_EVENT, vm.$destroy.bind(vm));

                    return element;
                }
            };
        },

        $_handleOptionChanged(args: any): void {
            this.$emit("update:" + args.name, args.value);
        },

        $_createEmitters(instance: any): void {
            Object.keys(this.$listeners).forEach((listenerName: string) => {
                const eventName = camelize(listenerName);
                instance.on(eventName, (e: any) => {
                    this.$emit(listenerName, e);
                });
            });
        }
    }
});

const DxComponent: VueConstructor = BaseComponent.extend({
    mounted(): void {
        (this as any).$_createWidget(this.$el);
        this.$children.forEach((child: any) => {
            if (child.$_isExtension) {
                child.attachTo(this.$el);
            }
        });
    }
});

function extractChildren(children: VNode[], config: Configuration): VNode[] {
    if (!children || children.length === 0) { return children; }

    const nodes: VNode[] = [];
    pullConfigurations(children, nodes, config);

    return nodes;
}

function pullConfigurations(children: VNode[], nodes: VNode[], ownerConfig: Configuration): void {

    children.forEach((node) => {
        nodes.push(node);

        if (
            node.componentOptions &&
            (node.componentOptions.Ctor as any as IConfigurationCtor).$_optionName
        ) {
            const initialValues = { ...node.componentOptions.propsData };
            const config = ownerConfig.createNested(
                (node.componentOptions.Ctor as any as IConfigurationCtor).$_optionName,
                initialValues,
                (node.componentOptions.Ctor as any as IConfigurationCtor).$_isCollectionItem
            );

            (node.componentOptions as any as IConfigurable).$_config = config;

            if (node.componentOptions.children) {
                pullConfigurations(node.componentOptions.children as VNode[], nodes, config);
            }
        }
    });
}

export { DxComponent, BaseComponent, IWidgetComponent };
