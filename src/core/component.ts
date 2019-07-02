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
        this.$_config.setPrevNested(this.$_config.getNestedOptionValues());
    },

    updated() {
        if(this.$_config.hasOptionsToUpdate) {
            const options = this.$_config.getNestedOptionValues();
            const nestedOptions = Object.keys(options);
            const prevNestedOptions = Object.keys(this.$_config.prevNested);
            if(nestedOptions.length < prevNestedOptions.length) {
                prevNestedOptions.forEach((prevName) => {
                    const hasOption = nestedOptions.some((name) => {
                        return prevName === name;
                    });

                    if (!hasOption) {
                        this.$_instance.option(prevName, this[prevName]);
                    }
                });
            }
            for(const name in options) {
                this.$_instance.option(name, options[name]);
            }
            this.$_config.hasOptionsToUpdate = false;
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
            subscribeOnUpdates(config, this);
            bindOptionWatchers(config, this);
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

                    const mountedTemplate = mountTemplate(template, this, scopeData, name);

                    const element = mountedTemplate.$el;
                    if (element.classList) {
                        element.classList.add(DX_TEMPLATE_WRAPPER_CLASS);
                    }

                    const container = data.container.get ? data.container.get(0) : data.container;
                    container.appendChild(element);

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
    forEachChildNode(node, (childNode) => {
        if (childNode.nodeName === "#comment") {
            childNode.remove();
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
        this.$children.forEach((child: IExtension) => {
            if (child.$_isExtension) {
                child.attachTo(this.$el);
            }
        });
    }
});

export { DxComponent, BaseComponent, IWidgetComponent };
