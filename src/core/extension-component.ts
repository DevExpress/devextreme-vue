import { VueConstructor } from "vue";
import { IBaseComponent, BaseComponent } from "./component";
import { ComponentManager } from "./vue-strategy/component-manager";

interface IExtension {
    $_isExtension: boolean;
    attachTo(element: any);
}

interface IExtensionComponentNode {
    $_hasOwner: boolean;
}

const DxExtensionComponent: VueConstructor = ComponentManager.create({
    extends: BaseComponent,
    created(): void {
        const vNodeOptions = ComponentManager.vNodeComponentOptions(this, true);
        if(vNodeOptions) {
            vNodeOptions.$_isExtension = true;
            vNodeOptions.$_componentInstance = this;
        } else {
            this.$_isExtension = true;
        }
    },

    mounted() {
        this.$el.setAttribute("isExtension", "true");
        const componentOptions = ComponentManager.vNodeComponentOptions(this, false);
        if (componentOptions && (componentOptions as any as IExtensionComponentNode).$_hasOwner) { return; }

        this.attachTo(this.$el);
    },

    methods: {
        attachTo(element: any) {
            (this as any as IBaseComponent).$_createWidget(element);
        }
    }
});

export {
    DxExtensionComponent,
    IExtension,
    IExtensionComponentNode
};
