import * as VueType from "vue";
import IVue, { VNode, VueConstructor } from "vue";

import * as events from "devextreme/events";

import { pullAllChildren } from "./children-processing";
import Configuration, { bindOptionWatchers, setEmitOptionChangedFunc } from "./configuration";
import { getConfig, getInnerChanges, IConfigurable, initOptionChangedFunc } from "./configuration-component";
import { DX_REMOVE_EVENT } from "./constants";
import { IExtension, IExtensionComponentNode } from "./extension-component";
import { camelize, forEachChildNode, getOptionValue, toComparable } from "./helpers";
import { ComponentManager } from "./vue-strategy/component-manager";
import {
    IEventBusHolder
} from "./templates-discovering";
import { TemplatesManager } from "./templates-manager";
import { isVue3 } from "./vue-strategy/version";

interface IWidgetComponent extends IConfigurable {
    $_instance: any;
    $_WidgetClass: any;
    $_pendingOptions: Record<string, any>;
    $_templatesManager: TemplatesManager;
}

export interface IBaseComponent extends IVue, IWidgetComponent, IEventBusHolder {
    $_isExtension: boolean;
    $_applyConfigurationChanges: () => void;
    $_createWidget: (element: any) => void;
    $_getIntegrationOptions: () => void;
    $_getExtraIntegrationOptions: () => void;
    $_getWatchMethod: () => void;
    $_createEmitters: () => void;
    $_processChildren: () => void;
    $_getTemplates: () => object;
}

const Vue = VueType.default || VueType;

