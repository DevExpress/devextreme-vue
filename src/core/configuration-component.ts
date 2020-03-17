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
}

function getConfig(vueInstance: Pick<IVue, "$vnode">): Configuration | undefined {
    if (!vueInstance.$vnode) {
        return;
    }

    const componentOptions = (vueInstance.$vnode.componentOptions as any as IConfigurable);

    return componentOptions && componentOptions.$_config;
}

function initOptionChangedFunc(config, vueInstance: Pick<IVue, "$vnode" | "$props" | "$emit">) {
    if (!config) {
        return;
    }

    config.init(Object.keys(vueInstance.$props));
    setEmitOptionChangedFunc(config, vueInstance);
}

const DxConfiguration: VueConstructor = Vue.extend({

    beforeMount() {
        const config = getConfig(this) as Configuration;
        initOptionChangedFunc(config, this);
        bindOptionWatchers(config, this);
    },

    mounted() {
        if ((this.$parent as any).$_instance) {
            (this.$parent as any).$_config.componentsCountChanged = true;
        }
    },

    beforeDestroy() {
        (this.$parent as any).$_config.componentsCountChanged = true;
    },

    render(createElement: (...args) => VNode): VNode {
        return createElement();
    }
});

export { DxConfiguration, IConfigurable, IConfigurationComponent, initOptionChangedFunc, getConfig };
