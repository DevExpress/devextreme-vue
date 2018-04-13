import Vue, { VueConstructor, VNode } from "vue";

import * as events from "devextreme/events";

const DX_TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";
const DX_REMOVE_EVENT = "dxremove";

const DxComponent: VueConstructor = Vue.extend({
    render(createElement : any) : VNode {
        return createElement('div', this.$slots.default)
    },

    mounted(): void {
        const options: object = {
            ...this.$_getIntegrationOptions(),
            ...this.$options.propsData
        };

        const instance = new (this as any).$_WidgetClass(this.$el, options);
        (this as any).$_instance = instance;

        instance.on("optionChanged", this.$_handleOptionChanged.bind(this));
        this.$_watchProps(instance);
        this.$_createEmitters(instance);
    },

    beforeDestroy(): void {
        events.triggerHandler(this.$el, DX_REMOVE_EVENT);
        (this as any).$_instance.dispose();
    },

    methods: {

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
                        render: () => {
                            return template(data.model);
                        }
                    }).$mount(document.createElement("div"));

                    const element = vm.$el;
                    element.className = DX_TEMPLATE_WRAPPER_CLASS;
                    data.container.appendChild(element);

                    events.one(element, DX_REMOVE_EVENT, () => {
                        vm.$destroy();
                    });

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
            Object.keys(this.$listeners).forEach((eventName: string) => {
                instance.on(eventName, (e: any) => {
                    this.$emit(eventName, e);
                });
            });
        }
    }
});

export default DxComponent;
