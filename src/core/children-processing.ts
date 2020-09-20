import { VNode } from "vue";
import Configuration from "./configuration";
import { IConfigurable, IConfigurationComponent } from "./configuration-component";
import { configurationChildren, getComponentInfo } from "./vue-helper";

function pullAllChildren(directChildren: VNode[], allChildren: VNode[], config: Configuration): void {
    if (!directChildren || directChildren.length === 0) { return; }

    pullConfigComponents(directChildren, allChildren, config);
}

function pullConfigComponents(children: VNode[], nodes: VNode[], ownerConfig: Configuration): void {

    children.forEach((node) => {
        nodes.push(node);
        if (!node) { return; }

        const componentInfo = getComponentInfo(node) as any as IConfigurationComponent;
        if (!componentInfo) { return; }

        const componentChildren = configurationChildren(node);
        const initialValues = {
            ...componentInfo.$_predefinedProps,
            ...node.props
        };

        const config = ownerConfig.createNested(
            componentInfo.$_optionName,
            initialValues,
            componentInfo.$_isCollectionItem,
            componentInfo.$_expectedChildren
        );

        (node as any as IConfigurable).$_config = config;
        (node as any as IConfigurable).$_innerChanges = {};

        if (componentChildren) {
            pullConfigComponents(componentChildren as VNode[], nodes, config);
        }
    });
}

export {
    pullAllChildren
};
