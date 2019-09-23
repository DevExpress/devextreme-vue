import * as VueType from "vue";
import IVue, { VNode, VueConstructor } from "vue";

import * as events from "devextreme/events";

import { pullAllChildren } from "./children-processing";
import Configuration, { bindOptionWatchers, subscribeOnUpdates } from "./configuration";
import { IConfigurable } from "./configuration-component";
import { IExtension, IExtensionComponentNode } from "./extension-component";
import { camelize, extractScopedSlots, forEachChildNode, toComparable } from "./helpers";

interface IWidgetComponent extends IConfigurable {
    $_instance: any;
    $_WidgetClass: any;
}

interface IEventBusHolder {
    eventBus: IVue;
}

interface IBaseComponent extends IVue, IWidgetComponent, IEventBusHolder {
    $_isExtension: boolean;
    $_createWidget: (element: any) => void;
    $_getIntegrationOptions: () => void;
    $_getExtraIntegrationOptions: () => void;
    $_getWatchMethod: () => void;
    $_createEmitters: () => void;
    $_fillTemplate: () => void;
    $_processChildren: () => void;
}

function asConfigurable(vueComponent: IVue): IConfigurable | undefined {
    if (!vueComponent.$vnode) {
        return undefined;
    }

    const configurable = vueComponent.$vnode.componentOptions as any as IConfigurable;
    if (!configurable.$_config || !configurable.$_config.name) {
        return undefined;
    }

    return configurable;
}

const Vue = VueType.default || VueType;

const DX_TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";
const DX_REMOVE_EVENT = "dxremove";

