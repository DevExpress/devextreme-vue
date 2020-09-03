import { Component, VNode } from "vue";
import { IConfigurationComponent } from "../configuration-component";
import { IExtension } from "../extension-component";
import { isVue3 } from "./version";
import { Vue2Strategy } from "./vue2-strategy";
import { Vue3Strategy } from "./vue3-strategy";

export declare type Props = Record<string, any>;
export declare type Slots = Record<string, () => any>;

export interface IVueStrategy {
    children: (component: any) => VNode[];
    childExtension: (component: any) => IExtension;
    childrenToUpdate: (component: any) => VNode[];
    componentInfo: (component: any) => IConfigurationComponent;
    componentInstance: (component: any) => any;
    componentOptions: (component: any) => any;
    configurationChildren: (component: any) => VNode[];
    configurationDefaultTemplate: (component: any) => () => any | undefined;
    configurationProps: (component: any) => Props;
    configurationTemplate: (component: any) => () => any | undefined;
    createComponent: (component: any) => Component;
    declaredTemplates: (component: any) => Slots;
    defaultSlots: (component: any) => VNode[];
    destroy: (component: any) => any;
    markAsExtention: (component: any) => void;
    mountTemplate: (component: any, updatedHandler: () => void) => any;
    usedConfigurationProps: (component: any) => Props;
    usedProps: (component: any) => Props;
    saveComponentInstance: (component: any) => void;
    vNodeComponentOptions: (component: any, type?: boolean) => any;
}

function getCurrentStrategy() {
    const currentStrategy = isVue3() ? Vue3Strategy : Vue2Strategy;
    return new currentStrategy();
}

class VueStrategy {
    private context: IVueStrategy;

    constructor(context) {
        this.context = context;
    }

    public getContext(): IVueStrategy {
        return this.context;
    }
}

const vueStrategy = new VueStrategy(getCurrentStrategy());
export const vueContext = vueStrategy.getContext();
export { isVue3 };
