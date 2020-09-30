import { ComponentPublicInstance, createApp, Slot, Slots, VNode, VNodeProps } from "vue";
import { camelize } from "./helpers";

import { IBaseComponent } from "./component";
import { IConfigurationComponent } from "./configuration-component";

import { isFragment } from "./children-processing";

export function getChildren(component: IBaseComponent): any {
    if (!hasChildren(component) || !component.$_config) {
        return [];
    }
    const children = component.$.subTree && component.$.subTree.children;
    if (!Array.isArray(children)) {
        return [];
    }
    return children.filter((child: VNode) => {
        if (!isFragment(child)) {
            return child as VNode;
        }
        return;
    });
}

export function getComponentInfo(component): IConfigurationComponent {
    return getConfigurationOptions(component);
}

export function getComponentInstance(component) {
    return component.type && component.type.$_componentInstance;
}

export function getNormalizedProps(props: VNodeProps): VNodeProps {
        const result = {};
        for (const propName in props) {
            if (props.hasOwnProperty(propName)) {
                result[camelize(propName)] = props[propName];
            }
        }
        return result;
}

export function configurationChildren(component): VNode[] {
    if (!component.children || !component.children.default) {
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

export function getComponentProps(component: ComponentPublicInstance): VNodeProps {
        const props = component.$.vnode.props || {};
        return getNormalizedProps(props);
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
        if (isFragment(child)) {
            return findConfigurationComponents((child as any).children || []);
        }
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
        if (!isConfiguration(child) && !isFragment(child)) {
            hasTemplate = true;
        }
    });
    return hasTemplate;
}

function isConfiguration(child): boolean {
    return child.type && typeof child.type === "object" && (child.type as any).$_optionName;
}

export function getConfigurationOptions(node: VNode): any {
    return node.type;
}

function hasChildren(component: ComponentPublicInstance) {
    return component.$.vnode && component.$.vnode.children && (component.$.vnode.children as any).default;
}