const BaseComponent: VueConstructor<IBaseComponent> = Vue.extend({

    inheritAttrs: false,

    data() {
        return {
            eventBus: new Vue()
        };
    },

    provide() {
        return {
            eventBus: this.eventBus
        };
    },

    render(createElement: (...args) => VNode): VNode {
        const children: VNode[] = [];

        if (this.$_config.cleanNested) {
            this.$_config.cleanNested();
        }
        pullAllChildren(this.$slots.default, children, this.$_config);

        this.$_processChildren(children);
        return createElement(
            "div",
            {
                attrs: { id: this.$attrs.id }
            },
            children
        );
    },

    beforeUpdate() {
        this.$_config.setPrevNestedOptions(this.$_config.getNestedOptionValues());
    },

    updated() {
        if (this.$_config.componentsCountChanged) {
            const options = this.$_config.getNestedOptionValues();
            const prevOptions = this.$_config.prevNestedOptions;
            const optionsList = Object.keys(options);
            const prevOptionsList = Object.keys(prevOptions);
            if (optionsList.length < prevOptionsList.length) {
                prevOptionsList.forEach((prevName) => {
                    const hasOption = optionsList.some((name) => {
                        return prevName === name;
                    });

                    if (!hasOption) {
                        const value = Array.isArray(prevOptions[prevName]) ? [] : {};
                        this.$_instance.option(prevName, value);
                    }
                });
            }

            for (const name in options) {
                if (options.hasOwnProperty(name)) {
                    this.$_instance.option(name, options[name]);
                }
            }

            this.$_config.componentsCountChanged = false;
        }
        this.eventBus.$emit("updated");
    },

    beforeDestroy(): void {
        const instance = this.$_instance;
        if (instance) {
            events.triggerHandler(this.$el, DX_REMOVE_EVENT);
            instance.dispose();
        }
    },

    created(): void {
        (this as IBaseComponent).$_config = new Configuration(
            (n: string, v: any) => this.$_instance.option(n, v),
            null,
            this.$options.propsData && { ...this.$options.propsData },
            this.$_expectedChildren
        );

        this.$_config.init(this.$props && Object.keys(this.$props));
    },

    methods: {
        $_createWidget(element: any): void {
            const innerChanges = {};
            const config = this.$_config;
            const options: object = {
                ...this.$options.propsData,
                ...config.initialValues,
                ...config.getNestedOptionValues(),
                ...this.$_getIntegrationOptions()
            };
            const instance = new this.$_WidgetClass(element, options);
            (this as IBaseComponent).$_instance = instance;

            instance.on("optionChanged", (args) => config.onOptionChanged(args));
            subscribeOnUpdates(config, this, innerChanges);
            bindOptionWatchers(config, this, innerChanges);
            this.$_createEmitters(instance);
        },

        $_getIntegrationOptions(): object {
            const TEMPLATE_PROP = "template";

            function shouldAddTemplate(child: IVue) {
                return TEMPLATE_PROP in child.$props
                && (child.$vnode.data && child.$vnode.data.scopedSlots);
            }

            const result: Record<string, any> = {
                integrationOptions:  {
                    watchMethod: this.$_getWatchMethod(),
                },
                ...this.$_getExtraIntegrationOptions(),
            };

            const templates = extractScopedSlots(this.$scopedSlots, Object.keys(this.$slots));

            this.$children.forEach((child: IVue) => {
                const configurable = asConfigurable(child);
                if (!configurable) {
                    return;
                }

                if (shouldAddTemplate(child)) {
                    const templateName = `${configurable.$_config.fullPath}.${TEMPLATE_PROP}`;
                    templates[templateName] = child.$scopedSlots.default;
                    result[templateName] = templateName;
                }
            });

            if (Object.keys(templates).length) {
                result.integrationOptions.templates = {};
                Object.keys(templates).forEach((name: string) => {
                    result.integrationOptions.templates[name] = this.$_fillTemplate(templates[name], name);
                });
            }

            return result;
        },

        $_getWatchMethod(): (
            valueGetter: () => any,
            valueChangeCallback: (value: any) => void,
            options: { deep: boolean, skipImmediate: boolean }
        ) => any {
            return (valueGetter, valueChangeCallback, options) => {
                options = options || {};
                if (!options.skipImmediate) {
                    valueChangeCallback(valueGetter());
                }

                return this.$watch(() => {
                    return valueGetter();
                }, (newValue, oldValue) => {
                    if (toComparable(oldValue) !== toComparable(newValue) || options.deep) {
                        valueChangeCallback(newValue);
                    }
                }, {
                    deep: options.deep
                });
            };
        },

        $_getExtraIntegrationOptions(): object {
            return {};
        },

        $_processChildren(_children: VNode[]): void {
            return;
        },

        $_fillTemplate(template: any, name: string): object {
            return {
                render: (data: any) => {
                    const vm = new Vue({
                        name,
                        inject: ["eventBus"],
                        parent: this,
                        created() {
                            (this as IEventBusHolder).eventBus.$on("updated", () => {
                                this.$forceUpdate();
                            });
                        },
                        render: () => template(data.model)
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

function cleanWidgetNode(node: Node) {
    forEachChildNode(node, (childNode: Element) => {
        const parent = childNode.parentNode;
        const isExtension = childNode.hasAttribute && childNode.hasAttribute("isExtension");
        if ((childNode.nodeName === "#comment" || isExtension) && parent) {
            parent.removeChild(childNode);
        }
    });
}

const DxComponent: VueConstructor = BaseComponent.extend({
    methods: {
        $_getExtraIntegrationOptions(): object {
            return {
                onInitializing() {
                    (this as any).beginUpdate();
                }
            };
        },

        $_processChildren(children: VNode[]): void {
            children.forEach((childNode: VNode) => {
                if (!childNode.componentOptions) { return; }

                (childNode.componentOptions as any as IExtensionComponentNode).$_hasOwner = true;
            });
        },
    },

    mounted(): void {
        cleanWidgetNode(this.$el);

        this.$_createWidget(this.$el);
        this.$_instance.endUpdate();
        this.$children.forEach((child: IVue) => {
            const childExtension = child as any as IExtension;
            if (childExtension.$_isExtension) {
                childExtension.attachTo(this.$el);
            }
        });
    }
});

export { DxComponent, BaseComponent, IWidgetComponent };
