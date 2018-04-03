import Vue from "vue";
import Component from "vue-class-component";

import * as events from "devextreme/events";

const DX_TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";
const DX_REMOVE_EVENT = "dxremove";

@Component({
  template: "<div><slot/></div>"
})
export default class DxComponent extends Vue {
    protected _instance: any;

    public mounted(): void {
        const options: object = {
            ...this._getIntegrationOptions(),
            ...this.$options.propsData
        };
        this._instance = this._createWidget(this.$el, options);
        this._instance.on("optionChanged", this._handleOptionChanged.bind(this));
        this._watchProps();
        this._createEmitters();
    }

    public beforeDestroy(): void {
        events.triggerHandler(this.$el, DX_REMOVE_EVENT);
        this._instance.dispose();
    }

    protected _createWidget(element: HTMLElement, props: Record<string, any>): any {
        return null;
    }

    private _getIntegrationOptions(): object {
        if (!this.$scopedSlots || !Object.keys(this.$scopedSlots).length) {
            return {};
        }

        const result: any = {
            integrationOptions: {
                templates: {}
            }
        };

        Object.keys(this.$scopedSlots).forEach((slotName: string) => {
            result.integrationOptions.templates[slotName] = this._fillTemplate(this.$scopedSlots[slotName]);
        });

        return result;
    }

    private _fillTemplate(template: any): object {
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
    }

    private _handleOptionChanged(args: any): void {
        this.$emit("update:" + args.name, args.value);
    }

    private _watchProps(): void {
        if (!this.$props) {
            return;
        }
        Object.keys(this.$props).forEach((prop: string) => {
            this.$watch(prop, (value) => {
                this._instance.option(prop, value);
            });
        });
    }

    private _createEmitters(): void {
        Object.keys(this.$listeners).forEach((eventName: string) => {
            this._instance.on(eventName, (e: any) => {
                this.$emit(eventName, e);
            });
        });
    }
}
