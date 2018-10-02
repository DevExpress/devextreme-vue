import * as VueType from "vue";
import { VNode, VueConstructor } from "vue";

const Vue = VueType.default || VueType;

import Configuration, { bindOptionWatchers, subscribeOnUpdates } from "./configuration";

interface IConfigurationComponent {
    $_optionName: string;
    $_isCollectionItem: boolean;
}

interface IConfigurable {
    $_config: Configuration;
}

const DxConfiguration: VueConstructor = Vue.extend({

    beforeMount() {
        const config = (this.$vnode.componentOptions as any as IConfigurable).$_config;

        config.init(Object.keys(this.$props));
        bindOptionWatchers(config, this);
        subscribeOnUpdates(config, this);
    },

    render(createElement: (...args) => VNode): VNode {
        return createElement();
    }
});

export { DxConfiguration, IConfigurable, IConfigurationComponent };
