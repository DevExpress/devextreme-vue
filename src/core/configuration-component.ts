import * as VueType from "vue";
import IVue, { VNode, VueConstructor } from "vue";
import { ComponentManager } from "./vue-strategy/component-manager";
import { isVue3 } from "./vue-strategy/version";

import Configuration, { bindOptionWatchers, ExpectedChild, setEmitOptionChangedFunc } from "./configuration";

const Vue = VueType.default || VueType;

interface IConfigurationOwner {
    $_expectedChildren: Record<string, ExpectedChild>;
}

interface IConfigurationComponent extends IConfigurationOwner {
    $_optionName: string;
    $_isCollectionItem: boolean;
    $_predefinedProps: Record<string, any>;
}

interface IConfigurable extends IConfigurationOwner {
    $_config: Configuration;
    $_innerChanges: any;
}

interface IComponentInfo {
    optionPath: string;
    isCollection: boolean;
    removed?: boolean;
}

function getConfig(vueInstance: Pick<IVue, "$vnode">): Configuration | undefined {
    const componentOptions = (ComponentManager.getVNodeOptions(vueInstance) as any as IConfigurable);
    if (!componentOptions) {
        return;
    }

    return componentOptions.$_config;
}

function getInnerChanges(vueInstance: Pick<IVue, "$vnode">): any {
    const componentOptions = (ComponentManager.getVNodeOptions(vueInstance) as any as IConfigurable);
    if (!componentOptions) {
        return;
    }

    return componentOptions.$_innerChanges;
}

function initOptionChangedFunc(config, vueInstance: Pick<IVue, "$vnode" | "$props" | "$emit">, innerChanges: any) {
    if (!config) {
        return;
    }
    
    config.init(Object.keys(ComponentManager.configurationProps(vueInstance)));
    setEmitOptionChangedFunc(config, vueInstance, innerChanges);
}

function getComponentInfo({name, isCollectionItem, ownerConfig }: Configuration, removed?: boolean): IComponentInfo {
    const parentPath =  ownerConfig && ownerConfig.fullPath;
    const optionPath = name && parentPath ? `${parentPath}.${name}` : name || "";

    return {
        optionPath,
        isCollection: isCollectionItem,
        removed
    };
}

const DxConfiguration: VueConstructor = ComponentManager.create({
    beforeMount() {
        const config = getConfig(this) as Configuration;
        const innerChanges = getInnerChanges(this);
        initOptionChangedFunc(config, this, innerChanges);
        bindOptionWatchers(config, this, innerChanges);
    },

    mounted() {
        if ((this.$parent as any).$_instance) {
            (this.$parent as any).$_config.componentsCountChanged
                .push(getComponentInfo(getConfig(this) as Configuration));
        }
    },

    beforeDestroy() {
        (this.$parent as any).$_config.componentsCountChanged
            .push(getComponentInfo(getConfig(this) as Configuration, true));
    },

    render(h: (...args) => VNode): VNode {
        const createElement = isVue3() ? (Vue as any).h : h;
        return createElement();
    }
});

export {
    DxConfiguration,
    IComponentInfo,
    IConfigurable,
    IConfigurationComponent,
    initOptionChangedFunc,
    getConfig,
    getInnerChanges
};
