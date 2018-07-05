import * as VueType from "vue";
import { VNode, VueConstructor } from "vue";

import * as events from "devextreme/events";

import { camelize } from "./helpers";

const DX_TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";
const DX_REMOVE_EVENT = "dxremove";

const Vue = VueType.default || VueType;
const BaseComponent: VueConstructor = Vue.extend({

    render(createElement: (...args) => VNode): VNode {
        return createElement("div", this.$slots.default);
    },

    beforeDestroy(): void {
        const instance = (this as any).$_instance;
        if (instance) {
            events.triggerHandler(this.$el, DX_REMOVE_EVENT);
            instance.dispose();
        }
    },

    methods: {
        $_createWidget(element: any): void {
            const options: object = {
                ...this.$_getIntegrationOptions(),
                ...this.$options.propsData
            };

            const instance = new (this as any).$_WidgetClass(element, options);
            (this as any).$_instance = instance;

            instance.on("optionChanged", this.$_handleOptionChanged.bind(this));
            this.$_watchProps(instance);
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
                templates[name] = this.$_fillTemplate(slots, name);
            });

            return {
                integrationOptions: {
                    templates
                }
            };
        },

        $_fillTemplate(slots: Record<string, any>, name: string): object {
            return {
                render: (data: any) => {
                    const vm = new Vue({
                        name,
                        parent: this,
                        render: () => {
                            const template = slots[name];
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

        $_watchProps(instance: any): void {
            if (!this.$props) {
                return;
            }
            Object.keys(this.$props).forEach((prop: string) => {
                this.$watch(prop, (value) => {
                    instance.option(prop, value);
                });
            });
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

const DxExtensionComponent: VueConstructor = BaseComponent.extend({
    created(): void {
        (this as any).$_isExtension = true;
    },
    methods: {
        attachTo(element: any) {
            (this as any).$_createWidget(element);
        }
    }
});

export { DxComponent, DxExtensionComponent };
