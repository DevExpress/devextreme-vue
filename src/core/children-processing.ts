import { VNode } from "vue";
import Configuration from "./configuration";
import { IConfigurable, IConfigurationComponent } from "./configuration-component";
import { ComponentManager } from "./vue-strategy/component-manager";

function pullAllChildren(directChildren: VNode[], allChildren: VNode[], config: Configuration): void {
    if (!directChildren || directChildren.length === 0) { return; }

    pullConfigComponents(directChildren, allChildren, config);
}

function pullConfigComponents(children: VNode[], nodes: VNode[], ownerConfig: Configuration): void {

    children.forEach((node) => {
        nodes.push(node);
        if (!ComponentManager.componentOptions(node)) { return; }

        const configComponent = ComponentManager.getNestedComponentOptions(node) as any as IConfigurationComponent;
        if (!configComponent.$_optionName ) { return; }

        const componentChildren = ComponentManager.configurationChildren(node);
        const initialValues = {
            ...configComponent.$_predefinedProps,
            ...ComponentManager.usedConfigurationProps(node)
        };

        const config = ownerConfig.createNested(
            configComponent.$_optionName,
            initialValues,
            configComponent.$_isCollectionItem,
            configComponent.$_expectedChildren
        );

        (ComponentManager.getComponentOptions(node) as any as IConfigurable).$_config = config;
        (ComponentManager.getComponentOptions(node) as any as IConfigurable).$_innerChanges = {};

        if (componentChildren) {
            pullConfigComponents(componentChildren as VNode[], nodes, config);
        }
    });
}

export {
    pullAllChildren
};
