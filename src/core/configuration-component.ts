import * as VueType from "vue";
import { VNode, VueConstructor } from "vue";

const Vue = VueType.default || VueType;

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

    mounted() {
        if (this.$parent.$_instance) {
            this.$parent.$_config.componentsCountChanged = true;
        }
    },

    beforeDestroy() {
        this.$parent.$_config.componentsCountChanged = true;
    },

    render(createElement: (...args) => VNode): VNode {
        return createElement();
    }
});

export { DxConfiguration, IConfigurable, IConfigurationComponent };
