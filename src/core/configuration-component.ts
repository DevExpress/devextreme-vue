import { VNode } from "vue";
import {  isVue3, vueContext } from "./vue-strategy";

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
    $_componentInstance: any;
}

interface IComponentInfo {
    optionPath: string;
    isCollection: boolean;
    removed?: boolean;
}

function getConfig(vueInstance: any): Configuration | undefined {
    const componentOptions = (vueContext.vNodeComponentOptions(vueInstance) as any as IConfigurable);
    if (!componentOptions) {
        return;
    }

    return componentOptions.$_config || (vueInstance as any as IConfigurable).$_config;
}

function getInnerChanges(vueInstance: any): any {
    const componentOptions = (vueContext.vNodeComponentOptions(vueInstance) as any as IConfigurable);
    if (!componentOptions) {
        return;
    }

    return componentOptions.$_innerChanges || (vueInstance as any as IConfigurable).$_innerChanges;
}

function initOptionChangedFunc(config, component: any, innerChanges: any) {
    if (!config) {
        return;
    }

    config.init(Object.keys(vueContext.configurationProps(component)));
    const componentInstance = vueContext.getComponentInstance(component);
    if (componentInstance) {
        setEmitOptionChangedFunc(config, componentInstance, innerChanges);
    }
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

const DxConfiguration: any = vueContext.createComponent({
    updated() {
        vueContext.saveComponentInstance(this);
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

    beforeUnmount() {
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
