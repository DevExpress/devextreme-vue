import * as VueType from "vue";
import { VNode, VueConstructor } from "vue";

const Vue = VueType.default || VueType;

import { bindOptionWatchers, IConfigurable } from "./configuration";

const DxConfiguration: VueConstructor = Vue.extend({

    render(createElement: (...args) => VNode): VNode {
        return createElement();
    },

    methods: {
        $_initOption(name: string, isCollectionItem?: boolean): void {
            const options = Object.keys(this.$props);
            const initialValues = { ...this.$options.propsData };
            const config = (this.$parent as IConfigurable).$_config.createNested(
                name,
                options,
                initialValues,
                isCollectionItem
            );
            (this as any as IConfigurable).$_config = config;

            bindOptionWatchers(config, this);
        },

        $_initCollectionOption(name: string): void {
            this.$_initOption(name, true);
        }
    }
});

export { DxConfiguration };
