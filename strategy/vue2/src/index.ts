import * as VueType from "vue";
const Vue = VueType.default || VueType;

import { DxComponent } from "./component";
import { DxConfiguration } from "./configuration-component";
import { DxExtensionComponent } from "./extension-component";

export default {
    createComponent(config: any): any {
        config.extends = DxComponent();
        return Vue.extend(config);
    },

    createConfigurationComponent(config: any): any {
        config.extends = DxConfiguration();
        return Vue.extend(config);
    },

    createExtensionComponent(config: any): any {
        config.extends = DxExtensionComponent();
        return Vue.extend(config);
    }
}
