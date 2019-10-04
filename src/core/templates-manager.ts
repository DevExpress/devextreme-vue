import IVue from "vue";
import { ScopedSlot } from "vue/types/vnode";
import { getOption } from "./config";
import {
    discover as discoverSlots,
    mountTemplate
} from "./templates-discovering";

import * as events from "devextreme/events";
import { DX_REMOVE_EVENT, DX_TEMPLATE_WRAPPER_CLASS } from "./constants";
import { haveEqualKeys } from "./helpers";

class TemplatesManager {
    private _component: IVue;
    private _slots: Record<string, ScopedSlot> = {};
    private _templates: Record<string, object> = {};
    private _isDirty: boolean = false;

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

        if (haveEqualKeys(this._templates, slots)) {
            return;
        }

        this._prepareTemplates();
    }

    public get templates() {
        return this._templates;
    }

    public get isDirty() {
        return this._isDirty;
    }

    public resetDirtyFlag() {
        this._isDirty = false;
    }

    private _prepareTemplates() {
        this._templates = {};

        Object.keys(this._slots).forEach(
            (name) => {
                this._templates[name] = this.prepareTemplate(name);
            }
        );

        this._isDirty = true;
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

    private 
}

export { TemplatesManager };
