import * as VueType from "vue";
const Vue = VueType.default || VueType;

import { initDxComponent } from "./component";
import { initDxConfigurationComponent } from "./configuration-component";
import { initDxExtensionComponent } from "./extension-component";

export default {
    createComponent(config: any): any {
        config.extends = initDxComponent();
        return Vue.extend(config);
    },

    createConfigurationComponent(config: any): any {
        config.extends = initDxConfigurationComponent();
        return Vue.extend(config);
    },

    createExtensionComponent(config: any): any {
        config.extends = initDxExtensionComponent();
        return Vue.extend(config);
    }
}
