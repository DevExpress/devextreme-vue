import { VNode } from "vue";
import Configuration from "./configuration";
import { IConfigurable, IConfigurationComponent } from "./configuration-component";

function pullAllChildren(directChildren: VNode[], allChildren: VNode[], config: Configuration): void {
    if (!directChildren || directChildren.length === 0) { return; }

    pullConfigComponents(directChildren, allChildren, config);
}

function pullConfigComponents(children: VNode[], nodes: VNode[], ownerConfig: Configuration): void {

    children.forEach((node) => {
        nodes.push(node);
        if (!node.componentOptions) { return; }

        const configComponent = node.componentOptions.Ctor as any;
        const configData = configComponent.options && configComponent.options.data && configComponent.options.data() as any as IConfigurationComponent;
        if (!configData || !configData.$_optionName) { return; }

        const initialValues = {
            ...configData.$_predefinedProps,
            ...node.componentOptions.propsData
        };

        const config = ownerConfig.createNested(
            configData.$_optionName,
            initialValues,
            configData.$_isCollectionItem,
            configData.$_expectedChildren
        );

        (node.componentOptions as any as IConfigurable).$_config = config;
        (node.componentOptions as any as IConfigurable).$_innerChanges = {};

        if (node.componentOptions.children) {
            pullConfigComponents(node.componentOptions.children as VNode[], nodes, config);
        }
    });
}

export {
    pullAllChildren
};
