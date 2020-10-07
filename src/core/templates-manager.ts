import { ComponentPublicInstance, Slot } from "vue";
import { getOption } from "./config";
import {
    discover as discoverSlots,
    mountTemplate
} from "./templates-discovering";

import * as domAdapter from "devextreme/core/dom_adapter";
import * as events from "devextreme/events";
import { DX_REMOVE_EVENT, DX_TEMPLATE_WRAPPER_CLASS } from "./constants";
import { allKeysAreEqual } from "./helpers";

class TemplatesManager {
    private _component: ComponentPublicInstance;
    private _slots: Record<string, Slot> = {};
    private _templates: Record<string, object> = {};
    private _isDirty: boolean = false;

    constructor(component: ComponentPublicInstance) {
        this._component = component;
        this.discover();
    }

    public discover() {
        const slots = discoverSlots(this._component);
        this._slots = {
            ...this._slots,
            ...slots
        };

        if (!allKeysAreEqual(this._templates, slots)) {
            this._prepareTemplates();
        }
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

        for (const name of Object.keys(this._slots)) {
            this._templates[name] = this.createDxTemplate(name);
        }

        this._isDirty = true;
    }

    private createDxTemplate(name: string) {
        return {
            render: (data: any) => {
                const scopeData = getOption("useLegacyTemplateEngine")
                    ? data.model
                    : { data: data.model, index: data.index };

                const container = data.container.get ? data.container.get(0) : data.container;
                const mountedTemplate = mountTemplate(
                    () => this._slots[name],
                    this._component,
                    scopeData,
                    name,
                    container
                );

                const element = mountedTemplate.$el;

                domAdapter.setClass(element, DX_TEMPLATE_WRAPPER_CLASS, true);

                if (element.nodeType === Node.TEXT_NODE) {
                    const removalListener = document.createElement(container.nodeName === "TABLE" ? "tbody" : "span");
                    removalListener.style.display = "none";
                    container.appendChild(removalListener);
                    events.one(
                        removalListener,
                        DX_REMOVE_EVENT,
                        mountedTemplate.$.appContext.app.unmount.bind(mountedTemplate));
                } else {
                    events.one(
                        element,
                        DX_REMOVE_EVENT,
                        mountedTemplate.$.appContext.app.unmount.bind(mountedTemplate));
                }

                return element;
            }
        };
    }
}

export { TemplatesManager };