const BaseComponent: VueConstructor<any> = ComponentManager.create({

    inheritAttrs: false,

    render(h: (...args) => VNode): VNode {
        const children: VNode[] = [];
        const createElement = isVue3() ? (Vue as any).h : h;
        if (this.$_config.cleanNested) {
            this.$_config.cleanNested();
        }
        pullAllChildren(ComponentManager.defaultSlots(this), children, this.$_config);

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
        this.$_config.setPrevNestedOptions(this.$_config.getNestedOptionValues());
    },

    updated() {
        ComponentManager.childrenToUpdate(this).forEach((child: IVue) => initOptionChangedFunc(getConfig(child), child, getInnerChanges(child)));
        this.$_templatesManager.discover();

        this.$_instance.beginUpdate();
        if (this.$_templatesManager.isDirty) {
            this.$_instance.option(
                "integrationOptions.templates",
                this.$_templatesManager.templates
            );

            for (const name of Object.keys(this.$_templatesManager.templates)) {
                this.$_instance.option(name, name);
            }

            this.$_templatesManager.resetDirtyFlag();
        }

        for (const name of Object.keys(this.$_pendingOptions)) {
            this.$_instance.option(name, this.$_pendingOptions[name]);
        }
        (this as IBaseComponent).$_pendingOptions = {};

        this.$_applyConfigurationChanges();

        this.$_instance.endUpdate();
    },

    beforeDestroy(): void {
        const instance = this.$_instance;
        if (instance) {
            events.triggerHandler(this.$el, DX_REMOVE_EVENT);
            instance.dispose();
        }
    },

    created(): void {
        const props = ComponentManager.usedProps(this);
        (this as IBaseComponent).$_config = new Configuration(
            (n: string, v: any) => this.$_pendingOptions[n] = v,
            null,
            props && { ...props },
            this.$_expectedChildren
        );
        (this as IBaseComponent).$_innerChanges = {};

        this.$_config.init(this.$props && Object.keys(this.$props));
    },

    methods: {
        $_applyConfigurationChanges(): void {
            const thisComponent = this as any as IBaseComponent;
            thisComponent.$_config.componentsCountChanged.forEach(({ optionPath, isCollection, removed }) => {
                const options = thisComponent.$_config.getNestedOptionValues();

                if (!isCollection && removed) {
                    thisComponent.$_instance.resetOption(optionPath);
                } else {
                    thisComponent.$_instance.option(optionPath, getOptionValue(options, optionPath));
                }
            });

            thisComponent.$_config.cleanComponentsCountChanged();
        },
        $_createWidget(element: any): void {
            const thisComponent = this as any as IBaseComponent;

            thisComponent.$_pendingOptions = {};
            thisComponent.$_templatesManager = new TemplatesManager(thisComponent);

            const config = thisComponent.$_config;
            const options: object = {
                ...ComponentManager.usedProps(thisComponent),
                ...config.initialValues,
                ...config.getNestedOptionValues(),
                ...this.$_getIntegrationOptions()
            };

            const instance = new thisComponent.$_WidgetClass(element, options);
            thisComponent.$_instance = instance;

            instance.on("optionChanged", (args) => config.onOptionChanged(args));
            setEmitOptionChangedFunc(config, thisComponent, thisComponent.$_innerChanges);
            bindOptionWatchers(config, thisComponent, thisComponent.$_innerChanges);
            this.$_createEmitters(instance);
        },

        $_getIntegrationOptions(): object {
            const thisComponent = this as any as IBaseComponent;
            const result: Record<string, any> = {
                integrationOptions:  {
                    watchMethod: this.$_getWatchMethod(),
                },
                ...this.$_getExtraIntegrationOptions(),
            };

            if (thisComponent.$_templatesManager.isDirty) {
                const templates = thisComponent.$_templatesManager.templates;

                result.integrationOptions.templates = templates;
                for (const name of Object.keys(templates)) {
                    result[name] = name;
                }

                thisComponent.$_templatesManager.resetDirtyFlag();
            }

            return result;
        },

        $_getWatchMethod(): (
            valueGetter: () => any,
            valueChangeCallback: (value: any) => void,
            options: { deep: boolean, skipImmediate: boolean }
        ) => any {
            return (valueGetter, valueChangeCallback, options) => {
                const thisComponent = this as any as IBaseComponent;
                options = options || {};
                if (!options.skipImmediate) {
                    valueChangeCallback(valueGetter());
                }

                return thisComponent.$watch(() => {
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

        $_createEmitters(instance: any): void {
            const thisComponent = this as any as IBaseComponent;
            if(thisComponent.$listeners) {
                Object.keys(thisComponent.$listeners).forEach((listenerName: string) => {
                    const eventName = camelize(listenerName);
                    instance.on(eventName, (e: any) => {
                        thisComponent.$emit(listenerName, e);
                    });
                });
            }
        }
    }
});

function cleanWidgetNode(node: Node) {
    const removedNodes: Element[] = [];
    forEachChildNode(node, (childNode: Element) => {
        const parent = childNode.parentNode;
        const isExtension = childNode.hasAttribute && childNode.hasAttribute("isExtension");
        if ((childNode.nodeName === "#comment" || isExtension) && parent) {
            removedNodes.push(childNode);
            parent.removeChild(childNode);
        }
    });

    return removedNodes;
}

function restoreNodes(el: Element, nodes: Element[]) {
    nodes.forEach((node) => {
        el.appendChild(node);
    });
}

const DxComponent: VueConstructor = ComponentManager.create({
    extends: BaseComponent,
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
                const componentOptions = ComponentManager.componentOptions(childNode);
                if (!componentOptions || typeof componentOptions !== 'object') { return; }

                (componentOptions as any as IExtensionComponentNode).$_hasOwner = true;
            });
        },
    },

    mounted(): void {
        const nodes = cleanWidgetNode(this.$el);

        this.$_createWidget(this.$el);
        this.$_instance.endUpdate();

        restoreNodes(this.$el, nodes);
        if (this.$slots && this.$slots.default) {
            ComponentManager.defaultSlots(this).forEach((child: VNode) => {
                const childExtension = ComponentManager.vNodeComponentOptions(child, true) as any || child.componentInstance as any as IExtension;
                if (childExtension && childExtension.$_isExtension) {
                    childExtension.$_componentInstance.attachTo(this.$el);
                }
            });
        }
    }
});

export { DxComponent, BaseComponent, IWidgetComponent };
