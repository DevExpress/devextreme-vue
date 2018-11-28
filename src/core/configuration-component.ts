import * as VueType from "vue";
import VueDefault, { VNode, VueConstructor } from "vue";

const Vue = VueDefault || VueType;

import Configuration, { bindOptionWatchers, ExpectedChild, subscribeOnUpdates } from "./configuration";

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

const DxConfiguration: VueConstructor = Vue.extend({

    beforeMount() {
        const config = (this.$vnode.componentOptions as IConfigurable).$_config;

        config.init(Object.keys(this.$props));
        bindOptionWatchers(config, this);
        subscribeOnUpdates(config, this);
    },

    render(createElement: (...args) => VNode): VNode {
        return createElement();
    }
});

export { DxConfiguration, IConfigurable, IConfigurationComponent };
