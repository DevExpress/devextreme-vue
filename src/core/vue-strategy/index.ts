import { IExtension } from "../extension-component";
import { isVue3 } from "./version";
import { Vue2Strategy } from "./vue2-strategy";
import { Vue3Strategy } from "./vue3-strategy";
// import { IConfigurable } from "../configuration-component";

export interface IVueStrategy {
    children: (component: any) => any;
    childExtension: (component: any) => IExtension;
    childrenToUpdate: (component: any) => any;
    componentInfo: (component: any) => any;
    componentInstance: (component: any) => any;
    componentOptions: (component: any) => any;
    configurationChildren: (component: any) => any;
    configurationDefaultTemplate: (component: any) => any;
    configurationOptions: (component: any) => any;
    configurationProps: (component: any) => any;
    configurationTemplate: (component: any) => any;
    createComponent: (component: any) => any;
    declaredTemplates: (component: any) => any;
    defaultSlots: (component: any) => any | undefined;
    destroy: (component: any) => any;
    markAsExtention: (component: any) => void;
    mountTemplate: (component: any, updatedHandler: () => void) => any;
    usedConfigurationProps: (component: any) => any;
    usedProps: (component: any) => any;
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
