import * as VueType from "vue";
import IVue, { VNode, VueConstructor } from "vue";
import { ScopedSlot } from "vue/types/vnode";

import * as events from "devextreme/events";

import { pullAllChildren } from "./children-processing";
import { getOption } from "./config";
import Configuration, { bindOptionWatchers, subscribeOnUpdates } from "./configuration";
import { IConfigurable } from "./configuration-component";
import { IExtension, IExtensionComponentNode } from "./extension-component";
import { camelize, forEachChildNode, toComparable } from "./helpers";
import {
    discover as discoverTemplates,
    IEventBusHolder,
    mountTemplate
} from "./templates-discovering";

interface IWidgetComponent extends IConfigurable {
    $_instance: any;
    $_WidgetClass: any;
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
            const result: Record<string, any> = {
                integrationOptions:  {
                    watchMethod: this.$_getWatchMethod(),
                },
                ...this.$_getExtraIntegrationOptions(),
            };

            const templates = discoverTemplates(this);

            if (Object.keys(templates).length) {
                result.integrationOptions.templates = {};
                Object.keys(templates).forEach((templateName: string) => {
                    result[templateName] = templateName;
                    result.integrationOptions.templates[templateName] = this.$_fillTemplate(
                        templates[templateName], templateName
                    );
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

        $_fillTemplate(template: ScopedSlot, name: string): object {
            return {
                render: (data: any) => {
                    const scopeData = getOption("useLegacyTemplateEngine")
                        ? data.model
                        : { data: data.model, index: data.index };

                    const container = data.container.get ? data.container.get(0) : data.container;
                    const placeholder = document.createElement("div");
                    container.appendChild(placeholder);
                    const mountedTemplate = mountTemplate(template, this, scopeData, name, placeholder);

                    const element = mountedTemplate.$el;
                    if (element.classList) {
                        element.classList.add(DX_TEMPLATE_WRAPPER_CLASS);
                    }

                    events.one(element, DX_REMOVE_EVENT, mountedTemplate.$destroy.bind(mountedTemplate));

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
    const removedNodes: Element[] = [];
    forEachChildNode(node, (childNode: Element) => {
        const parent = childNode.parentNode;
        const isExtension = childNode.hasAttribute && childNode.hasAttribute("isExtension");
        if ((childNode.nodeName === "#comment" || isExtension) && parent) {
            removedNodes.push(childNode);
            parent.removeChild(childNode);
        }
    });

    return removedNodes;
}

function restoreNodes(el: Element, nodes: Element[]) {
    for (const key in nodes) {
        if (nodes.hasOwnProperty(key)) {
            el.appendChild(nodes[key]);
        }
    }
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
        const nodes = cleanWidgetNode(this.$el);

        this.$_createWidget(this.$el);
        this.$_instance.endUpdate();

        restoreNodes(this.$el, nodes);
        this.$children.forEach((child: IVue) => {
            const childExtension = child as any as IExtension;
            if (childExtension.$_isExtension) {
                childExtension.attachTo(this.$el);
            }
        });
    }
});

export { DxComponent, BaseComponent, IWidgetComponent };
