import { VNode } from "vue";
import Configuration from "./configuration";
import { IConfigurationComponent } from "./configuration-component";
import { vueContext } from "./vue-strategy/component-manager";

function pullAllChildren(directChildren: VNode[], allChildren: VNode[], config: Configuration): void {
    if (!directChildren || directChildren.length === 0) { return; }

    pullConfigComponents(directChildren, allChildren, config);
}

function pullConfigComponents(children: VNode[], nodes: VNode[], ownerConfig: Configuration): void {

    children.forEach((node) => {
        nodes.push(node);
        if (!vueContext.componentOptions(node)) { return; }

        const configComponent = vueContext.configurationOptions(node) as any as IConfigurationComponent;
        if (!configComponent.$_optionName ) { return; }

        const componentChildren = vueContext.configurationChildren(node);
        const initialValues = {
            ...configComponent.$_predefinedProps,
            ...vueContext.usedConfigurationProps(node)
        };

        const config = ownerConfig.createNested(
            configComponent.$_optionName,
            initialValues,
            configComponent.$_isCollectionItem,
            configComponent.$_expectedChildren
        );
        const componentOpt = vueContext.componentOptions(node);
        Object.defineProperty(componentOpt, "$_config", { value: config })
        // (vueContext.componentOptions(node) as any).$_config = config;
        (vueContext.componentOptions(node) as any).$_innerChanges = {};

        if (componentChildren) {
            pullConfigComponents(componentChildren as VNode[], nodes, config);
        }
    });
}

export {
    pullAllChildren
};
