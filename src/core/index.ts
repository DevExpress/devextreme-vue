import { defineComponent, DefineComponent } from "vue";
import { DxExtensionComponent } from "./extension-component";
import { DxConfiguration } from "./configuration-component";
import { DxComponent } from "./component";
import { isVue3 } from "./version";

export declare type Props = Record<string, any>;
export declare type Slots = Record<string, () => any>;


export function createComponent(config: any): DefineComponent {
    config.extends = DxComponent;
    return defineComponent(config);
}

export function createConfigurationComponent(config: any): DefineComponent {
    config.extends = DxConfiguration;
    return defineComponent(config);
}

export function createExtentionComponent(config: any): DefineComponent {
    config.extends = DxExtensionComponent;
    return defineComponent(config);
}

export { isVue3 };
