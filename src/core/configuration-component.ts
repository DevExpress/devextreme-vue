import * as VueType from "vue";
import IVue, { VNode, VueConstructor } from "vue";

const Vue = VueType.default || VueType;

import Configuration, { bindOptionWatchers, ExpectedChild, setEmitOptionChangedFunc } from "./configuration";

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

function getConfig(vueInstance: Pick<IVue, "$vnode">): Configuration | undefined {
    if (!vueInstance.$vnode) {
        return;
    }

    const componentOptions = (vueInstance.$vnode.componentOptions as any as IConfigurable);

    return componentOptions && componentOptions.$_config;
}

function getInnerChanges(vueInstance: Pick<IVue, "$vnode">): any {
    if (!vueInstance.$vnode) {
        return;
    }

    const componentOptions = (vueInstance.$vnode.componentOptions as any as IConfigurable);

    return componentOptions && componentOptions.$_innerChanges;
}

function initOptionChangedFunc(config, vueInstance: Pick<IVue, "$vnode" | "$props" | "$emit">, innerChanges: any) {
    if (!config) {
        return;
    }

    config.init(Object.keys(vueInstance.$props));
    setEmitOptionChangedFunc(config, vueInstance, innerChanges);
}

function getComponentInfo(vueInstance: Pick<IVue, "$vnode">, removed?: boolean) {
    const config = getConfig(vueInstance) as Configuration;
    const name = config.name;
    const parentPath =  config.ownerConfig && config.ownerConfig.fullPath;
    const optionPath = parentPath ? `${parentPath}.${name}` : name;

    return {
        optionPath,
        isCollection: config.isCollectionItem,
        fullPath: config.fullPath,
        removed
    };
}

const DxConfiguration: VueConstructor = Vue.extend({
    beforeMount() {
        const config = getConfig(this) as Configuration;
        const innerChanges = getInnerChanges(this);
        initOptionChangedFunc(config, this, innerChanges);
        bindOptionWatchers(config, this, innerChanges);
    },

    mounted() {
        if ((this.$parent as any).$_instance) {
            (this.$parent as any).$_config.componentsCountChanged.push(getComponentInfo(this));
        }
    },

    beforeDestroy() {
        (this.$parent as any).$_config.componentsCountChanged.push(getComponentInfo(this, true));
    },

    render(createElement: (...args) => VNode): VNode {
        return createElement();
    }
});

export { DxConfiguration, IConfigurable, IConfigurationComponent, initOptionChangedFunc, getConfig, getInnerChanges };
