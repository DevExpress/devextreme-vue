import * as VueType from "vue";
import { VNode, VueConstructor } from "vue";

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

function getConfig(vueInstance) {
    if (!vueInstance.$vnode) {
        return;
    }

    const componentOptions = (vueInstance.$vnode.componentOptions as any as IConfigurable);
    const config = componentOptions && componentOptions.$_config;

    return config;
}

function initOptionChangedFunc(vueInstance) {
    const config = getConfig(vueInstance);

    if (!config) {
        return;
    }

    const innerChanges = {};
    config.init(Object.keys(vueInstance.$props));
    setEmitOptionChangedFunc(config, vueInstance, innerChanges);
}

const DxConfiguration: VueConstructor = Vue.extend({

    beforeMount() {
        const innerChanges = {};
        const config = getConfig(this) as Configuration;

        initOptionChangedFunc(this);
        bindOptionWatchers(config, this, innerChanges);
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

export { DxConfiguration, IConfigurable, IConfigurationComponent, initOptionChangedFunc };
