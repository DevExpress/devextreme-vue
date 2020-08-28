import IVue, { VNode, VueConstructor } from "vue";
import { ComponentManager } from "./vue-strategy/component-manager";
import { isVue3 } from "./vue-strategy/version";

import Configuration, { bindOptionWatchers, ExpectedChild, setEmitOptionChangedFunc } from "./configuration";

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
    $_innerChanges: any;
}

interface IComponentInfo {
    optionPath: string;
    isCollection: boolean;
    removed?: boolean;
}

function getConfig(vueInstance: Pick<IVue, "$vnode"> | VNode): Configuration | undefined {
    const componentOptions = (ComponentManager.vNodeComponentOptions(vueInstance, false) as any as IConfigurable);
    if (!componentOptions) {
        return;
    }

    return componentOptions.$_config || (vueInstance as any).$_config;
}

function getInnerChanges(vueInstance: any): any {
    const componentOptions = (ComponentManager.vNodeComponentOptions(vueInstance, false) as any as IConfigurable);
    if (!componentOptions) {
        return;
    }

    return componentOptions.$_innerChanges || (vueInstance as any).$_innerChanges;
}

function initOptionChangedFunc(config, component: Pick<IVue, "$vnode" | "$props" | "$emit"> | any, innerChanges: any) {
    if (!config) {
        return;
    }

    config.init(Object.keys(ComponentManager.configurationProps(component)));
    const vueInstance = component.type && component.type.$_componentInstance ? component.type.$_componentInstance : component;
    setEmitOptionChangedFunc(config, vueInstance, innerChanges);
}

function getComponentInfo({name, isCollectionItem, ownerConfig }: Configuration, removed?: boolean): IComponentInfo {
    const parentPath =  ownerConfig && ownerConfig.fullPath;
    const optionPath = name && parentPath ? `${parentPath}.${name}` : name || "";

    return {
        optionPath,
        isCollection: isCollectionItem,
        removed
    };
}

const DxConfiguration: VueConstructor = ComponentManager.create({
    updated() {
        const vNodeOptions = ComponentManager.vNodeComponentOptions(this, false);
        if(vNodeOptions && vNodeOptions.type) {
            vNodeOptions.type.$_componentInstance = this;
        }
    },
    beforeMount() {
        const config = getConfig(this) as Configuration;
        const innerChanges = getInnerChanges(this);
        initOptionChangedFunc(config, this, innerChanges);
        bindOptionWatchers(config, this, innerChanges);
    },

    mounted() {
        if ((this.$parent as any).$_instance) {
            (this.$parent as any).$_config.componentsCountChanged
                .push(getComponentInfo(getConfig(this) as Configuration));
        }
    },

    beforeDestroy() {
        (this.$parent as any).$_config.componentsCountChanged
            .push(getComponentInfo(getConfig(this) as Configuration, true));
    },

    render(h: (...args) => VNode): VNode | null {
        const createElement = isVue3() ? () => null : h;
        return createElement();
    }
});

export {
    DxConfiguration,
    IComponentInfo,
    IConfigurable,
    IConfigurationComponent,
    initOptionChangedFunc,
    getConfig,
    getInnerChanges
};
