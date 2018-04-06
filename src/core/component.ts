import Vue, { VueConstructor } from "vue";

import * as events from "devextreme/events";

const DX_TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";
const DX_REMOVE_EVENT = "dxremove";

const DxComponent: VueConstructor = Vue.extend({
    template: "<div><slot/></div>",

    mounted(): void {
        const options: object = {
            ...this._getIntegrationOptions(),
            ...this.$options.propsData
        };

        const instance = new (this as any)._Widget(this.$el, options);
        instance.on("optionChanged", this._handleOptionChanged.bind(this));
        (this as any)._instance = instance;
        this._watchProps();
        this._createEmitters();
    },

    beforeDestroy(): void {
        events.triggerHandler(this.$el, DX_REMOVE_EVENT);
        (this as any)._instance.dispose();
    },

    methods: {

        _getIntegrationOptions(): object {
            if (!this.$scopedSlots || !Object.keys(this.$scopedSlots).length) {
                return {};
            }

            const templates: Record<string, any> = {};

            Object.keys(this.$scopedSlots).forEach((slotName: string) => {
                templates[slotName] = this._fillTemplate(this.$scopedSlots[slotName]);
            });

            return {
                integrationOptions: {
                    templates
                }
            };
        },

        _fillTemplate(template: any): object {
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

        _handleOptionChanged(args: any): void {
            this.$emit("update:" + args.name, args.value);
        },

        _watchProps(): void {
            if (!this.$props) {
                return;
            }
            Object.keys(this.$props).forEach((prop: string) => {
                this.$watch(prop, (value) => {
                    (this as any)._instance.option(prop, value);
                });
            });
        },

        _createEmitters(): void {
            Object.keys(this.$listeners).forEach((eventName: string) => {
                (this as any)._instance.on(eventName, (e: any) => {
                    this.$emit(eventName, e);
                });
            });
        }
    }
});

export default DxComponent;

// export default class DxComponent extends Vue {
//     protected _instance: any;
//     protected _createWidget: (element: HTMLElement, props: Record<string, any>) => any;

//     public mounted(): void {
//         const options: object = {
//             ...this._getIntegrationOptions(),
//             ...this.$options.propsData
//         };
//         debugger;
//         this._instance = this._createWidget(this.$el, options);
//         this._instance.on("optionChanged", this._handleOptionChanged.bind(this));
//         this._watchProps();
//         this._createEmitters();
//     }

//     public beforeDestroy(): void {
//         events.triggerHandler(this.$el, DX_REMOVE_EVENT);
//         this._instance.dispose();
//     }

//     private _getIntegrationOptions(): object {
//         if (!this.$scopedSlots || !Object.keys(this.$scopedSlots).length) {
//             return {};
//         }

//         const templates: Record<string, any> = {};

//         Object.keys(this.$scopedSlots).forEach((slotName: string) => {
//             templates[slotName] = this._fillTemplate(this.$scopedSlots[slotName]);
//         });

//         return {
//             integrationOptions: {
//                 templates
//             }
//         };
//     }

//     private _fillTemplate(template: any): object {
//         return {
//             render: (data: any) => {
//                 const vm = new Vue({
//                     render: () => {
//                         return template(data.model);
//                     }
//                 }).$mount(document.createElement("div"));

//                 const element = vm.$el;
//                 element.className = DX_TEMPLATE_WRAPPER_CLASS;
//                 data.container.appendChild(element);

//                 events.one(element, DX_REMOVE_EVENT, () => {
//                     vm.$destroy();
//                 });

//                 return element;
//             }
//         };
//     }

//     private _handleOptionChanged(args: any): void {
//         this.$emit("update:" + args.name, args.value);
//     }

//     private _watchProps(): void {
//         if (!this.$props) {
//             return;
//         }
//         Object.keys(this.$props).forEach((prop: string) => {
//             this.$watch(prop, (value) => {
//                 this._instance.option(prop, value);
//             });
//         });
//     }

//     private _createEmitters(): void {
//         Object.keys(this.$listeners).forEach((eventName: string) => {
//             this._instance.on(eventName, (e: any) => {
//                 this.$emit(eventName, e);
//             });
//         });
//     }
// }
