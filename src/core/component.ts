import * as VueType from "vue";
import IVue, { VNode, VueConstructor } from "vue";

import * as events from "devextreme/events";

import { pullAllChildren } from "./children-processing";
import Configuration, { bindOptionWatchers, subscribeOnUpdates } from "./configuration";
import { IConfigurable } from "./configuration-component";
import { camelize, toComparable } from "./helpers";

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
        pullAllChildren(this.$slots.default, children, this.$_config);

        return createElement(
            "div",
            {
                attrs: { id: this.$attrs.id }
            },
            children
        );
    },

    updated() {
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
                ...this.$_getIntegrationOptions(),
                ...this.$options.propsData,
                ...config.getInitialValues()
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

            if (this.$scopedSlots && Object.keys(this.$scopedSlots).length) {
                result.integrationOptions.templates = {};
                Object.keys(this.$scopedSlots).forEach((name: string) => {
                    result.integrationOptions.templates[name] = this.$_fillTemplate(this.$scopedSlots[name], name);
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

const DxComponent: VueConstructor = BaseComponent.extend({
    methods: {
        $_getExtraIntegrationOptions(): object {
            return {
                onInitializing() {
                    (this as any).beginUpdate();
                }
            };
        }
    },

    mounted(): void {
        this.$_createWidget(this.$el);
        this.$_instance.endUpdate();
        this.$children.forEach((child: any) => {
            if (child.$_isExtension) {
                child.attachTo(this.$el);
            }
        });
    }
});

export { DxComponent, BaseComponent, IWidgetComponent };
