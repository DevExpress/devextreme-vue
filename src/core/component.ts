import * as VueType from "vue";
import { VNode, VueConstructor } from "vue";

import * as events from "devextreme/events";

import { camelize } from "./helpers";

const DX_TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";
const DX_REMOVE_EVENT = "dxremove";

const Vue = VueType.default || VueType;
const DxComponent: VueConstructor = Vue.extend({

    render(createElement: (...args) => VNode): VNode {
        return createElement("div", this.$slots.default);
    },

    mounted(): void {
        this.$_createWidget();
        this.$children.forEach((child: any) => {
            if (child.$isExtension) {
                child.$createInstance(this.$el);
            }
        });
    },

    beforeDestroy(): void {
        events.triggerHandler(this.$el, DX_REMOVE_EVENT);
        (this as any).$_instance.dispose();
    },

    methods: {
        $_createWidget(): void {
            this.$_createWidgetInstance(this.$el);
        },
        $_createWidgetInstance(element: any): void {
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
            if (!this.$scopedSlots || !Object.keys(this.$scopedSlots).length) {
                return {};
            }

            const templates: Record<string, any> = {};

            Object.keys(this.$scopedSlots).forEach((slotName: string) => {
                templates[slotName] = this.$_fillTemplate(this.$scopedSlots[slotName]);
            });

            return {
                integrationOptions: {
                    templates
                }
            };
        },

        $_fillTemplate(template: any): object {
            return {
                render: (data: any) => {
                    const vm = new Vue({
                        parent: this,
                        render: () => {
                            return template(data.model);
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

const DxExtensionComponent: VueConstructor = Vue.extend({
    extends: DxComponent,
    methods: {
        $_createWidget() {
            (this as any).$isExtension = true;
        },
        $createInstance(element: any) {
            (this as any).$_createWidgetInstance(element);
        }
    }
});

export { DxComponent, DxExtensionComponent };
