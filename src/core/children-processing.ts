import { VNode } from "vue";
import Configuration from "./configuration";
import { IConfigurable, IConfigurationComponent } from "./configuration-component";
import { vueContext } from "./vue-strategy";

function pullAllChildren(directChildren: VNode[], allChildren: VNode[], config: Configuration): void {
    if (!directChildren || directChildren.length === 0) { return; }

    pullConfigComponents(directChildren, allChildren, config);
}

function pullConfigComponents(children: VNode[], nodes: VNode[], ownerConfig: Configuration): void {

    children.forEach((node) => {
        nodes.push(node);
        const componentOptions = vueContext.getComponentOptions(node);
        if (!componentOptions) { return; }

        const componentInfo = vueContext.getComponentInfo(node) as any as IConfigurationComponent;
        if (!componentInfo) { return; }

        const componentChildren = vueContext.configurationChildren(node);
        const initialValues = {
            ...componentInfo.$_predefinedProps,
            ...vueContext.usedConfigurationProps(node)
        };

        const config = ownerConfig.createNested(
            componentInfo.$_optionName,
            initialValues,
            componentInfo.$_isCollectionItem,
            componentInfo.$_expectedChildren
        );

        (componentOptions as IConfigurable).$_config = config;
        (componentOptions as IConfigurable).$_innerChanges = {};

        if (componentChildren) {
            pullConfigComponents(componentChildren as VNode[], nodes, config);
        }
    });
}

export {
    pullAllChildren
};
