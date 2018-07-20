import * as VueType from "vue";
import { VNode, VueConstructor } from "vue";

const Vue = VueType.default || VueType;

import Configuration, { bindOptionWatchers } from "./configuration";

interface IConfigurationCtor {
    $_optionName: string;
    $_isCollectionItem: boolean;
}

interface IConfigurable {
    $_config: Configuration;
}

const DxConfiguration: VueConstructor = Vue.extend({

    beforeMount() {
        (this.$vnode.componentOptions as any as IConfigurable).$_config.init(Object.keys(this.$props));
        bindOptionWatchers((this.$vnode.componentOptions as any as IConfigurable).$_config, this);
    },

    render(createElement: (...args) => VNode): VNode {
        return createElement();
    }
});

export { DxConfiguration, IConfigurable, IConfigurationCtor };
