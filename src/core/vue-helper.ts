import { ComponentPublicInstance, createApp, Slot, Slots, VNode, VNodeProps } from "vue";
import Configuration from "./configuration";
import { camelize } from "./helpers";

import { IBaseComponent } from "./component";
import { IConfigurable, IConfigurationComponent } from "./configuration-component";

import { pullAllChildren } from "./children-processing";

interface IConfigurableNode extends IConfigurable, VNode {}

export function getChildren(component: IBaseComponent): VNode[] {
    const children = [];
    if (!hasChildren(component) || !component.$_config) {
        return children;
    }
    pullConfigurationChildren(defaultSlots(component), children, component.$_config.nested);
    return children;
}

export function getExtension(component: VNode) {
    const vNode = getConfigurationOptions(component);
    if (!vNode.$_isExtension) { return; }

    vNode.attachTo = vNode.$_componentInstance.attachTo;
    return vNode;
}

export function getChildrenToUpdate(component: IBaseComponent): IConfigurableNode[] {
    const children = [];
    if (!hasChildren(component) || !component.$_config) {
        return children;
    }
    component.$_config.cleanNested();
    pullAllChildren(defaultSlots(component), children, component.$_config);
    return children;
}

export function getComponentInfo(component): IConfigurationComponent {
    const options = getConfigurationOptions(component);
    return options.data && options.data();
}

export function getComponentInstance(component) {
    return component.type && component.type.$_componentInstance;
}

export function configurationChildren(component): VNode[] {
    if (!component.children) {
        return [];
    }
    return findConfigurationComponents(component.children.default());
}

export function configurationDefaultTemplate(node): Slot | undefined {
    if (!node.children || node.children === "object" || !node.children.default) {
        return;
    }

    return hasInlineTemplate(node.children.default()) ? node.children.default : undefined;
}

export function configurationTemplate(node: VNode): Slot | undefined {
    return configurationDefaultTemplate(node);
}

export function declaredTemplates(component): Slots {
    return component.$slots;
}

export function defaultSlots(component: ComponentPublicInstance): VNode[] {
    const templates = declaredTemplates(component);
    if (!templates.default) {
        return [];
    }
    return templates.default();
}

export function mount(options, parent, el) {
    const template = createApp(options);
    template.provide("eventBus", parent.eventBus);
    return template.mount(el);
}

export function usedProps(component: ComponentPublicInstance): VNodeProps {
        const props = component.$.vnode.props;
        const result = {};
        for (const propName in props) {
            if (props.hasOwnProperty(propName)) {
                result[camelize(propName)] = props[propName];
            }
        }
        return result;
    }

export function usedConfigurationProps(node: VNode): VNodeProps | null {
    return node.props;
}

export function saveComponentInstance(component: ComponentPublicInstance) {
    const nodeOptions = getNodeTypeOfComponent(component);

    if (nodeOptions) {
        nodeOptions.$_componentInstance = component;
    }
}

export function getNodeOptions(component: Pick<ComponentPublicInstance, "$">) {
    if (component.$) {
        return component.$.vnode;
    }

    return component;
}

export function getNodeTypeOfComponent(component: Pick<ComponentPublicInstance, "$">): any {
    return component.$.vnode.type;
}

function findConfigurationComponents(children: VNode[]) {
    return children.filter((child) => {
        if (child.type && typeof child.type === "object") {
            delete (child as any).$_config;
            delete (child as any).$_innerChanges;
            return child;
        }
        return;
    });
}

function hasInlineTemplate(children: VNode[]): boolean {
    let hasTemplate = false;
    children.forEach((child) => {
        if (!(child.type && typeof child.type === "object" && (child.type as any).data().$_optionName)) {
            hasTemplate = true;
        }
    });
    return hasTemplate;
}

function pullConfigurationChildren(allChildren: VNode[], children: VNode[], nested: Configuration[]): void {
    let nodeDetected = false;
    allChildren.forEach((child: IConfigurableNode, index) => {
        const id = nodeDetected ? index - 1 : index;
        if (child.type && typeof child.type === "object") {
            restoreConfigData(child, children, nested, id);
        } else {
            nodeDetected = true;
        }
    });
}

function restoreConfigData(child: IConfigurableNode, children: VNode[], nested: Configuration[], id: number): void {
    if (child.type) {
        child.$_config = nested[id];
        children.push(child);
        const subChildren = (child.children as any);
        if (subChildren && subChildren.default) {
            pullConfigurationChildren(subChildren.default(), children, nested[id].nested);
        }
    }
}

export function getConfigurationOptions(node: VNode): any {
    return node.type;
}

function hasChildren(component: ComponentPublicInstance) {
    return component.$.vnode && component.$.vnode.children && (component.$.vnode.children as any).default;
}
