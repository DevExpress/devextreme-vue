import IVue from "vue";
import { ScopedSlot } from "vue/types/vnode";
import { getOption } from "./config";
import {
    discover as discoverSlots,
    mountTemplate
} from "./templates-discovering";

import * as events from "devextreme/events";
import { DX_REMOVE_EVENT, DX_TEMPLATE_WRAPPER_CLASS } from "./constants";

class TemplatesManager {
    private _component: IVue;
    private _slots: Record<string, ScopedSlot> = {};

    constructor(component: IVue) {
        this._component = component;
        this.discover();

        this._getSlot = this._getSlot.bind(this);
    }

    public discover() {
        const slots = discoverSlots(this._component);
        this._slots = {
            ...this._slots,
            ...slots
        };
    }

    public getTemplates() {
        const result: Record<string, any> = {};

        Object.keys(this._slots).forEach(
            (name) => {
                result[name] = this.prepareTemplate(name);
            }
        );

        return result;
    }

    public get hasTemplates() {
        return Object.keys(this._slots).length > 0;
    }

    private prepareTemplate(
        name: string
    ) {
        return {
            render: (data: any) => {
                const scopeData = getOption("useLegacyTemplateEngine")
                    ? data.model
                    : { data: data.model, index: data.index };

                const container = data.container.get ? data.container.get(0) : data.container;
                const placeholder = document.createElement("div");
                container.appendChild(placeholder);
                const mountedTemplate = mountTemplate(
                    () => this._getSlot(name),
                    this._component,
                    scopeData,
                    name,
                    placeholder
                );

                const element = mountedTemplate.$el;
                if (element.classList) {
                    element.classList.add(DX_TEMPLATE_WRAPPER_CLASS);
                }

                events.one(element, DX_REMOVE_EVENT, mountedTemplate.$destroy.bind(mountedTemplate));

                return element;
            }
        };
    }

    private _getSlot(name: string) {
        return this._slots[name];
    }
}

export { TemplatesManager };
